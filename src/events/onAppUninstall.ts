import { ModAction } from "@devvit/protos";
import { ModActionDefinition } from "@devvit/public-api";

import communities from "../clients/backend/communities.js";


const onAppUninstall: ModActionDefinition = {
    event: "ModAction",
    onEvent: async (request: ModAction) => {
        if (request.action === "DEV_PLATFORM_APP_UNINSTALLED") {
            console.log(`r/${request.subreddit?.name} (${request.subreddit?.id!}) has removed SibylMod`);
            communities.delete(request.subreddit?.id!);
        }
    }
}

export default onAppUninstall;
