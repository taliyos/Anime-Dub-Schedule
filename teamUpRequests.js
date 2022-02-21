const axios = require(`axios`);
const fs = require(`fs/promises`);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let calendar;

class Show {
    constructor(name, movie, season, episode, platforms, anilistID, showImg, time) {
        this.name = name;
        this.movie = movie;
        this.season = season;
        this.episode = episode;
        this.platforms = platforms;
        this.anilistID = anilistID;
        this.showImg = showImg;
        this.time = time;
    }
}

let apiKey = undefined;

async function updateTeamUp() {
    if (apiKey == undefined) {
        await loadConfig();
    }

    calendar = await getShows();
    return calendar;
}

async function loadConfig() {
    const data = await fs.readFile("settings/teamup.json");
    const json = await JSON.parse(data);

    apiKey = json.APIKey;
}

async function getShows() {
    let today = new Date();

    let calStartDate = new Date();
    calStartDate.setDate(calStartDate.getDate() - 7);
    let start = `${calStartDate.getUTCFullYear()}-${calStartDate.getUTCMonth() + 1}-${calStartDate.getUTCDate()}`;
    var end = today.getUTCFullYear()+"-"+(today.getUTCMonth()+2)+"-"+today.getUTCDate();
    var url = `https://api.teamup.com/ksdhpfjcouprnauwda/events?startDate=`+start+`&endDate=`+end;

    const res = await axios.get(url, {
        headers: {
            "Teamup-Token": apiKey,
        }
    }).catch(err => {
        console.log(err);
    });

    return processCalendar(res);
}

function processCalendar(response) {
    var data = response.data;
    let shows = [];

    for (let i = 0; i < data.events.length; i++) {
        let item = data.events[i];

        // Process Date
        let showDate = getShowDate(item);

        // Process Show Title + Movie Status
        let showTitle = getShowTitle(item);

        // Process Show Episode + Season Num
        let showEpisode = getShowEpisodeAndSeason(item);

        // Process Platform(s)
        let platforms = getShowPlatforms(item);

        shows.push(new Show(showTitle.name, showTitle.movie, showEpisode.season, showEpisode.episode, 
            platforms, "TBD", "TBD", showDate));
    }

    return {shows: shows};

}

function getShowDate(item) {
    let releaseDate = new Date(item.start_dt);
    return {
        "month": months[releaseDate.getMonth()],
        "day": releaseDate.getDate(),
        "time": releaseDate.getTime(),
        "dayOfWeek": days[releaseDate.getDay()]
    }
}

function getShowTitle(item) {
    // Special case for Attack on Titan, which has a different format
    if (item.title.includes("Attack on Titan| Final Season Part 2")) {
        return {
            "name": "Attack on Titan Final Season Part 2",
            "movie": false,
        };
    }

    let match = /[A-Z]/.exec(item.title);
    let endOfTitle = item.title.indexOf(`|`);
    let movie = false;
    if (endOfTitle == -1) endOfTitle = item.title.length + 1;
    let showName = (item.title.substring(match.index, endOfTitle - 1)).trim();
    if (showName.includes("Movies")) {
        showName = showName.substring(showName.indexOf("Movies")+8);
        movie = true;
    } else if (showName.includes("Movie")) {
        showName = showName.substring(showName.indexOf("Movie")+7);
        movie = true;
    } else if (showName.includes("Unconfirmed")) {
        showName = showName.substring(showName.indexOf("Unconfirmed") + 13);
        if (showName.includes("#")) {
            showName = showName.substring(showName.indexOf("#") + (showName.indexOf(" ") - showName.indexOf("#") + 1));
        }
    }
    return {
        "name": showName,
        "movie": movie
    };
}

function getShowEpisodeAndSeason(item) {
    let sub = item.title.substring(item.title.indexOf(`#`) + 1, item.title.length);
    let episodeNum = sub.substring(0, sub.indexOf(' '));
    if (item.title.indexOf(`#`) == -1) episodeNum = -1;
    let seasonNum = /Season /.exec(item.title);
    if (seasonNum != null) {
        seasonNum = item.title.substring(seasonNum.index);
        try {
            let seasonReg = /[0-9]/.exec(seasonNum);
            if (seasonReg != null) seasonNum = seasonReg[0];
            else seasonNum = null;
        }
        catch {
            seasonNum = null;
        }
    }
    // console.log(`${episodeNum} // ${seasonNum}`);

    return {
        episode: episodeNum,
        season: seasonNum
    }
}

function getShowPlatforms(item) {
    let platforms = [];
    for (let i = 0; i < item.subcalendar_ids.length; i++) {
        if (item.subcalendar_ids[i] == 9409028) {
            platforms.push(0); // Funimation
        } 
        else if (item.subcalendar_ids[i] == 9244632) {
            platforms.push(1); // Crunchyroll
        }
        else if (item.subcalendar_ids[i] == 9244626) {
            platforms.push(2); // HiDive
        } 
        else if (item.subcalendar_ids[i] == 9265431) {
            platforms.push(3); // Netflix
        } 
        else if (item.subcalendar_ids[i] == 9805490) {
            platforms.push(4); // Other
        } else if(item.subcalendar_ids[i] == 9856401) {
            platforms.push(5); // Home-Video only
        }
        else {
            console.log(`UNKNOWN: ${item.title} with Calendar ID: ${item.subcalendar_ids[i]}`)
        }
    }

    return platforms;
}

function getCurrentShows() {
    return calendar;
}

module.exports.updateTeamUp = updateTeamUp;
module.exports.getShows = getCurrentShows;
module.exports.Show = Show;