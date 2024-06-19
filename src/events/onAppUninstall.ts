import { ModAction } from "@devvit/protos";
import { ModActionDefinition } from "@devvit/public-api";
import communities from "../clients/backend/communities.js";

const onAppUninstall: ModActionDefinition = {
    event: "ModAction",
    onEvent: async (event: ModAction) => {
        if (event.action === "DEV_PLATFORM_APP_UNINSTALLED") {
            console.log(
                `r/${event.subreddit?.name} (${event.subreddit?.id}) has removed SibylMod`
            );
            communities.delete(event.subreddit!.id);
        }
    },
};

export default onAppUninstall;
