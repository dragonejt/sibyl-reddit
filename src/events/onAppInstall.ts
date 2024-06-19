import { AppInstallDefinition } from "@devvit/public-api";
import communities from "../clients/backend/communities.js";
import { AppInstall } from "@devvit/protos";

const onAppInstall: AppInstallDefinition = {
    event: "AppInstall",
    onEvent: async (request: AppInstall) => {
        console.log(
            `r/${request.subreddit?.name} (${request.subreddit?.id}) has installed SibylMod`
        );
        communities.create(request.subreddit?.id!);
    },
};

export default onAppInstall;
