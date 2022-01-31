const axios = require(`axios`);
const fs = require(`fs/promises`);
const teamup = require(`${__dirname}/teamUpRequests.js`);
const anilist = require(`${__dirname}/anilistRequests.js`);

let knownShows = [];

let showDataToWrite;

let calendar = undefined;

class ScheduleDate {
    constructor(month, day, dayOfWeek, shows) {
        this.month = month;
        this.day = day;
        this.dayOfWeek = dayOfWeek;
        this.shows = shows;   
    }
}

async function process(shows) {
    // Look at each show and add them to a database of shows, if they don't already exist
    // If they already exist, just get that entry from the database
    
    // Add the show to a specific date

    // Check if knownShows is empty (which typically means the server was just started)
    if (knownShows.length == 0) {
        await readShows();
    }

    const file = await fs.readFile("data/showData.json");
    if (file.length != 0) showDataToWrite = JSON.parse(file);

    await findNewShows(shows);

    const cal = await addShowsToCalendar(shows);

    calendar = cal;

    return cal;
}

async function addShowsToCalendar(shows) {
    let cal = [];

    let month = undefined;
    let day = undefined;
    let dayOfWeek = undefined;
    let dayShows = [];

    for (let i = 0; i < shows.length; i++) {
        let anime = shows[i];
        if (month == undefined) {
            month = anime.time.month;
            day = anime.time.day;
            dayOfWeek = anime.time.dayOfWeek;
        }
        else if (day != anime.time.day || month != anime.time.month) {
            cal.push(new ScheduleDate(month, day, dayOfWeek, dayShows));
            day = anime.time.day;
            month = anime.time.month;
            dayOfWeek = anime.time.dayOfWeek;
            dayShows = [];
        }

        for (let j = 0; j < knownShows.length; j++) {
            if (knownShows[j].name == anime.name) {
                const currentShow = new teamup.Show(anime.name, anime.movie, anime.season, anime.episode, anime.platforms, knownShows[j].anilistID, knownShows[j].showImg, anime.time);
                // console.log(currentShow);
                dayShows.push(currentShow);
                break;
            }
        }
    }

    return cal;
}

// Keeping everything local for now
// Will probably need to move to a database (mongodb) later
// Or rethink the data structure to allow for faster finds
async function findNewShows(shows) {
    for (let i = 0; i < shows.length; i++) {
        let found = false;
        for (let j = 0; j < knownShows.length; j++) {
            if (shows[i].name == knownShows[j].name) {
                found = true;
                break;
            }
        }
        if (!found) {
            // We need to find the show and add it to the JSON
            knownShows.push(await addShow(shows[i]));
        }
    }

    await writeShows();
}

async function addShow(show) {
    // Query AniList
    console.log(`Adding ${show.name}`);
    const anilistInfo = await anilist.getShow(show.name);
    // console.log(anilistInfo);

    // Add the following to the JSON
    // ----
    // show name
    // anilist id
    // show img url
    // ----
    let data = {
        name: show.name,
        anilistID: anilistInfo.id,
        showImg: anilistInfo.coverImage
    };
    
    showDataToWrite.push(data);

    return data;
}

async function writeShows() {
    if (showDataToWrite == undefined || showDataToWrite.length == 0) return;
    await fs.writeFile("data/showData.json", JSON.stringify(showDataToWrite));
}

async function readShows() {
    const data = await fs.readFile("data/showData.json");
    if (data.length == 0) return;
    const json = JSON.parse(data);

    for (let i = 0; i < json.length; i++) {
        knownShows.push(json[i]);
    }
}

function getCurrentCalendar() {
    return calendar;
}

module.exports.process = process;
module.exports.getCurrentCalendar = getCurrentCalendar;