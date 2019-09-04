const HttpClient = require('@bbc/http-client');
const httpClient = new HttpClient();

const APIKEY = process.env.SEARCH_API_KEY;
const QUERY = 'peaky+blinders';
const TYPE = 'video'; // video or audio
const GROUP = true;
const URL = `https://search.api.bbci.co.uk/search-query/search?apikey=${APIKEY}&q=${QUERY}&category_media_type=${TYPE}&group=${GROUP}`;
const IDENTIFIER = 'http://purl.org/dc/elements/1.1/identifier';

const search = async () => {
    try {
        const response = await httpClient.get({
            uri: URL,
            headers: { 'Accept': 'application/vnd.collection+json' },
            json: true
        });

        return response.collection.items;
    } catch(error) {
        console.log(error);
    }
};

const extractLocators = items => {
    return items
        .map(item => item.data
        .find(d => d.name === IDENTIFIER).value);
};

const followLinks = async items => {
    const links = items.reduce((acc, item) => {
        if (item.links) {
            return acc.concat(item.links.map(link => link.href))
        }
        return acc;
    }, []);

    const followedItems = [];
    for(let i=0; i<links.length; i++) {
        const linkItems = await search(links[i]);
        followedItems.push(linkItems);
    }

    return followedItems;
};

module.exports = {
    search,
    extractLocators,
    followLinks
};