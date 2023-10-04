import { CommentUpdate } from "@devvit/protos";
import { CommentUpdateDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { MessageDominators } from "../clients/backend/dominator/messageDominators.js";
import { moderateMessage } from "./onPostSubmit.js";


const onCommentUpdate: CommentUpdateDefinition = {
    event: "CommentUpdate",
    onEvent: async (event: CommentUpdate, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has updated a comment in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const [analysis, dominator] = await Promise.all([analyzeComment(event.comment?.body!), MessageDominators.read(event.subreddit!.id)]);

        moderateMessage(event, context, analysis!, dominator!);
    }
}

export default onCommentUpdate;