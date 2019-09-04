const HttpClient = require('@bbc/http-client');
const httpClient = new HttpClient();

const PASSPORT_API = 'https://passport-store.test.api.bbci.co.uk/passport';

const createPassport = async (locator, body) => {
    try {
        await httpClient.post({
            uri: PASSPORT_API,
            body: body,
            json: true
        });
        console.log(`Passport created for ${locator}`);
    } catch ({ error }) {
        console.log(`Passport creation for '${locator}' failed with '${error.error}'`);
    }
};

const getPassport = async locator => {
    try {
        const passport = await httpClient.get({
            uri: `${PASSPORT_API}?locator=${locator}`,
            json: true
        });
        return passport.results[0];
    } catch (error) {
        console.log(`Can't get passport with locator '${locator}', failed with '${error}'`);
    }
};

const updatePassport = async (locator, body) => {
    try {
        const passport = await getPassport(locator);
        await httpClient.put({
            uri: `${PASSPORT_API}/${passport.passportId}`,
            body: body,
            json: true
        });
        console.log(`Passport updated for ${locator}`);
    } catch (error) {
        console.log(`Passport update for '${locator}' failed with '${error}'`);
    }
};

const deletePassport = async locator => {
    try {
        await httpClient.delete(`${PASSPORT_API}?locator=${locator}`);
        console.log(`Passport deleted for ${locator}`);
    } catch (error) {
        console.log(`Passport deletion for '${locator}' failed with '${error}'`);
    }
};

module.exports = {
    createPassport,
    getPassport,
    updatePassport,
    deletePassport
};