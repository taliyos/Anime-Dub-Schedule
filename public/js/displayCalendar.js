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

    let showImg = document.createElement("img");
    showImg.src = anime.showImg;

    showContainer.addEventListener("click", function() {
        setActiveShow(showContainer.dataset.row, showContainer.dataset.num);
    });
    showContainer.addEventListener("keyup", function(event) {
        if (event.keyCode == 9 || event.keyCode == 13) {
            event.preventDefault();
            setActiveShow(showContainer.dataset.row, showContainer.dataset.num);
        }
    });

    showContainer.appendChild(showImg);
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

function setActiveShow(row, item) {
    let show = schedule[row].GetShow(item);
    console.log(schedule[row]);

    let releaseTime = new Date(show.time.time);
    let hours = releaseTime.getHours();
    let isAM = "AM";
    if (hours >= 12) {
        isAM = "PM";
        if (hours > 12) hours -= 12;
    }

    document.getElementById("showName").textContent = show.name;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = releaseTime.getMinutes();
    if (releaseTime.getMinutes() < 10) document.getElementById("minutes").textContent = "0" + releaseTime.getMinutes().toString();

    document.getElementById("half").textContent = isAM;
    document.getElementById("episode").textContent = getEpisodeAndSeason(show.episode, show.season, show.movie);
    let platforms = show.platforms;
    let platformHTML = "";
    for (let i = 0; i < show.platforms.length; i++) {
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
    document.getElementById("platforms").innerHTML = platformHTML;
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
    for (let i = 0; i < show.platforms.length; i++) {
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