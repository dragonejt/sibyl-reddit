import { PostUpdate } from "@devvit/protos";
import { PostUpdateDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { moderateMessage } from "./onPostSubmit.js";
import { MessageDominators } from "../clients/backend/dominator/messageDominators.js";
import { moderateMember } from "./onCommentSubmit.js";


const onPostUpdate: PostUpdateDefinition = {
    event: "PostUpdate",
    onEvent: async (event: PostUpdate, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const bodyAnalysis = await analyzeComment(event.post?.selftext!)

        moderateMessage(event, context, bodyAnalysis!);
        moderateMember(event, context);
    }
}

export default onPostUpdate;