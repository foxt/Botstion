import { Constants, Interaction, Structures, Utils } from "detritus-client";
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = Constants;
const { Embed, Markup } = Utils;



export class BaseInteractionCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    error = "Command";

    onDmBlocked(context: Interaction.InteractionContext) {
        const command = Markup.codestring(context.name);
        return context.editOrRespond({
            content: `⚠ ${this.error} ${command} cannot be used in a DM.`,
            flags: MessageFlags.EPHEMERAL
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRunError(context: Interaction.InteractionContext, _: ParsedArgsFinished, error: any) {
        console.error(error);
        const embed = new Embed();
        embed.setTitle(`⚠ Could not execute ${this.error}`);
        embed.setColor(0xff3860);
        embed.setDescription("oepsie woepsie!");// Markup.codestring(String(error.raw)));
        embed.setImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpics.me.me%2Foepsie-woepsie-de-trein-is-stukkie-wukkie-we-sijn-heul-37586255.png&f=1&nofb=1");

        return context.editOrRespond({
            embed,
            flags: MessageFlags.EPHEMERAL
        });
    }

    onValueError(context: Interaction.InteractionContext, _: Interaction.ParsedArgs, errors: Interaction.ParsedErrors) {
        const embed = new Embed();
        embed.setTitle(`⚠ ${this.error} Argument Error`);

        const store: {[key: string]: string} = {};

        const description: Array<string> = ["Invalid Arguments\n\n"];
        for (const key in errors) {
            const message = errors[key].message;
            if (message in store) {
                description.push(`**${key}**: Same error as **${store[message]}**`);
            } else {
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


export class BaseCommandOption<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND;
}


export class BaseCommandOptionGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}



export class BaseSlashCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends BaseInteractionCommand<ParsedArgsFinished> {
    error = "Slash Command";
    type = ApplicationCommandTypes.CHAT_INPUT;
}


export interface ContextMenuMessageArgs {
  message: Structures.Message,
}

export class BaseContextMenuMessageCommand extends BaseInteractionCommand<ContextMenuMessageArgs> {
    error = "Message Context Menu";
    type = ApplicationCommandTypes.MESSAGE;
}


export interface ContextMenuUserArgs {
  member?: Structures.Member,
  user: Structures.User,
}

export class BaseContextMenuUserCommand extends BaseInteractionCommand<ContextMenuUserArgs> {
    error = "User Context Menu";
    type = ApplicationCommandTypes.USER;
}
