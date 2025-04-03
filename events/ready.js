const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Bot Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity(`viruses`, { type: ActivityType.Watching });
	},
};