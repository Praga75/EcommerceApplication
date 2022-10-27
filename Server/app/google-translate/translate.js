const { fcm } = require('../../config/config');
const projectId = fcm.project_id;
const location = 'global';
const { TranslationServiceClient } = require('@google-cloud/translate');
const { Translate } = require('@google-cloud/translate').v2;
const logger = require(global.appRoot + '/app/log');
// Creates a client
const translate = new Translate({ projectId });
const translationClient = new TranslationServiceClient();
// process.env.GOOGLE_APPLICATION_CREDENTIALS = './config/google-crd.json'

const translateText = async (text, target) => {
    // Translates some text into target
    try {
        let [translations] = await translate.translate(text, target);
        translations = Array.isArray(translations) ? translations : [translations];
        return Promise.resolve(translations);
    } catch (error) {
        logger.error('Message has not been sent:', error);
        return Promise.reject(error);
    }
};


const getSupportedLanguages = async () => {
    try {
        let [languages] = await translate.getLanguages();
        languages = Array.isArray(languages) ? languages : [languages];
        return Promise.resolve(languages);
    } catch (error) {
        return Promise.reject(error.details);
    }
}

module.exports = { translateText, getSupportedLanguages }