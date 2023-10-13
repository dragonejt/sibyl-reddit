import { PostSubmitDefinition, TriggerContext } from "@devvit/public-api";
import { PostSubmit, PostV2, SubredditV2, UserV2 } from "@devvit/protos";
import { MessageAnalysis, analyzeComment } from '../clients/perspectiveAPI.js';
import ingestMessage from '../clients/backend/ingestMessage.js';
import { ACTIONS, Reason } from "../clients/constants.js";
import { MessageDominators, MessageDominator } from "../clients/backend/dominator/messageDominators.js";
import { moderateMember } from "./onCommentSubmit.js";


export const onPostSubmit: PostSubmitDefinition = {
    event: "PostSubmit",
    onEvent: async (event: PostSubmit, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const [titleAnalysis, bodyAnalysis] = await Promise.all([analyzeComment(event.post?.title!), analyzeComment(event.post?.selftext!)]);

        moderateMessage(event.author!, event.subreddit!, event.post!, context, titleAnalysis!);
        moderateMessage(event.author!, event.subreddit!, event.post!, context, bodyAnalysis!);
        moderateMember(event.author!, event.subreddit!, context);
    }
};

export async function moderateMessage(author: UserV2, subreddit: SubredditV2, post: PostV2, context: TriggerContext, analysis: MessageAnalysis) {
    if (author.id === context.appAccountId || subreddit.nsfw || post.nsfw) return;

    const dominator = await MessageDominators.read(subreddit.id);
    if (!analysis || !dominator) return;
    analysis.userID = author.id;
    analysis.communityID = subreddit.id;
    ingestMessage(analysis);

    const approvedUsers = await context.reddit.getApprovedUsers({
        subredditName: subreddit.name,
        username: author.name
    }).all()
    if (approvedUsers.length > 0) return;

    let maxAction = ACTIONS.indexOf("NOTIFY");
    const reasons: Reason[] = [];
    for (const attribute in analysis.attributeScores) {
        const score = analysis.attributeScores[attribute as keyof MessageAnalysis["attributeScores"]].summaryScore.value;
        const threshold = dominator[`${attribute.toLowerCase()}_threshold` as keyof MessageDominator] as number;
        if (score >= threshold) {
            const action = dominator[`${attribute.toLowerCase()}_action` as keyof MessageDominator] as number;
            maxAction = Math.max(maxAction, action);
            reasons.push({ attribute: attribute.toLowerCase(), score, threshold });
        }
    }

    const reason = reasons.map(reason => `${reason.attribute}: ${reason.score} >= ${reason.threshold}`).toString()

    if (maxAction === ACTIONS.indexOf("NOTIFY")) return;
    if (maxAction >= ACTIONS.indexOf("REMOVE")) context.reddit.remove(post.id, false);
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