import { Interaction, Structures } from 'detritus-client';
import { BaseCommandOption } from '../../basecommand';
export interface CommandArgs {
    user: Structures.Member | Structures.User;
}
export declare class AvatarCommand extends BaseCommandOption {
    description: string;
    name: string;
    constructor();
    run(context: Interaction.InteractionContext, args: CommandArgs): Promise<any>;
}
