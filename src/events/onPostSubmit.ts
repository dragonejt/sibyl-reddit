import { PostSubmitDefinition, TriggerContext } from "@devvit/public-api";
import { PostSubmit } from "@devvit/protos";

import { MessageAnalysis, analyzeComment } from '../clients/perspectiveAPI.js';
import ingestMessage from '../clients/backend/ingestMessage.js';
import { ACTIONS, Reason } from "../clients/constants.js";
import { MessageDominators, MessageDominator } from "../clients/backend/dominator/messageDominators.js";


export const onPostSubmit: PostSubmitDefinition = {
    event: "PostSubmit",
    onEvent: async (event: PostSubmit, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const [titleAnalysis, bodyAnalysis, dominator] = await Promise.all([analyzeComment(event.post?.title!), analyzeComment(event.post?.selftext!), MessageDominators.read(event.subreddit!.id)]);

        moderateMessage(event, context, titleAnalysis!, dominator!);
        moderateMessage(event, context, bodyAnalysis!, dominator!);
    }
};

export async function moderateMessage(event: PostSubmit, context: TriggerContext, analysis: MessageAnalysis, dominator: MessageDominator) {
    if (!analysis || !dominator) return;
    analysis.userID = event.author!.id;
    analysis.communityID = event.subreddit!.id;
    ingestMessage(analysis);

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

    if (maxAction === ACTIONS.indexOf("NOTIFY")) return;
    if (maxAction >= ACTIONS.indexOf("REMOVE")) context.reddit.remove(event.post!.id, false);
    console.log(`Action: ${ACTIONS[maxAction]} has been taken on @${event.author?.name} (${event.author?.id}) in Server: ${event.subreddit?.name} (${event.subreddit?.id})`);
    if (maxAction === ACTIONS.indexOf("BAN")) context.reddit.banUser({
        username: event.author!.name,
        subredditName: event.subreddit!.name
    });
    else if (maxAction === ACTIONS.indexOf("MUTE")) context.reddit.muteUser({
        username: event.author!.name,
        subredditName: event.subreddit!.name
    });
}