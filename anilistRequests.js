const axios = require(`axios`);
const fs = require(`fs/promises`);

let query = `
query fetchShow ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (search: $search, type: ANIME) {
            title {
                english
            }
            id
            episodes
            coverImage {
                extraLarge
            }
            status
          }
    }
}
`;


async function getShow(anime) {
    let nameOverride = anime.name;
    if (anime.name == "LUPIN THE 3RD PART 1") {
        nameOverride = "Lupin the 3rd";
    }

    const variables = {
        search: nameOverride,
        page: 1,
        perPage: 5
    }
    let tooMany = false;
    const response = await axios({
        url: "https://graphql.anilist.co",
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        data: {
            "operationName": "fetchShow",
            "query": query,
            "variables": variables
        }
    }).catch(async (err) => {
        // console.log(err.response);
        if (err.response.status == 429) {
            tooMany = true;
            console.log("Too many requests to anilist, waiting...");
            await sleep(2000);
            const result = await getShow(anime);
            return result;
        }
        else if (err.response.status == 404) {
            tooMany = true;
            return undefined;
        }
        else {
            console.log(err);
        }
    });

    if (tooMany) return response;

    if (response == undefined) {
        console.log(`No show for ${anime.name}, using defaults`);
        return {
            name: anime.name,
            id: "Unknown",
            coverImage: "static/img/nocover.png"
        }
    }

    let media = response.data.data.Page.media;

    // console.log(anime);
    // console.log(response.data.data.Page.media);

    let episodeCounter = anime.episode;
    if (episodeCounter.toString().includes('-')) {
        return {
            name: anime.name,
            id: media[0].id,
            coverImage: media[0].coverImage.extraLarge,
        }
    }

    let index = 0;
    while (media[index] != undefined && episodeCounter > media[index].episodes) {
        episodeCounter -= media[index].episodes;
        index++;
    }
    // console.log(`Episodes left: ${episodeCounter}\n Index: ${index}`);
    
    let showName = media[index].title.english;
    let id = media[index].id;
    let coverImage = media[index].coverImage.extraLarge;

    // console.log(media[index]);
    // console.log(showName);

    if (showName.toLowerCase() != anime.name.toLowerCase()) showName = anime.name;
    return {
        name: showName,
        id: id,
        coverImage: coverImage
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

module.exports.getShow = getShow;