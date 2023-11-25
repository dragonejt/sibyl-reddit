import { CommentCreate, SubredditV2, UserV2 } from "@devvit/protos";
import { CommentCreateDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { moderateMessage } from "./onPostCreate.js";
import { PsychoPass, PsychoPasses } from "../clients/backend/psychopass/psychoPasses.js";
import { MemberDominator, MemberDominators } from "../clients/backend/dominator/memberDominators.js";
import { ACTIONS, ATTRIBUTES, Reason } from "../clients/constants.js";

export const onCommentCreate: CommentCreateDefinition = {
    event: "CommentCreate",
    onEvent: async (event: CommentCreate, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment on r/${event.subreddit?.name}/${event.post?.id}`);
        const analysis = await analyzeComment(event.comment?.body!);

        moderateMessage(event.author!, event.subreddit!, event.post!, context, analysis!);
        moderateMember(event.author!, event.subreddit!, context);
    }
}

export async function moderateMember(author: UserV2, subreddit: SubredditV2, context: TriggerContext) {
    if (author.id === context.appAccountId || subreddit.nsfw) return;

    const approvedUsers = await context.reddit.getApprovedUsers({
        subredditName: subreddit.name,
        username: author.name
    }).all()
    if (approvedUsers.length > 0) return;

    const [psychoPass, dominator] = await Promise.all([PsychoPasses.read(author.id), MemberDominators.read(subreddit.id)]);
    if (psychoPass === undefined || dominator === undefined) throw new Error("Psycho-Pass or Dominator undefined!");
    if (psychoPass.messages < 25) return;

    let maxAction = -1;
    const reasons: Reason[] = [];
    for (const attribute of ATTRIBUTES) {
        const score = psychoPass[attribute as keyof PsychoPass] as number;
        const threshold = dominator[`${attribute}_threshold` as keyof MemberDominator] as number;
        if (score >= threshold) {
            const action = dominator[`${attribute}_action` as keyof MemberDominator] as number;
            maxAction = Math.max(maxAction, action);
            reasons.push({ attribute, score, threshold });
        }
    }
    if (psychoPass.crime_coefficient >= 300) {
        maxAction = Math.max(maxAction, dominator.crime_coefficient_300_action);
        reasons.push({
            attribute: "crime_coefficient_300",
            score: psychoPass.crime_coefficient,
            threshold: 300
        });
    } else if (psychoPass.crime_coefficient >= 100) {
        maxAction = Math.max(maxAction, dominator.crime_coefficient_100_action);
        reasons.push({
            attribute: "crime_coefficient_100",
            score: psychoPass.crime_coefficient,
            threshold: 100
        });
    }

    const reason = reasons.map(reason => `${reason.attribute}: ${reason.score} >= ${reason.threshold}`).toString()

    if (maxAction < 0) return;
    if (maxAction >= ACTIONS.indexOf("NOTIFY")) context.reddit.modMail.createConversation({
        subredditName: subreddit.name,
        subject: `Flagged u/${author.name} (${author.id})`,
        body: reason
    })
    console.log(`Action: ${ACTIONS[maxAction]} has been taken on @${author.name} (${author.id}) in Server: ${subreddit.name} (${subreddit.id}) because of ${reason}`);
    if (maxAction === ACTIONS.indexOf("BAN")) context.reddit.banUser({
        username: author.name,
        subredditName: subreddit.name,
        reason
    });
    else if (maxAction === ACTIONS.indexOf("MUTE")) context.reddit.muteUser({
        username: author.name,
        subredditName: subreddit.name,
        note: reason
    });
}