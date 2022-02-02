let schedule = [];
let tab = 1;

class ScheduleDate {
    constructor(month, day, dayOfWeek) {
        this.month = month;
        this.day = day;
        this.dayOfWeek = dayOfWeek;

        this.shows = [];
    }

    AddShow(show) {
        this.shows.push(show);
    }

    GetShow(index) {
        return this.shows[index];
    }
}

async function getCalendar() {
    const response = await (fetch("/calendar"));
    const data = await response.json();
    generateCalendar(data);
}

function generateCalendar(data) {
    let shows;

    for (let i = 0; i < data.length; i++) {
        showSection = document.createElement("div");
        showSection.className = "showSection";
        showSection.id = `${data[i].month}${data[i].day}`;

        showImages = document.createElement("div");
        showImages.className = "showImages";

        shows = addDate(data[i].month, data[i].day, data[i].dayOfWeek, showSection, showImages);
        
        date = parseInt(data[i].day);

        for (let j = 0; j < data[i].shows.length; j++) {
            let anime = data[i].shows[j];
            addShowToScreen(anime, shows, showSection, showImages);
        }
    }
}

function addShowToScreen(anime, shows, showSection, showImages) {
    schedule[schedule.length - 1].shows.push(anime);

    let showContainer = document.createElement("div");
    showContainer.className = "show";
    showContainer.dataset.row = schedule.length - 1;
    showContainer.dataset.num = schedule[schedule.length - 1].shows.length - 1;
    showContainer.tabIndex = tab;
    tab++;

    let showArtContainer = document.createElement("div");
    showArtContainer.className = "showArt";

    let showImg = document.createElement("img");
    showImg.src = anime.showImg;

    let showHoverContainer = document.createElement("div");
    showHoverContainer.className = "showHover";

    let showNameContainer = document.createElement("div");
    showNameContainer.className = "showName";
    showNameContainer.textContent = anime.name;

    let showTimeContainer = document.createElement("div");
    showTimeContainer.className = "time";
    let releaseTime = new Date(anime.time.time);
    let hours = releaseTime.getHours();
    let noon = "AM";
    if (hours >= 12) {
        noon = "PM";
        if (hours > 12) hours -= 12;
    }
    let showHourSpan = document.createElement("span");
    showHourSpan.className="hours";
    showHourSpan.textContent = hours;
    let showMinutesSpan = document.createElement("span");
    showMinutesSpan.className = "minutes";
    let min = releaseTime.getMinutes();
    if (min < 10) min = "0" + releaseTime.getMinutes().toString();
    showMinutesSpan.textContent = min;
    let showNoonSpan = document.createElement("span");
    showNoonSpan.className = "half";
    showNoonSpan.textContent = noon;

    showTimeContainer.appendChild(showHourSpan);
    showTimeContainer.innerHTML += ":";
    showTimeContainer.appendChild(showMinutesSpan);
    showTimeContainer.appendChild(showNoonSpan);

    let showEpisodeContainer = document.createElement("div");
    showEpisodeContainer.className = "episode";
    showEpisodeContainer.textContent = getEpisodeAndSeason(anime.episode, anime.season, anime.movie);

    let showPlatformsContainer = document.createElement("div");
    showPlatformsContainer.className = "platforms";
    showPlatformsContainer.innerHTML = getPlatforms(anime.platforms)

    showArtContainer.appendChild(showImg);

    showHoverContainer.appendChild(showNameContainer);
    showHoverContainer.appendChild(showTimeContainer);
    showHoverContainer.appendChild(showEpisodeContainer);
    showHoverContainer.appendChild(showPlatformsContainer);

    showContainer.appendChild(showArtContainer);
    showContainer.appendChild(showHoverContainer);
    showImages.appendChild(showContainer);

    showSection.appendChild(shows);

    // Add all shows for day to calendar
    document.getElementsByClassName("main")[0].appendChild(showSection);
}

function addDate(month, day, dayOfWeek, showSection, showImages) {
    schedule.push(new ScheduleDate(month, day));

    var html_date = document.createElement("div");
    html_date.className = "date";
    var html_dateHead = document.createElement("h2");
    
    html_date.appendChild(html_dateHead);

    var html_shows = document.createElement("div");
    html_shows.className = "shows";

    var html_dayOfWeek = document.createElement("div");
    html_dayOfWeek.className = "dayOfWeek";
    var html_week = document.createElement("h3");

    html_dayOfWeek.appendChild(html_week);

    showSection.appendChild(html_date);
    html_shows.appendChild(html_dayOfWeek);
    html_shows.appendChild(showImages);

    // HTML MODIFICATION
    html_dateHead.innerHTML = month + "<br/><span class=\"dateNum\">" + day + "</span>";
    html_week.textContent = dayOfWeek;

    return html_shows;
}

function getEpisodeAndSeason(episode, season, movie) {
    if (season == null || movie) {
        if (episode == -1) {
            return "Movie";
        }
        return "Episode " + episode;
    }
    return "Season " + season + " Episode " + episode;
}

function getPlatforms(platforms) {
    let platformHTML = "";
    for (let i = 0; i < platforms.length; i++) {
        if (platforms[i] == 0) {
            platformHTML += "<img src=\"static/icons/Funimation.png\"/>"+"Funimation ";
        } else if (platforms[i] == 1) {
            platformHTML += "<img src=\"static/icons/Crunchyroll.png\"/>"+"Crunchyroll ";
        }
        else if (platforms[i] == 2) {
            platformHTML += "<img src=\"static/icons/HiDive.png\"/>"+"HiDive ";
        }
        else if (platforms[i] == 3) {
            platformHTML += "<img src=\"static/icons/Netflix.png\"/>"+"Netflix ";
        }
        else if (platforms[i] == 4) {
            platformHTML += "Other Streaming";
        } 
        else {
            platformHTML += "Home Video Only";
        }
    }
    return platformHTML;
}

getCalendar();