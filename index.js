const { search, extractLocators, followLinks } = require('./search-api');
const { createPassport, getPassport, deletePassport, updatePassport } = require('./passport-store');

const PASSPORT_TAG = 'http://www.bbc.co.uk/things/32debb35-2f2d-4648-92b6-9d8e35791472#id'; 
const PASSPORT_BBC_HOME = 'http://www.bbc.co.uk/ontologies/passport/home/BBC';
const PASSPORT_LANGUAGE = 'en-gb';
const PASSPORT_AVAILABILITY = 'AVAILABLE';
 
const searchAndGetLocators = async url => {
    const items = await search(url);
    const itemsLevel2 = await followLinks(items);
    return extractLocators(items.concat(...itemsLevel2));
};

const migrateLocator = locator => {
    return locator.replace('urn:bbc:programmes', 'urn:pips');
};

const getPassportBody = locator => ({
    availability: PASSPORT_AVAILABILITY,
    home: PASSPORT_BBC_HOME,
    language: PASSPORT_LANGUAGE,
    taggings: [
        {
        "predicate": "http://www.bbc.co.uk/ontologies/passport/predicate/About",
        "value": PASSPORT_TAG
        }
    ],
    locator: locator
});

const createAllPassports = locators => {
    locators.forEach(locator => createPassport(locator, getPassportBody(locator)));
};

const updateAllPassports = locators => {
    locators.forEach(locator => updatePassport(locator, getPassportBody(locator)));
};

const deleteAllPassports = locators => {
    locators.forEach(deletePassport);
};

const displayLocators = locators => {
    console.log(`${locators.length} locators found:`);
    console.log('===============');
    locators.reduce((acc, locator) => {
        if(acc.length === 0) {
            acc.push([locator]);
            return acc;
        }

        const lastGroup = acc[acc.length - 1];
        if (lastGroup.length > 2) {
            console.log(lastGroup.join('      '));
            acc.push([locator]);
        } else {
            acc[acc.length - 1].push(locator);
        }

        return acc;
    }, []);
    console.log('===============');
};

const searchAndCreatePassports = async () => {
    const locators = await searchAndGetLocators(URL);
    displayLocators(locators);

    const migratedLocators = locators.map(migrateLocator);
    // await deleteAllPassports(migratedLocators);
    await updateAllPassports(migratedLocators);
    // await createAllPassports(migratedLocators);
};

searchAndCreatePassports();

