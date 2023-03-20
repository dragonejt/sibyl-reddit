import { Devvit, RedditAPIClient, KeyValueStorage } from '@devvit/public-api';
import { PostSubmit, Metadata } from '@devvit/protos';
// Visit developers.reddit.com/docs to view documentation for the Devvit api
import onPostSubmit from './events/onPostSubmit.js';

Devvit.use(Devvit.Types.HTTP);

onPostSubmit(Devvit);

export default Devvit;
