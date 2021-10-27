import { Constants, Interaction, Structures } from 'detritus-client';
export declare class BaseInteractionCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    error: string;
    onDmBlocked(context: Interaction.InteractionContext): Promise<any>;
    onRunError(context: Interaction.InteractionContext, _: ParsedArgsFinished, error: any): Promise<any>;
    onValueError(context: Interaction.InteractionContext, _: Interaction.ParsedArgs, errors: Interaction.ParsedErrors): Promise<any>;
}
export declare class BaseCommandOption<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type: Constants.ApplicationCommandOptionTypes;
}
export declare class BaseCommandOptionGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type: Constants.ApplicationCommandOptionTypes;
}
export declare class BaseSlashCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends BaseInteractionCommand<ParsedArgsFinished> {
    error: string;
    type: Constants.ApplicationCommandTypes;
}
export interface ContextMenuMessageArgs {
    message: Structures.Message;
}
export declare class BaseContextMenuMessageCommand extends BaseInteractionCommand<ContextMenuMessageArgs> {
    error: string;
    type: Constants.ApplicationCommandTypes;
}
export interface ContextMenuUserArgs {
    member?: Structures.Member;
    user: Structures.User;
}
export declare class BaseContextMenuUserCommand extends BaseInteractionCommand<ContextMenuUserArgs> {
    error: string;
    type: Constants.ApplicationCommandTypes;
}
