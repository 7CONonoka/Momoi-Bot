const {Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { CHANNEL } = require("../.config/config.json");
const fs = require('node:fs');
const path = require('node:path');
const moment = require('moment')
const {config} = require('dotenv')

//API
const axios = require('axios')

//Database
const JSONdb = require('simple-json-db')


//create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
})

client.commands = new Collection();

const folderPaths = path.join(__dirname, '../cmds');
const folderInside = fs.readdirSync(folderPaths);

for(const folder of folderInside) {
    const commandsPath = path.join(folderPaths, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(c => c.endsWith('.js'));

    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
        else console.log(`[WARNING] The command at ${filePath} are missing 'data' or 'execute' property.`);
    }
}

const eventsPath = path.join(__dirname, '../events');
const eventFiles = fs.readdirSync(eventsPath).filter(c => c.endsWith('.js'));

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

module.exports = {client}

config();

// Run crawler
require('../Database/RaidUpcoming')
require('../Database/Banner')

client.login(process.env.TOKEN);