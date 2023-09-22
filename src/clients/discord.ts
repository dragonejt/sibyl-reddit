import { Client, Collection, ClientOptions } from "discord.js";

export interface Command {
    data: unknown
    execute: (interaction: any) => Promise<void>
}

export class SibylDiscordClient extends Client {
    public commands: Collection<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}
