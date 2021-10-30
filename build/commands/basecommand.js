"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContextMenuUserCommand = exports.BaseContextMenuMessageCommand = exports.BaseSlashCommand = exports.BaseCommandOptionGroup = exports.BaseCommandOption = exports.BaseInteractionCommand = void 0;
const detritus_client_1 = require("detritus-client");
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = detritus_client_1.Constants;
const { Embed, Markup } = detritus_client_1.Utils;
class BaseInteractionCommand extends detritus_client_1.Interaction.InteractionCommand {
    error = "Command";
    onDmBlocked(context) {
        const command = Markup.codestring(context.name);
        return context.editOrRespond({
            content: `⚠ ${this.error} ${command} cannot be used in a DM.`,
            flags: MessageFlags.EPHEMERAL
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRunError(context, _, error) {
        console.error(error);
        const embed = new Embed();
        embed.setTitle(`⚠ Could not execute ${this.error}`);
        embed.setColor(0xff3860);
        embed.setDescription("oepsie woepsie!"); // Markup.codestring(String(error.raw)));
        embed.setImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpics.me.me%2Foepsie-woepsie-de-trein-is-stukkie-wukkie-we-sijn-heul-37586255.png&f=1&nofb=1");
        return context.editOrRespond({
            embed,
            flags: MessageFlags.EPHEMERAL
        });
    }
    onValueError(context, _, errors) {
        const embed = new Embed();
        embed.setTitle(`⚠ ${this.error} Argument Error`);
        const store = {};
        const description = ["Invalid Arguments\n\n"];
        for (const key in errors) {
            const message = errors[key].message;
            if (message in store) {
                description.push(`**${key}**: Same error as **${store[message]}**`);
            }
            else {
                description.push(`**${key}**: ${message}`);
            }
            store[message] = key;
        }
        embed.setDescription(description.join("\n"));
        return context.editOrRespond({
            embed,
            flags: MessageFlags.EPHEMERAL
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
    error = "Slash Command";
    type = ApplicationCommandTypes.CHAT_INPUT;
}
exports.BaseSlashCommand = BaseSlashCommand;
class BaseContextMenuMessageCommand extends BaseInteractionCommand {
    error = "Message Context Menu";
    type = ApplicationCommandTypes.MESSAGE;
}
exports.BaseContextMenuMessageCommand = BaseContextMenuMessageCommand;
class BaseContextMenuUserCommand extends BaseInteractionCommand {
    error = "User Context Menu";
    type = ApplicationCommandTypes.USER;
}
exports.BaseContextMenuUserCommand = BaseContextMenuUserCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZWNvbW1hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYmFzZWNvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQTRFO0FBQzVFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSw2QkFBNkIsRUFBRSxZQUFZLEVBQUUsR0FBRywyQkFBUyxDQUFDO0FBQzNGLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsdUJBQUssQ0FBQztBQUloQyxNQUFhLHNCQUFvRSxTQUFRLDZCQUFXLENBQUMsa0JBQXNDO0lBQ3ZJLEtBQUssR0FBRyxTQUFTLENBQUM7SUFFbEIsV0FBVyxDQUFDLE9BQXVDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hELE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUN6QixPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sMEJBQTBCO1lBQzdELEtBQUssRUFBRSxZQUFZLENBQUMsU0FBUztTQUNoQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsOERBQThEO0lBQzlELFVBQVUsQ0FBQyxPQUF1QyxFQUFFLENBQXFCLEVBQUUsS0FBVTtRQUNqRixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QixLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQSx5Q0FBeUM7UUFDakYsS0FBSyxDQUFDLFFBQVEsQ0FBQyx5SkFBeUosQ0FBQyxDQUFDO1FBRTFLLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUN6QixLQUFLO1lBQ0wsS0FBSyxFQUFFLFlBQVksQ0FBQyxTQUFTO1NBQ2hDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxZQUFZLENBQUMsT0FBdUMsRUFBRSxDQUF5QixFQUFFLE1BQWdDO1FBQzdHLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLGlCQUFpQixDQUFDLENBQUM7UUFFakQsTUFBTSxLQUFLLEdBQTRCLEVBQUUsQ0FBQztRQUUxQyxNQUFNLFdBQVcsR0FBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzdELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFO1lBQ3RCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDcEMsSUFBSSxPQUFPLElBQUksS0FBSyxFQUFFO2dCQUNsQixXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyx1QkFBdUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2RTtpQkFBTTtnQkFDSCxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDOUM7WUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ3hCO1FBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0MsT0FBTyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQ3pCLEtBQUs7WUFDTCxLQUFLLEVBQUUsWUFBWSxDQUFDLFNBQVM7U0FDaEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBakRELHdEQWlEQztBQUdELE1BQWEsaUJBQStELFNBQVEsNkJBQVcsQ0FBQyx3QkFBNEM7SUFDeEksSUFBSSxHQUFHLDZCQUE2QixDQUFDLFdBQVcsQ0FBQztDQUNwRDtBQUZELDhDQUVDO0FBR0QsTUFBYSxzQkFBb0UsU0FBUSw2QkFBVyxDQUFDLHdCQUE0QztJQUM3SSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsaUJBQWlCLENBQUM7Q0FDMUQ7QUFGRCx3REFFQztBQUlELE1BQWEsZ0JBQThELFNBQVEsc0JBQTBDO0lBQ3pILEtBQUssR0FBRyxlQUFlLENBQUM7SUFDeEIsSUFBSSxHQUFHLHVCQUF1QixDQUFDLFVBQVUsQ0FBQztDQUM3QztBQUhELDRDQUdDO0FBT0QsTUFBYSw2QkFBOEIsU0FBUSxzQkFBOEM7SUFDN0YsS0FBSyxHQUFHLHNCQUFzQixDQUFDO0lBQy9CLElBQUksR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUM7Q0FDMUM7QUFIRCxzRUFHQztBQVFELE1BQWEsMEJBQTJCLFNBQVEsc0JBQTJDO0lBQ3ZGLEtBQUssR0FBRyxtQkFBbUIsQ0FBQztJQUM1QixJQUFJLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDO0NBQ3ZDO0FBSEQsZ0VBR0MifQ==