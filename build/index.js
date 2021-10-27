"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const detritus_client_1 = require("detritus-client");
const config_1 = __importDefault(require("./config"));
const interactionClient = new detritus_client_1.InteractionCommandClient(config_1.default.token);
interactionClient.addMultipleIn('./commands');
(async () => {
    const client = await interactionClient.run();
    console.log(`\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tBotstion ${require("../package.json").version}
\x1b[47m    \x1b[41m    \x1b[47m    \x1b[0m\tis starting...
\x1b[47m            \x1b[0m\tShards: ${client.shardCount}
\x1b[47m            \x1b[0m `);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxREFBMkQ7QUFDM0Qsc0RBQThCO0FBRTlCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSwwQ0FBd0IsQ0FBQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXJFLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU5QyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1YsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFFO3dEQUN5QyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPOzt1Q0FFbkQsTUFBTSxDQUFDLFVBQVU7NkJBQzNCLENBQUMsQ0FBQTtBQUU5QixDQUFDLENBQUMsRUFBRSxDQUFDIn0=