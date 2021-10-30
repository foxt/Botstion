import { ClusterClient, GatewayClientEvents } from "detritus-client";
import client, { getTotalGuilds } from "./client";

client.addMultipleIn("./commands");

client.client.subscribe("shard", (evt: GatewayClientEvents.ClusterEvent) => {
    evt.shard.on("gatewayReady", () => {
        evt.shard.gateway.setPresence({
            afk: true,
            status: "AFK",
            activity: {
                name: evt.shard.toString(),
                type: 0
            }
        });
    });
});

client.client.on("interactionCreate", console.log);
client.on("commandFail", console.error);

(async() => {
    const cclient = await client.run() as ClusterClient;
    console.log(`\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tBotstion ${require("../package.json").version}
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tis starting...
\x1b[47m            \x1b[0m\tShards: ${cclient.shardCount} Guilds: ${getTotalGuilds()}
\x1b[47m            \x1b[0m `);
    setInterval(() => {
        for (const shard of cclient.shards.values()) {
            shard.gateway.setPresence({
                afk: false,
                activity: {
                    name: ` in ${getTotalGuilds()} servers (v5)`,
                    type: 0
                }
            });
        }
    }, 20000);
})();