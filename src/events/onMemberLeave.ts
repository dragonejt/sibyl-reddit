import { ModAction } from "@devvit/protos";
import { ModActionDefinition } from "@devvit/public-api";
import { CommunityPsychoPasses } from "../clients/backend/psychopass/communityPsychoPasses.js";

const onMemberLeave: ModActionDefinition = {
    event: "ModAction",
    onEvent: async (event: ModAction) => {
        if (event.action === "BAN_USER" || event.action === "MUTE_USER") {
            console.log(
                `u/${event.targetUser?.name} (${event.targetUser?.id}) has left the subreddit`
            );
            CommunityPsychoPasses.update(
                event.subreddit!.id,
                event.targetUser!.id
            );
        }
    },
};

export default onMemberLeave;
