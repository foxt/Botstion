"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarCommand = void 0;
const detritus_client_1 = require("detritus-client");
const { ApplicationCommandOptionTypes } = detritus_client_1.Constants;
const { Embed } = detritus_client_1.Utils;
const basecommand_1 = require("../../basecommand");
class AvatarCommand extends basecommand_1.BaseCommandOption {
    description = 'Grab the avatar of a user';
    name = 'avatar';
    constructor() {
        super({
            options: [
                {
                    name: 'user',
                    description: 'User to grab the avatar of',
                    default: (context) => context.member || context.user,
                    type: ApplicationCommandOptionTypes.USER,
                },
            ],
        });
    }
    async run(context, args) {
        const embed = new Embed();
        embed.setTitle(`Avatar for ${args.user}`);
        embed.setImage(args.user.avatarUrl);
        return context.editOrRespond({ embed });
    }
}
exports.AvatarCommand = AvatarCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL3NsYXNoL3VzZXIvYXZhdGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUE0RTtBQUM1RSxNQUFNLEVBQUUsNkJBQTZCLEVBQUUsR0FBRywyQkFBUyxDQUFDO0FBQ3BELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyx1QkFBSyxDQUFDO0FBRXhCLG1EQUFzRDtBQU90RCxNQUFhLGFBQWMsU0FBUSwrQkFBaUI7SUFDbEQsV0FBVyxHQUFHLDJCQUEyQixDQUFDO0lBQzFDLElBQUksR0FBRyxRQUFRLENBQUM7SUFFaEI7UUFDRSxLQUFLLENBQUM7WUFDSixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsSUFBSSxFQUFFLE1BQU07b0JBQ1osV0FBVyxFQUFFLDRCQUE0QjtvQkFDekMsT0FBTyxFQUFFLENBQUMsT0FBdUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsSUFBSTtvQkFDcEYsSUFBSSxFQUFFLDZCQUE2QixDQUFDLElBQUk7aUJBQ3pDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUF1QyxFQUFFLElBQWlCO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxPQUFPLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQXZCRCxzQ0F1QkMifQ==