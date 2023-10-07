import { PostUpdate } from "@devvit/protos";
import { PostUpdateDefinition, TriggerContext } from "@devvit/public-api";

import { analyzeComment } from "../clients/perspectiveAPI.js";
import { moderateMessage } from "./onPostSubmit.js";
import { MessageDominators } from "../clients/backend/dominator/messageDominators.js";


const onPostUpdate: PostUpdateDefinition = {
    event: "PostUpdate",
    onEvent: async (event: PostUpdate, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const [bodyAnalysis, dominator] = await Promise.all([analyzeComment(event.post?.selftext!), MessageDominators.read(event.subreddit!.id)]);

        moderateMessage(event, context, bodyAnalysis!, dominator!);
    }
}

export default onPostUpdate;