const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Bot Ready! Logged in as ${client.user.tag}`);
        require("../handlers/CommandRegister.js");
		client.user.setActivity(`viruses`, { type: ActivityType.Watching });
	},
};