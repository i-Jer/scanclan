const { Events, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder,
    ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');
const Client = require("../handlers/ClientStart.js");
const Discord = require('discord.js');

/**
 * @param {Client} client 
 */

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if(!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
	    if (!command) {
		    console.error(`No command matching ${interaction.commandName} was found.`);
		    return;
	    }
		const embed = new Discord.EmbedBuilder()
      		.setTitle("Command Log")
			.addFields(
                { name: 'Server:', value: `${interaction.guild}`, inline: true },
                { name: 'Server ID:', value: `${interaction.guild.id}`, inline: true },
                { name: 'Command:', value: `${interaction.commandName}`},
            )
     	 	.setColor("Green")
      		.setTimestamp()
      	interaction.client.channels.cache.get('1137652594613948446').send({ embeds: [embed] })
	    try {
		    await command.execute(interaction);
	    } catch (error) {
	    	console.error(error);
	    	if (interaction.replied || interaction.deferred) {
	    		return;
	    	} else {
	    		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	    	}
	    }
	},
};