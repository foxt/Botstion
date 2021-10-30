import { ClusterClient, InteractionCommandClient } from "detritus-client";
import config from "./config";


const client = new InteractionCommandClient(config.token, {
    checkCommands: false,
    gateway: {
        presence: {
            afk: true,
            status: "idle"
        }
    }
});

export default client;



export function getTotalGuilds() {
    return (client.client as ClusterClient).shards.reduce((acc, shard) => acc + shard.guilds.size, 0);
}