//init
const Discord = require("discord.js");
const { GatewayIntentBits } = require("discord.js");
const config = require("../configs/config.json");
const fs = require('fs');
const path = require('path');
const realToken = config.token;

class client extends Discord.Client {
    constructor() {
        super({ intents: [
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution,
            GatewayIntentBits.DirectMessagePolls,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessagePolls,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.MessageContent
        ] });

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
    }
    
    start(token) {
        // commands check
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
	        const filePath = path.join(commandsPath, file);
	        const command = require(filePath);
	        // Set a new item in the Collection with the key as the command name and the value as the exported module
	        if ('data' in command && 'execute' in command) {
		        this.commands.set(command.data.name, command);
                console.log(`Command "${command.data.name}" loaded.`)
	        } else {
		        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	        }
        }

        // events check
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
	        const filePath = path.join(eventsPath, file);
	        const event = require(filePath);
	        if (event.once) {
	        	this.once(event.name, (...args) => event.execute(...args));
	        } else {
	        	this.on(event.name, (...args) => event.execute(...args));
	        }
        }

        this.login(realToken);
    }
}

module.exports = client;