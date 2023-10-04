import { CommentSubmit } from "@devvit/protos";
import { CommentSubmitDefinition, TriggerContext } from "@devvit/public-api";

import { analyzeComment } from "../clients/perspectiveAPI.js";
import { MessageDominators } from "../clients/backend/dominator/messageDominators.js";
import { moderateMessage } from "./onPostSubmit.js";


const onCommentSubmit: CommentSubmitDefinition = {
    event: "CommentSubmit",
    onEvent: async (event: CommentSubmit, context: TriggerContext) => {
        console.log(`u/${event.author?.name} (${event.author?.id}) has created a new comment on r/${event.subreddit?.name}/${event.post?.id}`);
        const [analysis, dominator] = await Promise.all([analyzeComment(event.comment?.body!), MessageDominators.read(event.subreddit!.id)]);

        moderateMessage(event, context, analysis!, dominator!);
    }
}

export default onCommentSubmit;