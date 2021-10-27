"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_NAME = void 0;
const basecommand_1 = require("../../basecommand");
exports.COMMAND_NAME = 'Information';
class InformationCommand extends basecommand_1.BaseContextMenuUserCommand {
    name = exports.COMMAND_NAME;
    async run(context, args) {
        return context.editOrRespond(`information about ${args.member || args.user} here`);
    }
}
exports.default = InformationCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY29udGV4dC1tZW51L3VzZXIvaW5mb3JtYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbURBQW9GO0FBR3ZFLFFBQUEsWUFBWSxHQUFHLGFBQWEsQ0FBQztBQUUxQyxNQUFxQixrQkFBbUIsU0FBUSx3Q0FBMEI7SUFDeEUsSUFBSSxHQUFHLG9CQUFZLENBQUM7SUFFcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUF1QyxFQUFFLElBQXlCO1FBQzFFLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztJQUNyRixDQUFDO0NBQ0Y7QUFORCxxQ0FNQyJ9