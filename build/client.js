"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalGuilds = void 0;
const detritus_client_1 = require("detritus-client");
const config_1 = __importDefault(require("./config"));
const client = new detritus_client_1.InteractionCommandClient(config_1.default.token, {
    checkCommands: false,
    gateway: {
        presence: {
            afk: true,
            status: "idle"
        }
    }
});
exports.default = client;
function getTotalGuilds() {
    return client.client.shards.reduce((acc, shard) => acc + shard.guilds.size, 0);
}
exports.getTotalGuilds = getTotalGuilds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxREFBMEU7QUFDMUUsc0RBQThCO0FBRzlCLE1BQU0sTUFBTSxHQUFHLElBQUksMENBQXdCLENBQUMsZ0JBQU0sQ0FBQyxLQUFLLEVBQUU7SUFDdEQsYUFBYSxFQUFFLEtBQUs7SUFDcEIsT0FBTyxFQUFFO1FBQ0wsUUFBUSxFQUFFO1lBQ04sR0FBRyxFQUFFLElBQUk7WUFDVCxNQUFNLEVBQUUsTUFBTTtTQUNqQjtLQUNKO0NBQ0osQ0FBQyxDQUFDO0FBRUgsa0JBQWUsTUFBTSxDQUFDO0FBSXRCLFNBQWdCLGNBQWM7SUFDMUIsT0FBUSxNQUFNLENBQUMsTUFBd0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLENBQUM7QUFGRCx3Q0FFQyJ9