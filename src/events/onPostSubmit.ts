import { Devvit } from "@devvit/public-api";
import { PostSubmit } from "@devvit/protos";

import { analyzeComment } from '../clients/perspectiveAPI.js';
import ingestMessage from '../clients/backend/ingestMessage.js';

const onPostSubmit: Devvit.PostSubmitConfig = {
    event: Devvit.Trigger.PostSubmit,
    async handler(event: PostSubmit) {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new post in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const [titleAnalysis, bodyAnalysis] = await Promise.all([analyzeComment(event.post?.title!), analyzeComment(event.post?.selftext!)]);
        if (titleAnalysis) {
            titleAnalysis.userID = event.author!.id;
            titleAnalysis.communityID = event.subreddit!.id;
            ingestMessage(titleAnalysis);
        }
        if (bodyAnalysis) {
            bodyAnalysis.userID = event.author!.id;
            bodyAnalysis.communityID = event.subreddit!.id;
            ingestMessage(bodyAnalysis);
        }

    }
}

export default onPostSubmit;