import { Interaction } from 'detritus-client';
import { BaseSlashCommand } from '../basecommand';
export declare const COMMAND_NAME = "ping";
export default class PingCommand extends BaseSlashCommand {
    description: string;
    name: string;
    run(context: Interaction.InteractionContext): Promise<any>;
}
