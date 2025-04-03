const { Events, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder,
    	ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');
const Client = require("../handlers/ClientStart.js");
const axios = require('axios');
const crypto = require('crypto');
const config = require("../configs/config.json");
const API_KEY = config.APIKEY; // virustotal api key

async function getSHA256FromUrl(url) {
	// Send GET request with responseType 'stream'
	const response = await axios.get(url, { responseType: 'stream' });
	const hash = crypto.createHash('sha256');
	// Return a Promise that resolves when the stream has ended and the hash computed
	return new Promise((resolve, reject) => {
		response.data.on('data', (chunk) => {
			hash.update(chunk);
		});
		response.data.on('end', () => {
			// Finalize and get the hash in hex format
			const sha256 = hash.digest('hex');
			resolve(sha256);
		});
		response.data.on('error', (error) => {
			reject(error);
		});
	});
}

async function scan(message, attachment){
	// console.log(`Attachment Name: ${attachment.name}`);
	// console.log(`Attachment URL: ${attachment.url}`);
	let messageContent = `# ${attachment.name}\n`;
	const fileUrl = attachment.url;
	const fileName = attachment.name;
	const scanning_embed = new EmbedBuilder()
		.setTitle("Scanning File ...")
		.setDescription(`Scanning: **${fileName}**`)
		.setTimestamp()
		.setColor("Orange")
	const sent_msg = await message.reply({ content: " ", embeds: [scanning_embed] });
		
	try{
		const sha256 = await getSHA256FromUrl(fileUrl);
			
		const file_hash_url = `https://www.virustotal.com/api/v3/files/${sha256}`;
		const final_report = await axios.get(file_hash_url, {
			headers: {
				'x-apikey': API_KEY
			}
		});
		
		const filteredEntries = Object.entries(final_report.data.data.attributes.last_analysis_results).filter( ([, details]) =>
			details.category !== 'type-unsupported' && details.category !== 'timeout'
		);
		filteredEntries.sort(([, aDetails], [, bDetails]) => {
			if (aDetails.category === 'malicious' && bDetails.category !== 'malicious')
				return -1;
			if (bDetails.category === 'malicious' && aDetails.category !== 'malicious')
				return 1;
			if (aDetails.engine_name.toLowerCase() < bDetails.engine_name.toLowerCase())
				return -1;
			if (aDetails.engine_name.toLowerCase() > bDetails.engine_name.toLowerCase())
				return 1;
			return 0;
		});
		send_details(messageContent, filteredEntries, sent_msg);

		
	} catch (error) {
		if(error.response){
			if(error.response.data.error.code == "NotFoundError") sent_msg.edit({ content: "File is not available in VirusTotal Database", embeds: [] });
		}
		console.error('Error scanning file:', error.response ? error.response.data : error.message);
	}
}

function send_details(messageContent, filteredEntries, sent_msg){
	// Loop over each antivirus result
	let red = 0;
	let total_cnt = 0;
	const reportLines = filteredEntries.map(([vendor, details]) => {
        total_cnt++;
		if(details.category === 'malicious' && details.result) {
			red++;
			return `**${vendor}:** ${details.result} 🔴`;
		}
		return `**${vendor}:** 🟢`;
	});
	messageContent += reportLines.join('\n');
	const red_percent = (red/total_cnt) * 100;
	let embed_color;
	if(red_percent > 40) embed_color = "Red";
		else if(red_percent > 20) embed_color = "Orange";
		else embed_color = "Green";
	const embed = new EmbedBuilder()
		.setTitle("File Scan Report")
		.setDescription(messageContent)
		.setTimestamp()
		.setColor(`${embed_color}`)
	sent_msg.edit({ content: " ", embeds: [embed] });
}

/**
 * @param {Client} client 
 */

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if(!message.attachments.size) return;
		message.attachments.forEach(async attachment => {
			scan(message, attachment);
		});
	},
};