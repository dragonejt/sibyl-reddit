import { CommentUpdate } from "@devvit/protos";
import { CommentUpdateDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { MessageDominators } from "../clients/backend/dominator/messageDominators.js";
import { moderateMessage } from "./onPostSubmit.js";
import { moderateMember } from "./onCommentSubmit.js";


const onCommentUpdate: CommentUpdateDefinition = {
    event: "CommentUpdate",
    onEvent: async (event: CommentUpdate, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has updated a comment in r/${event.subreddit?.name} (${event.subreddit?.id})`);
        const analysis = await analyzeComment(event.comment?.body!);

        moderateMessage(event, context, analysis!);
        moderateMember(event, context);
    }
}

export default onCommentUpdate;