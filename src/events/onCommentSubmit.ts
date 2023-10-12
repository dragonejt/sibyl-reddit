import { CommentSubmit, PostSubmit } from "@devvit/protos";
import { CommentSubmitDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { MessageDominators } from "../clients/backend/dominator/messageDominators.js";
import { moderateMessage } from "./onPostSubmit.js";
import { PsychoPass, PsychoPasses } from "../clients/backend/psychopass/psychoPasses.js";
import { MemberDominator, MemberDominators } from "../clients/backend/dominator/memberDominators.js";
import { ACTIONS, ATTRIBUTES, Reason } from "../clients/constants.js";
import Communities from "../clients/backend/communities.js";


export const onCommentSubmit: CommentSubmitDefinition = {
    event: "CommentSubmit",
    onEvent: async (event: CommentSubmit, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment on r/${event.subreddit?.name}/${event.post?.id}`);
        const analysis= await analyzeComment(event.comment?.body!);

        moderateMessage(event, context, analysis!);
        moderateMember(event, context);
    }
}

export async function moderateMember(event: PostSubmit, context: TriggerContext) {
    if (event.author?.id === context.appAccountId || event.subreddit?.nsfw) return;

    const approvedUsers = await context.reddit.getApprovedUsers({
        subredditName: event.subreddit!.name,
        username: event.author!.name
    }).all()
    if (approvedUsers.length > 0) return;

    const [psychoPass, dominator] = await Promise.all([PsychoPasses.read(event.author!.id), MemberDominators.read(event.subreddit!.id)]);
    if (psychoPass === undefined || dominator === undefined) throw new Error("Psycho-Pass or Dominator undefined!");
    if (psychoPass.messages < 25) return;

    let maxAction = ACTIONS.indexOf("NOTIFY");
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
    
    if (maxAction >= ACTIONS.indexOf("NOTIFY")) context.reddit.modMail.createConversation({
        subredditName: event.subreddit!.name,
        subject: `Flagged u/${event.author!.name} (${event.author!.id})`,
        body: reason
    })
    console.log(`Action: ${ACTIONS[maxAction]} has been taken on @${event.author?.name} (${event.author?.id}) in Server: ${event.subreddit?.name} (${event.subreddit?.id}) because of ${reason}`);
    if (maxAction === ACTIONS.indexOf("BAN")) context.reddit.banUser({
        username: event.author!.name,
        subredditName: event.subreddit!.name,
        reason
    });
    else if (maxAction === ACTIONS.indexOf("MUTE")) context.reddit.muteUser({
        username: event.author!.name,
        subredditName: event.subreddit!.name,
        note: reason
    });
}