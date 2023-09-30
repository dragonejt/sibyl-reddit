import { Devvit } from '@devvit/public-api';
// Visit developers.reddit.com/docs to view documentation for the Devvit api
import onPostSubmit from './events/onPostSubmit.js';
import onAppInstall from './events/onAppInstall.js';

Devvit.configure({
    http: true,
    redditAPI: true
});

Devvit.addTrigger(onPostSubmit);
Devvit.addTrigger(onAppInstall);

export default Devvit;
