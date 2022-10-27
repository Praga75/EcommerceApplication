const fs = require('fs');
const fsPromises = fs.promises;
const puppeteer = require('puppeteer');
const config = require(global.appRoot + '/config/config');
const logger = require(global.appRoot + '/app/log');
const _ = require('lodash');
const jsonexport = require('jsonexport');

//To export/create PDF
const createPDF = async (templateHTML) => {
    // Finalized Callback
    let pdfOptions = {
        landscape: false,
        footerTemplate: "<div style=\"font-size: 12px!important; margin: 5px 0; clear:both; position: relative; color: 222!important;  text-align:center; width: 100%; \" class=\"footer\"><span>Page: </span><span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span>    </div > ",
        displayHeaderFooter: true,
        printBackground: false,
        scale: 1,
        margin: {
            top: '1in',
            bottom: '1in',
            right: '0.5in',
            left: '0.5in'
        },
        pageRanges: ''
    }
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(`data:text/html,${templateHTML}`, { timeout: 120000 });
        const buffer = await page.pdf(pdfOptions);
        await browser.close();
        return Promise.resolve(buffer);
    }
    catch (err) {
        logger.error('Chrome launcher error: ' + err);
        Promise.reject(err);
    }
}

//To export/create CSV
const createCSV = (arraylist) => {
    try {
        jsonexport(arraylist, (err, csv) => {
            if (err) {
                logger.error('createCSV error: ' + err);
                return Promise.reject(err);
            } else {
                return Promise.resolve(csv);
            }
        });
    }
    catch (err) {
        logger.error('createCSV error: ' + err);
        return Promise.reject(err);
    }
}

const storeFileLocally = async (filename, extention, path, buffer) => {
    try {
        let filenamewithExtention = filename + '.' + extention;
        let fileexist = await fsPromises.access(config.uploads + '/' + path + '/' + filenamewithExtention);
        if (fileexist) {
            let data = await fsPromises.readFile(config.uploads + '/' + path + '/' + filenamewithExtention, 'binary');
            return Promise.resolve(Buffer.from(data));
        } else {
            let pathexist = await fsPromises.access(config.uploads + '/' + path);
            if (!pathexist) { fs.mkdirSync(config.uploads + '/' + path); }
            let bufferWritten = await fsPromises.writeFile(config.uploads + '/' + path + '/' + filenamewithExtention, buffer);
            return Promise.resolve(Buffer.from(bufferWritten));
        }
    } catch (err) {
        return Promise.reject(err);
    }
};

//Download Report PDF
const downloadReport = async (pdfDetails) => {
    try {
        const templatePath = global.appRoot + "/app/reports/templates/downloadReport.template";
        const baseTemplate = fs.readFileSync(templatePath, 'utf8');
        const templateFn = _.template(baseTemplate);
        const templateHTML = templateFn({ pdfDetails: pdfDetails });
        const buffer = await createPDF(templateHTML);
        let writebuffer = await storeFileLocally(pdfDetails.name, 'pdf', 'pdf', buffer);
        return Promise.resolve(buffer);
    } catch (err) {
        return Promise.reject(err)
    }
};


//Export CSV's
const downloadCSV = async (array) => {
    try {
        let csvDetails = array;
        let saveDate;
        saveDate = new Date();
        saveDate = saveDate.getFullYear() + '-' + (saveDate.getMonth() + 1) + '-' + saveDate.getDate();
        let csv = await createCSV(csvDetails);
        let buffer = await storeFileLocally(saveDate, 'csv', 'csv', csv);
        return Promise.resolve(buffer);
    }
    catch (err) {
        return Promise.reject(err)
    }
};

module.exports = { downloadReport, downloadCSV }