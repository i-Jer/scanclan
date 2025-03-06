const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Show bot's latency!"),
	async execute(interaction) {
		const inter = await interaction.reply({ content: 'Calculating ...', fetchReply: true });
		const ping = inter.createdTimestamp - interaction.createdTimestamp;
	
		const embed = new Discord.EmbedBuilder()
			.setTitle("Latency")
			.addFields([
				{ name: "Bot Latency:", value: `\`${ping}\` ms` },
				{ name: "API Latency:", value: `\`${interaction.client.ws.ping}\` ms` }
			])
			.setTimestamp()
			.setColor("DarkButNotBlack")
			
		await interaction.editReply({ content: " ", embeds: [embed] });
		
	},
};