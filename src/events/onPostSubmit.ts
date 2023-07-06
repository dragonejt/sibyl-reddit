import { Devvit } from "@devvit/public-api";
import { PostSubmit } from "@devvit/protos";

import { analyzeComment } from '../clients/perspectiveAPI.js';
import ingestMessage from '../clients/backend/ingestMessage.js';

const onPostSubmit: Devvit.PostSubmitConfig = {
    event: Devvit.Trigger.PostSubmit,
    async handler(event: PostSubmit) {
        console.log(`${event.author?.name} (${event.author?.id}) has created a new post in ${event.subreddit?.name} ${event.subreddit?.id}`);
        const [titleAnalysis, bodyAnalysis] = await Promise.all([analyzeComment(event.post?.title!), analyzeComment(event.post?.selftext!)]);
        console.log(bodyAnalysis);
        if (!titleAnalysis || !bodyAnalysis) throw new Error("titleAnalysis or bodyAnalysis is undefined!");
        titleAnalysis.userID = event.author!.id;
        titleAnalysis.communityID = event.subreddit!.id;
        ingestMessage(titleAnalysis);
        bodyAnalysis.userID = event.author!.id;
        bodyAnalysis.communityID = event.subreddit!.id;
        ingestMessage(bodyAnalysis);

    }
}

export default onPostSubmit;