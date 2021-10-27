import { Interaction } from 'detritus-client';
import { BaseContextMenuUserCommand, ContextMenuUserArgs } from '../../basecommand';
export declare const COMMAND_NAME = "Information";
export default class InformationCommand extends BaseContextMenuUserCommand {
    name: string;
    run(context: Interaction.InteractionContext, args: ContextMenuUserArgs): Promise<any>;
}
