const { client } = require("../src");

function pingWhenANewRaidBossApperance(bossName, start, end) {
    const upBanner = fs.readFileSync("./.config/raid.json");
    const rawBanner = JSON.parse(upBanner);
    const upColor = fs.readFileSync("./.config/raidColor.json");
    const rawColor = JSON.parse(upColor)    

    setTimeout(() => {
        client.channels.cache.get(CHANNEL).send("Sensei! A new boss has come!")
    }, 3000)

    let startAt = new Date(start);
    let endAt = new Date(end);

    let formattedStart = moment(startAt).format("DD/MM/YYYY");
    let formattedEnd = moment(endAt).format("DD/MM/YYYY");
    const embed = new EmbedBuilder()
    .setTitle(bossName)
    .setColor(rawColor[bossName])
    .setImage(rawBanner[bossName])
    .setFields(
        {
            name:"Start At:", value: formattedStart, inline:true
        },
        {
            name:"End At:", value: formattedEnd, inline: true,
        }
    )
    setTimeout(() => {
        client.channels.cache.get(CHANNEL).send({
            embeds: [embed]
        })
    }, 3000)
}

module.exports = {pingWhenANewRaidBossApperance}