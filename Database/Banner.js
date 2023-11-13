const cheerio = require('cheerio');
const axios = require('axios');
const jsondb = require('simple-json-db');
const {SlashCommandBuilder} = require('discord.js')

const fs = require('node:fs')

let db = new jsondb('./.config/Game_Init_Config/BannerConfig/bannerLink.json');
let limts = require('./limits.json');
const { PingWhenBanner } = require('../modules/PingWhen.Banner');
const { client } = require('../src');
const { CHANNEL } = require('./../.config/config.json')
let oldlimts = limts.current
let path = './.config/DatabaseConfig/limits.json'
let tmp;

//Replace specific words
function ReplaceWords(words) {
    if(words && String(words).includes("Bunny Girl")){ 
        words = words.replace("Bunny Girl", "Bunny")
        //console.log(words)
    };

    if(words && String(words).includes("Cheerleader")){ 
        words = words.replace("Cheerleader", "Cheer Squad")
        //console.log(words)
    };

    if(words && String(words).includes("Sportswear")){ 
        words = words.replace("Sportswear", "Track")
        //console.log(words)
    };

    if(words && String(words).includes("Kid")){ 
        words = words.replace("Kid", "Small")
        //console.log(words)
    };

    if(words && String(words).includes("Riding")){ 
        words = words.replace("Riding ", "Cycling")
        //console.log(words)
    };

    if(words && String(words).includes("Arisu")){ 
        words = words.replace("Arisu", "Aris")
        //console.log(words)
    };

    return words
}

function DoingStuff(charName, charImgs) {
    client.channels.cache.get(CHANNEL).send(`Sensei! new students are coming!`)
    for(let i = 0; i < charImgs.length; ++i) {
        let tmpIndex = i + oldlimts + 1;
        let curCharName = charName[tmpIndex];
        let curCharBanner = charImgs[i];
        PingWhenBanner(curCharName, curCharBanner)
    }
}

function BannerCrawling() {
    axios.get(`https://bluearchive.wiki/wiki/Banner_List_(Global)`).then(async c => {
    const $ = cheerio.load(c.data);

    const imgs = [], charName = [];

    //Get Images
    $("td.image").each((i, el) => {
        const img = $(el).find("img").attr("src").replace("//", "https://")
        
        if(i > limts.current) {
            tmp = i; // Take the new limit
            imgs.push(img);
        }
    })

    //Get student's name
    $("td").each((i, el) => {
        let charN = $(el).find("a").attr("title");

        charN = ReplaceWords(charN)

        if(charN) charName.push(charN);
    })

    //Auto-Ping
    if(limts.current < tmp) {
        //update the database
        for(let i = 0; i < imgs.length; ++i) {
            let tmpIndex = i + limts.current + 1;
            db.set(charName[tmpIndex], imgs[i]);
        }

        //update Limits
        limts.current = tmp;

        fs.writeFile(path, JSON.stringify(limts, null, 2), (err) => {
            if(err) throw err;
        })

        DoingStuff(charName, imgs)
        return;
    }
    console.log("No change has been caught, continue checking after 10 minutes.")
    return;
})
}

//BannerCrawling()

setInterval((c) => {
    BannerCrawling();
}, 10*60*1000);