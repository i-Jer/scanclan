const Discord = require("discord.js");
const { GatewayIntentBits } = require("discord.js");
const config = require("../configs/config.json");
const fs = require('fs');
const path = require('path');
const token = config.token;
class Client extends Discord.Client {
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
    }
    start() {
        // events check
        const eventsPath = path.join(__dirname, '../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for(const file of eventFiles) {
	        const filePath = path.join(eventsPath, file);
	        const event = require(filePath);
	        if(event.once) {
	        	this.once(event.name, (...args) => event.execute(...args));
	        } else {
	        	this.on(event.name, (...args) => event.execute(...args));
	        }
        }
        this.login(token);
    }
}
module.exports = Client;