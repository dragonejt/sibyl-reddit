import { Devvit } from '@devvit/public-api';
// Visit developers.reddit.com/docs to view documentation for the Devvit api
import onAppInstall from './events/onAppInstall.js';
import onAppUninstall from './events/onAppUninstall.js';
import onMemberLeave from './events/onMemberLeave.js';
import { onCommentSubmit } from './events/onCommentSubmit.js';
import onCommentUpdate from './events/onCommentUpdate.js';
import { onPostSubmit } from './events/onPostSubmit.js';
import onPostUpdate from './events/onPostUpdate.js';

Devvit.configure({
    http: true,
    redditAPI: true
});

Devvit.addTrigger(onAppInstall);
Devvit.addTrigger(onAppUninstall);
Devvit.addTrigger(onMemberLeave);
Devvit.addTrigger(onPostSubmit);
Devvit.addTrigger(onPostUpdate);
Devvit.addTrigger(onCommentSubmit);
Devvit.addTrigger(onCommentUpdate);

export default Devvit;