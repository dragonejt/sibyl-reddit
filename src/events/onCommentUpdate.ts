import { CommentUpdate } from "@devvit/protos";
import { CommentUpdateDefinition, TriggerContext } from "@devvit/public-api";
import { analyzeComment } from "../clients/perspectiveAPI.js";
import { moderateMessage } from "./onPostCreate.js";
import { moderateMember } from "./onCommentCreate.js";

const onCommentUpdate: CommentUpdateDefinition = {
    event: "CommentUpdate",
    onEvent: async (event: CommentUpdate, context: TriggerContext) => {
        console.log(
            `u/${event.author?.name} (${event.author?.id}) has updated a comment in r/${event.subreddit?.name} (${event.subreddit?.id})`
        );
        const analysis = await analyzeComment(event.comment?.body!);

        moderateMessage(
            event.author!,
            event.subreddit!,
            event.post!,
            context,
            analysis!
        );
        moderateMember(event.author!, event.subreddit!, context);
    },
};

export default onCommentUpdate;
