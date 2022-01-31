const axios = require(`axios`);
const fs = require(`fs/promises`);

let query = `
query fetchShow ($search: String) {
    Media (search: $search, type: ANIME) {
      id
      coverImage {
          extraLarge
      }
      status
    }
}
`;

async function getShow(showName) {
    const variables = {
        search: showName,
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
            const result = await getShow(showName);
            return result;
        }
        else if (err.response.status == 404) {
            tooMany = true;
            return {
                name: showName,
                id: "Unknown",
                coverImage: "static/img/nocover.png"
            }
        }
    });

    if (tooMany) return response;

    console.log(response.data.data);

    return {
        name: showName,
        id: response.data.data.Media.id,
        coverImage: response.data.data.Media.coverImage.extraLarge
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

module.exports.getShow = getShow;