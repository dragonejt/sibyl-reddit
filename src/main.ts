import { Devvit } from '@devvit/public-api';
import { init, browserTracingIntegration, replayIntegration } from '@sentry/browser';
// Visit developers.reddit.com/docs to view documentation for the Devvit api
import settings from './settings.js';
import onAppInstall from './events/onAppInstall.js';
import onAppUninstall from './events/onAppUninstall.js';
import onMemberLeave from './events/onMemberLeave.js';
import { onCommentCreate } from './events/onCommentCreate.js';
import onCommentUpdate from './events/onCommentUpdate.js';
import { onPostCreate } from './events/onPostCreate.js';
import onPostUpdate from './events/onPostUpdate.js';


init({
    dsn: "https://fdbfcb638c11c19305f23d06947d1559@o4507124907638784.ingest.us.sentry.io/4507127419961344",
    environment: "production",
    integrations: [
        browserTracingIntegration(),
        replayIntegration(),
    ]
});

Devvit.configure({
    http: true,
    redditAPI: true
});
Devvit.addSettings(settings);

Devvit.addTrigger(onAppInstall);
Devvit.addTrigger(onAppUninstall);
Devvit.addTrigger(onMemberLeave);
Devvit.addTrigger(onPostCreate);
Devvit.addTrigger(onPostUpdate);
Devvit.addTrigger(onCommentCreate);
Devvit.addTrigger(onCommentUpdate);

export default Devvit;