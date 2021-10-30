"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_NAME = void 0;
const basecommand_1 = require("../basecommand");
exports.COMMAND_NAME = "ping";
class PingCommand extends basecommand_1.BaseSlashCommand {
    description = "Ping";
    name = exports.COMMAND_NAME;
    async run(context) {
        const { gateway, rest } = await context.client.ping();
        return context.editOrRespond("pong");
    }
}
exports.default = PingCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9zbGFzaC9waW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGdEQUFrRDtBQUdyQyxRQUFBLFlBQVksR0FBRyxNQUFNLENBQUM7QUFFbkMsTUFBcUIsV0FBWSxTQUFRLDhCQUFnQjtJQUNyRCxXQUFXLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLElBQUksR0FBRyxvQkFBWSxDQUFDO0lBRXBCLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBdUM7UUFDN0MsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEQsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDSjtBQVJELDhCQVFDIn0=