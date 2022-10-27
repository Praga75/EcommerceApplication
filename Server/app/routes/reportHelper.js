var puppeteer = require('puppeteer');
var logger = require(global.appRoot + '/app/log');

module.exports = {
    getReport: async (req, res, reportSettings) => {
        if (req.query.isReport) {
            res.sendfile(global.baseDir + '/report.html');
        } else if (req.query.reportFormat) {
            this.getReportBuffer(req, reportSettings).then((buffer) => {
                res.contentType("application/pdf");
                res.send(buffer);
            }).catch(err => {
                logger.error('getReport: ' + err);
                res.contentType("text/html");
                res.status(500).send(err);
            })
        }
    },

    getReportBuffer: async (req, reportSettings) => {
        var settings = this.getReportArgs(req, reportSettings);
        try {
            const browser = await puppeteer.launch({ headless: true });
            const url = settings.targetUrl;
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
            const buffer = await page.pdf(settings.printSettings);
            await browser.close();
            return Promise.resolve(buffer);
        }
        catch (err) {
            logger.error('Chrome launcher error: ' + err);
            Promise.reject(err);
        };
    },

    getReportArgs: async (req, reportSettings) => {
        var settings = reportSettings;
        if (!settings) {
            settings = {};
            reportSettings = {};
        }
        settings.printSettings = {
            landscape: reportSettings.landscape || false,
            footerTemplate: "<div style=\"font-size: 12px!important; margin: 5px 0; clear:both; position: relative; color: 222!important;  text-align:center; width: 100%; \" class=\"footer\"><span>Page: </span><span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span>    </div > ",
            displayHeaderFooter: true,
            printBackground: reportSettings.printBackground || false,
            scale: reportSettings.scale || 1,
            margin: {
                top: '1in',
                bottom: '1in',
                right: '0.5in',
                left: '0.5in'
            },
            pageRanges: reportSettings.pageRanges || ''
        }
        settings.userName = req.user && req.user.userName ? req.user.userName : "";
        var targetUrl = "";
        if (req.customTargetUrl) {
            targetUrl = req.customTargetUrl + '&isReport=yes';;
        } else {
            targetUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '&isReport=yes'; //open the non-pdf page and convert it
        }

        if (req.token) {
            targetUrl += '&token=' + req.token;
        }
        if (req.user) {
            targetUrl += '&userName=' + req.user.userName;
        }

        if (req.method && req.method != 'GET') {
            targetUrl += '&postData=' + encodeURIComponent(JSON.stringify(req.body));
        }
        settings.targetUrl = targetUrl;
        var currentDate = new Date();
        settings.fileName = './temp/' + (currentDate.getTime() * 10000).toString() + '.pdf';
        return settings;
    }
};