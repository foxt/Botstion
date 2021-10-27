"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basecommand_1 = require("../../basecommand");
const avatar_1 = require("./avatar");
class UserGroupCommand extends basecommand_1.BaseSlashCommand {
    description = '.';
    name = 'user';
    constructor() {
        super({
            options: [
                new avatar_1.AvatarCommand(),
            ],
        });
    }
}
exports.default = UserGroupCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2xhc2gvdXNlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUFxRDtBQUVyRCxxQ0FBeUM7QUFHekMsTUFBcUIsZ0JBQWlCLFNBQVEsOEJBQWdCO0lBQzVELFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDbEIsSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUVkO1FBQ0UsS0FBSyxDQUFDO1lBQ0osT0FBTyxFQUFFO2dCQUNQLElBQUksc0JBQWEsRUFBRTthQUNwQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQVhELG1DQVdDIn0=