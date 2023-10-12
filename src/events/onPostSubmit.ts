import { PostSubmitDefinition, TriggerContext } from "@devvit/public-api";
import { PostSubmit } from "@devvit/protos";
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

        moderateMessage(event, context, titleAnalysis!);
        moderateMessage(event, context, bodyAnalysis!);
        moderateMember(event, context);
    }
};

export async function moderateMessage(event: PostSubmit, context: TriggerContext, analysis: MessageAnalysis) {
    if (event.author?.id === context.appAccountId || event.subreddit?.nsfw || event.post?.nsfw) return;

    const dominator = await MessageDominators.read(event.subreddit!.id);
    if (!analysis || !dominator) return;
    analysis.userID = event.author!.id;
    analysis.communityID = event.subreddit!.id;
    ingestMessage(analysis);

    const approvedUsers = await context.reddit.getApprovedUsers({
        subredditName: event.subreddit!.name,
        username: event.author!.name
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
    if (maxAction >= ACTIONS.indexOf("REMOVE")) context.reddit.remove(event.post!.id, false);
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