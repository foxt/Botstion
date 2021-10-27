"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContextMenuUserCommand = exports.BaseContextMenuMessageCommand = exports.BaseSlashCommand = exports.BaseCommandOptionGroup = exports.BaseCommandOption = exports.BaseInteractionCommand = void 0;
const detritus_client_1 = require("detritus-client");
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = detritus_client_1.Constants;
const { Embed, Markup } = detritus_client_1.Utils;
class BaseInteractionCommand extends detritus_client_1.Interaction.InteractionCommand {
    error = 'Command';
    onDmBlocked(context) {
        const command = Markup.codestring(context.name);
        return context.editOrRespond({
            content: `⚠ ${this.error} ${command} cannot be used in a DM.`,
            flags: MessageFlags.EPHEMERAL,
        });
    }
    onRunError(context, _, error) {
        const embed = new Embed();
        embed.setTitle(`⚠ ${this.error} Error`);
        embed.setDescription(Markup.codestring(String(error)));
        return context.editOrRespond({
            embed,
            flags: MessageFlags.EPHEMERAL,
        });
    }
    onValueError(context, _, errors) {
        const embed = new Embed();
        embed.setTitle(`⚠ ${this.error} Argument Error`);
        const store = {};
        const description = ['Invalid Arguments' + '\n'];
        for (let key in errors) {
            const message = errors[key].message;
            if (message in store) {
                description.push(`**${key}**: Same error as **${store[message]}**`);
            }
            else {
                description.push(`**${key}**: ${message}`);
            }
            store[message] = key;
        }
        embed.setDescription(description.join('\n'));
        return context.editOrRespond({
            embed,
            flags: MessageFlags.EPHEMERAL,
        });
    }
}
exports.BaseInteractionCommand = BaseInteractionCommand;
class BaseCommandOption extends detritus_client_1.Interaction.InteractionCommandOption {
    type = ApplicationCommandOptionTypes.SUB_COMMAND;
}
exports.BaseCommandOption = BaseCommandOption;
class BaseCommandOptionGroup extends detritus_client_1.Interaction.InteractionCommandOption {
    type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}
exports.BaseCommandOptionGroup = BaseCommandOptionGroup;
class BaseSlashCommand extends BaseInteractionCommand {
    error = 'Slash Command';
    type = ApplicationCommandTypes.CHAT_INPUT;
}
exports.BaseSlashCommand = BaseSlashCommand;
class BaseContextMenuMessageCommand extends BaseInteractionCommand {
    error = 'Message Context Menu';
    type = ApplicationCommandTypes.MESSAGE;
}
exports.BaseContextMenuMessageCommand = BaseContextMenuMessageCommand;
class BaseContextMenuUserCommand extends BaseInteractionCommand {
    error = 'User Context Menu';
    type = ApplicationCommandTypes.USER;
}
exports.BaseContextMenuUserCommand = BaseContextMenuUserCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZWNvbW1hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYmFzZWNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQTRFO0FBQzVFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSw2QkFBNkIsRUFBRSxZQUFZLEVBQUUsR0FBRywyQkFBUyxDQUFDO0FBQzNGLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsdUJBQUssQ0FBQztBQUloQyxNQUFhLHNCQUFvRSxTQUFRLDZCQUFXLENBQUMsa0JBQXNDO0lBQ3pJLEtBQUssR0FBRyxTQUFTLENBQUM7SUFFbEIsV0FBVyxDQUFDLE9BQXVDO1FBQ2pELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hELE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUMzQixPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sMEJBQTBCO1lBQzdELEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUztTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQXVDLEVBQUUsQ0FBcUIsRUFBRSxLQUFVO1FBQ25GLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZELE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUMzQixLQUFLO1lBQ0wsS0FBSyxFQUFFLFlBQVksQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsT0FBdUMsRUFBRSxDQUF5QixFQUFFLE1BQWdDO1FBQy9HLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLGlCQUFpQixDQUFDLENBQUM7UUFFakQsTUFBTSxLQUFLLEdBQTRCLEVBQUUsQ0FBQztRQUUxQyxNQUFNLFdBQVcsR0FBa0IsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNoRSxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtZQUN0QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3BDLElBQUksT0FBTyxJQUFJLEtBQUssRUFBRTtnQkFDcEIsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsdUJBQXVCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckU7aUJBQU07Z0JBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzVDO1lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUN0QjtRQUVELEtBQUssQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUMzQixLQUFLO1lBQ0wsS0FBSyxFQUFFLFlBQVksQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdDRCx3REE2Q0M7QUFHRCxNQUFhLGlCQUErRCxTQUFRLDZCQUFXLENBQUMsd0JBQTRDO0lBQzFJLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxXQUFXLENBQUM7Q0FDbEQ7QUFGRCw4Q0FFQztBQUdELE1BQWEsc0JBQW9FLFNBQVEsNkJBQVcsQ0FBQyx3QkFBNEM7SUFDL0ksSUFBSSxHQUFHLDZCQUE2QixDQUFDLGlCQUFpQixDQUFDO0NBQ3hEO0FBRkQsd0RBRUM7QUFJRCxNQUFhLGdCQUE4RCxTQUFRLHNCQUEwQztJQUMzSCxLQUFLLEdBQUcsZUFBZSxDQUFDO0lBQ3hCLElBQUksR0FBRyx1QkFBdUIsQ0FBQyxVQUFVLENBQUM7Q0FDM0M7QUFIRCw0Q0FHQztBQU9ELE1BQWEsNkJBQThCLFNBQVEsc0JBQThDO0lBQy9GLEtBQUssR0FBRyxzQkFBc0IsQ0FBQztJQUMvQixJQUFJLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDO0NBQ3hDO0FBSEQsc0VBR0M7QUFRRCxNQUFhLDBCQUEyQixTQUFRLHNCQUEyQztJQUN6RixLQUFLLEdBQUcsbUJBQW1CLENBQUM7SUFDNUIsSUFBSSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQztDQUNyQztBQUhELGdFQUdDIn0=