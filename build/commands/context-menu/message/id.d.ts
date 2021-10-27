import { Interaction } from 'detritus-client';
import { BaseContextMenuMessageCommand, ContextMenuMessageArgs } from '../../basecommand';
export declare const COMMAND_NAME = "ID";
export default class InformationCommand extends BaseContextMenuMessageCommand {
    name: string;
    run(context: Interaction.InteractionContext, args: ContextMenuMessageArgs): Promise<any>;
}
