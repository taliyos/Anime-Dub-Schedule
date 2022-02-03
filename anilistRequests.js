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
    const variables = {
        search: anime.name,
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
        return {
            name: anime.name,
            id: "Unknown",
            coverImage: "static/img/nocover.png"
        }
    }

    let media = response.data.data.Page.media;

    console.log(anime);
    console.log(response.data.data.Page.media);

    let episodeCounter = anime.episode;
    let index = 0;
    while (media[index] != undefined && episodeCounter > media[index].episodes) {
        console.log(episodeCounter);
        episodeCounter -= media[index].episodes;
        index++;
        console.log(`Episodes left: ${episodeCounter}\n Index: ${index}`);
    }
    console.log(`Episodes left: ${episodeCounter}\n Index: ${index}`);
    
    let showName = media[index].title.english;
    let id = media[index].id;
    let coverImage = media[index].coverImage.extraLarge;

    console.log(media[index]);
    console.log(showName);

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