"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_NAME = void 0;
const basecommand_1 = require("../../basecommand");
exports.COMMAND_NAME = 'ID';
class InformationCommand extends basecommand_1.BaseContextMenuMessageCommand {
    name = exports.COMMAND_NAME;
    async run(context, args) {
        const { message } = args;
        return context.editOrRespond(`Message ID is ${message.id}, created at ${message.createdAt}`);
    }
}
exports.default = InformationCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY29udGV4dC1tZW51L21lc3NhZ2UvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbURBQTBGO0FBRzdFLFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQztBQUVqQyxNQUFxQixrQkFBbUIsU0FBUSwyQ0FBNkI7SUFDM0UsSUFBSSxHQUFHLG9CQUFZLENBQUM7SUFFcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUF1QyxFQUFFLElBQTRCO1FBQzdFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDekIsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDLGlCQUFpQixPQUFPLENBQUMsRUFBRSxnQkFBZ0IsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDL0YsQ0FBQztDQUNGO0FBUEQscUNBT0MifQ==