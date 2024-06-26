import { PostUpdate } from "@devvit/protos";
import { PostUpdateDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { moderateMessage } from "./onPostCreate.js";
import { moderateMember } from "./onCommentCreate.js";

const onPostUpdate: PostUpdateDefinition = {
    event: "PostUpdate",
    onEvent: async (event: PostUpdate, context: TriggerContext) => {
        console.log(
            `u/${event.author?.name} (${event.author?.id}) has created a new comment in r/${event.subreddit?.name} (${event.subreddit?.id})`
        );

        if (event.post?.selftext) {
            const bodyAnalysis = await analyzeComment(event.post?.selftext);
            moderateMessage(
                event.author!,
                event.subreddit!,
                event.post!,
                context,
                bodyAnalysis!
            );
        }

        moderateMember(event.author!, event.subreddit!, context);
    },
};

export default onPostUpdate;
