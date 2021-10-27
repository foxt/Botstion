import { InteractionCommandClient } from 'detritus-client';
import config from './config';

const interactionClient = new InteractionCommandClient(config.token);

interactionClient.addMultipleIn('./commands');

(async () => {
  const client = await interactionClient.run();
  console.log( `\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tBotstion ${require("../package.json").version}
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tis starting...
\x1b[47m            \x1b[0m\tShards: ${client.shardCount}
\x1b[47m            \x1b[0m `)
        
})();