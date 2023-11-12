const { EmbedBuilder } = require('discord.js')
const { client } = require("../src");
const { CHANNEL } = require('./../.config/config.json')
const fs = require("node:fs")
const {Arona} = require('./../cmds/Raid/arona.json')

function PingWhenBanner(charName, charBannerURL) {
    const schoolData = fs.readFileSync('./init/Students/school.json')
    const rawSchoolData = JSON.parse(schoolData)
    const studentLogo = fs.readFileSync('./.config/logo.json')
    const rawLogo = JSON.parse(studentLogo)
    const schoolColor = fs.readFileSync('./.config/color.json')
    const rawColor = JSON.parse(schoolColor)
    
    const embed = new EmbedBuilder()
    .setAuthor({
        name: 'New Banner released!', iconURL: rawLogo[charName]
    })
    .setColor(rawColor[rawSchoolData[charName]])
    .setImage(charBannerURL)
    .setFields(
        {
            name:"Name:", value: charName, inline:true
        },
        {
            name:"From:", value: rawSchoolData[charName], inline: true
        }
    )
    .setTimestamp()
    .setFooter({
        text: 'Give us 1200 pyroxene, sensei', iconURL: Arona
    })

    setTimeout(c => {
        client.channels.cache.get(CHANNEL).send({
            embeds: [embed]
        })
    }, 3000)
    }

module.exports = {PingWhenBanner}