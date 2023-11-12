const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const current = require('../Banner/current')
const {API, CHANNEL} = require('../../.config/config.json')
const axios = require('axios')
const fs = require('node:fs')
const moment = require('moment')
const {Arona} = require('./arona.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("raid")
    .setDescription("Get current or upcomming raid!")
    .addStringOption(option =>
        option.setName('type')
            .setDescription('Type of raids')
            .setRequired(true)
            .addChoices(
                {name: 'current', value: 'current'},
                {name: 'upcomming', value: 'upcoming'}
            )
    ),
    
    async execute(interaction) {
        const upBanner = fs.readFileSync("./.config/raid.json");
        const rawBanner = JSON.parse(upBanner);
        const upColor = fs.readFileSync("./.config/raidColor.json");
        const rawColor = JSON.parse(upColor)        

        if(interaction.options.getString('type') == 'current') {
            axios.get(API + '/raid').then(c => {
                const cur = c.data.current[0];
                
                if(!cur) {
                    interaction.reply(`Kivotos is at peace, ${interaction.user.displayName}-sensei please take a rest!`)
                    return;
                }

                const bossName = cur.bossName;
                interaction.reply(`${bossName}'s still assaulting Kivotos! ${interaction.user.displayName}-sensei please give us instructions!`)

                const startT = new Date(cur.startAt)
                const endT = new Date(cur.endT);

                const formattedStart = moment(startT).format("DD/MM/YYYY");
                const formattedEnd = moment(endT).format("DD/MM/YYYY")

                const embed = new EmbedBuilder()
                .setTitle(bossName)
                .setColor(rawColor[bossName])
                .setImage(rawBanner[bossName])
                .addFields(
                    {name: "Start At:", value: formattedStart, inline: true},
                    {name: "End At:", value: formattedEnd, inline: true}
                )
                .setTimestamp()
                .setFooter({
                    text: 'Give us 1200 pyroxene, sensei', iconURL: Arona
                })

                interaction.channel.send({
                    embeds: [embed]
                })
            })

            return;
        }

        axios.get(API + '/raid').then(c => {
            const Upc = c.data.upcoming[0];
            
            if(!Upc) {
                interaction.reply(`No bosses are coming at this moment, ${interaction.user.displayName}-sensei please take a rest!`)
                return;
            }

            const bossName = Upc.bossName;
            interaction.reply(`${bossName}'s going to assault Kivotos! ${interaction.user.displayName}-sensei please give us instructions!`)

            const startT = new Date(Upc.startAt)
            const endT = new Date(Upc.endAt);

            const formattedStart = moment(startT).format("DD/MM/YYYY");
            const formattedEnd = moment(endT).format("DD/MM/YYYY")

            const embed = new EmbedBuilder()
            .setTitle(bossName)
            .setColor(rawColor[bossName])
            .setImage(rawBanner[bossName])
            .addFields(
                {name: "Start At:", value: formattedStart, inline: true},
                {name: "End At:", value: formattedEnd, inline: true}
            )
            .setTimestamp()
            .setFooter({
                text: 'Give us 1200 pyroxene, sensei', iconURL: Arona
            })

            interaction.channel.send({
                embeds: [embed]
            })
        })

        return;
    }
}