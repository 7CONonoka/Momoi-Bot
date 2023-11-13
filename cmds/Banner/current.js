const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const {API} = require('../../.config/config.json')
const axios = require('axios')
const fs = require('node:fs')
const moment = require('moment/moment')

module.exports = {
    data: new SlashCommandBuilder().setName('banner').setDescription('Return current banner!'),

    async execute(iteraction) {
        iteraction.reply(`New students have come sensei! Please take a look ^^`)
        const studentsData = fs.readFileSync('./init/Students/students.json');
        const rawStudentsData = JSON.parse(studentsData);
        const schoolData = fs.readFileSync('./init/Students/school.json');
        const rawSchoolData = JSON.parse(schoolData);
        const colorData = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/color.json');
        const rawColorData = JSON.parse(colorData);
        const StudentLogo = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/logo.json');
        const rawStudentLogo = JSON.parse(StudentLogo);
        const BannerURL = fs.readFileSync('./.config/Game_Init_Config/BannerConfig/bannerLink.json');
        const rawBannerURL = JSON.parse(BannerURL);

        axios.get(API + `/banner`).then(async(c) => {
            const el = c.data.current;
            
            for(const char of el) {
                if(rawStudentsData[char.rateups[0]]) {
                    const school = rawSchoolData[char.rateups[0]];
                    const logo = rawStudentLogo[char.rateups[0]];
                    const {Arona} = require('./../../.config/Game_Init_Config/arona.json')
                    
                    const Color = rawColorData[school];
                    const startAt = new Date(char.startAt - (10 * 60 * 60 * 1000));
                    const endAt = new Date(char.endAt - (10 * 60 * 60 * 1000));
                    const FormattedStartAt = moment(startAt).format("DD/MM/YYYY")
                    const FormattedEndAt = moment(endAt).format("DD/MM/YYYY")

                    const bannerURL = rawBannerURL[char.rateups[0]]

                    const embed = new EmbedBuilder()
                    .setColor(Color)
                    .setAuthor({name: char.rateups[0], iconURL: logo})
                    //.setThumbnail(logo)
                    .setImage(bannerURL)
                    .setFields(
                        {
                            name: "Start At:", value: FormattedStartAt, inline:true
                        },
                        {
                            name: "End At:", value: FormattedEndAt, inline: true
                        }
                    )
                    .setFooter({text: `Give me 24k pyroxense, ${iteraction.user.displayName}-sensei`, iconURL: Arona})

                    iteraction.channel.send({
                        embeds: [embed]
                    })
                }
            }
        })
    }
}