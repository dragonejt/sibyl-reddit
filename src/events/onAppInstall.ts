import { AppInstall } from "@devvit/protos";
import { Devvit } from "@devvit/public-api";

import communities from "../clients/backend/communities.js";

const onAppInstall: Devvit.AppInstallConfig = {
    event: Devvit.Trigger.AppInstall,
    async handler(request: AppInstall) {
        console.log(`Community: ${request.subreddit?.id!} has installed SibylMod`);
        communities.create(request.subreddit?.id!);
    }
}

export default onAppInstall;