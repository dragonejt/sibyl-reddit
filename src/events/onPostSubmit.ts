import { PostSubmit } from "@devvit/protos";

import { analyzeComment } from '../clients/perspectiveAPI.js';
import ingestMessage from '../clients/backend/ingestMessage.js';

export default function onPostSubmit(Devvit: any) {
    Devvit.addTrigger({
        event: Devvit.Trigger.PostSubmit,
        async handler(request: PostSubmit) {
            console.log(`${request.author?.name} (${request.author?.id}) has created a new post in ${request.subreddit?.name} ${request.subreddit?.id}`);
            const titleAnalysis = await analyzeComment(request.post?.title!);
            const bodyAnalysis = await analyzeComment(request.post?.selftext!);
            console.log(bodyAnalysis);
            if (!titleAnalysis || !bodyAnalysis) throw new Error("titleAnalysis or bodyAnalysis is undefined!");
            titleAnalysis.userID = request.author!.id;
            titleAnalysis.communityID = request.subreddit!.id;
            await ingestMessage(titleAnalysis);
            bodyAnalysis.userID = request.author!.id;
            bodyAnalysis.communityID = request.subreddit!.id;
            await ingestMessage(bodyAnalysis);

        }
    })
}