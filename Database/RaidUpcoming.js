const axios = require('axios')
const {config} = require('dotenv')
const fs = require('node:fs')
const { pingWhenANewRaidBossApperance } = require('../modules/PingWhen.Boss')

config();

const RaidUpcomming = () => {
    axios.get(process.env.API + `/raid`).then((c) => {
        const currentRaid = c.data.current[0];
        const prevId = currentRaid.seasonId;
        const upComming = c.data.upcoming[0];

        if(!upComming) {
            console.log("No new bosses has found! Arona will restart the checking in 10 minutes !")
            return;
        }
        const nextId = upComming.seasonId;
        const bossName = upComming.bossName;
        const start = upComming.startAt;
        const end = upComming.endAt;
        if(nextId > prevId) {
            pingWhenANewRaidBossApperance(bossName, start, end);
        }
    })
}
setInterval(() => {
    RaidUpcomming()
}, 600000)