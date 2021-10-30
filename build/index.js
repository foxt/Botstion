"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importStar(require("./client"));
client_1.default.addMultipleIn("./commands");
client_1.default.client.subscribe("shard", (evt) => {
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
client_1.default.client.on("interactionCreate", console.log);
client_1.default.on("commandFail", console.error);
(async () => {
    const cclient = await client_1.default.run();
    console.log(`\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tBotstion ${require("../package.json").version}
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tis starting...
\x1b[47m            \x1b[0m\tShards: ${cclient.shardCount} Guilds: ${(0, client_1.getTotalGuilds)()}
\x1b[47m            \x1b[0m `);
    setInterval(() => {
        for (const shard of cclient.shards.values()) {
            shard.gateway.setPresence({
                afk: false,
                activity: {
                    name: ` in ${(0, client_1.getTotalGuilds)()} servers (v5)`,
                    type: 0
                }
            });
        }
    }, 20000);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQWtEO0FBRWxELGdCQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRW5DLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFxQyxFQUFFLEVBQUU7SUFDdkUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM5QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDMUIsR0FBRyxFQUFFLElBQUk7WUFDVCxNQUFNLEVBQUUsS0FBSztZQUNiLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQzFCLElBQUksRUFBRSxDQUFDO2FBQ1Y7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDO0FBRUgsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRCxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLENBQUMsS0FBSyxJQUFHLEVBQUU7SUFDUCxNQUFNLE9BQU8sR0FBRyxNQUFNLGdCQUFNLENBQUMsR0FBRyxFQUFtQixDQUFDO0lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUM7d0RBQ3dDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU87O3VDQUVuRCxPQUFPLENBQUMsVUFBVSxZQUFZLElBQUEsdUJBQWMsR0FBRTs2QkFDeEQsQ0FBQyxDQUFDO0lBQzNCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7UUFDYixLQUFLLE1BQU0sS0FBSyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDekMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ3RCLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFFBQVEsRUFBRTtvQkFDTixJQUFJLEVBQUUsT0FBTyxJQUFBLHVCQUFjLEdBQUUsZUFBZTtvQkFDNUMsSUFBSSxFQUFFLENBQUM7aUJBQ1Y7YUFDSixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMifQ==