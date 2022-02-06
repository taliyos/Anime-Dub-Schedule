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
    if (min < 10) min = `0${releaseTime.getMinutes().toString()}`;
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


    // Platforms
    let showPlatformsContainer = getPlatformHTML(anime.platforms);


    // showPlatformsContainer.innerHTML = getPlatforms(anime.platforms)

    showArtContainer.appendChild(showImg);
    showArtContainer.appendChild(showPlatformsContainer);

    showHoverContainer.appendChild(showNameContainer);
    showHoverContainer.appendChild(showTimeContainer);
    showHoverContainer.appendChild(showEpisodeContainer);

    showContainer.appendChild(showArtContainer);
    showContainer.appendChild(showHoverContainer);
    showImages.appendChild(showContainer);

    showSection.appendChild(shows);

    // Add all shows for day to calendar
    document.getElementsByClassName("main")[0].appendChild(showSection);
}

// Adds a new date row to the schedule
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

// Returns formatted string for episode
function getEpisodeAndSeason(episode, season, movie) {
    if (movie) return "Movie";
    return `Episode ${episode}`;
}

// Linking to the site's main page is temporary.
// In the future this should link to the show page
// (not specifically the episode)
function getPlatformHTML(platforms) {
    let showPlatformsContainer = document.createElement("div");
    showPlatformsContainer.className = "platforms";

    for (let i = 0; i < platforms.length; i++) {
        let site = document.createElement("a");
        site.className = "platform";
        let siteImg = document.createElement("img");
        if (platforms[i] == 0) {
            site.href = "https://www.funimation.com";
            siteImg.src = "static/icons/Funimation.png";
            siteImg.alt = "Funimation";
        }
        else if (platforms[i] == 1) {
            site.href = "https://www.crunchyroll.com";
            siteImg.src = "static/icons/Crunchyroll.png";
            siteImg.alt = "Crunchyroll";
        }
        else if (platforms[i] == 2) {
            site.href = "https://www.hidive.com";
            siteImg.src = "static/icons/HiDive.png";
            siteImg.alt = "HiDive";
        }
        else if (platforms[i] == 3) {
            site.href = "https://www.netflix.com";
            siteImg.src = "static/icons/Netflix.png";
            siteImg.alt = "Netflix";
        }
        else if (platforms[i] == 4) {
            site.href = "";
            siteImg.src = "";
            siteImg.alt = "?";
        }
        else if (platforms[i] == 5) {
            site.href = "";
            siteImg.src = "static/img/disc.png";
            siteImg.alt = "Home Video";
        }

        site.appendChild(siteImg);
        showPlatformsContainer.appendChild(site);
    }

    return showPlatformsContainer;
}

getCalendar();