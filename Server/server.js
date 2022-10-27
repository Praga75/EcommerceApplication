// Get dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var jwt = require('jwt-simple');
var compression = require('compression');
var helmet = require('helmet');
var cors = require('cors');
var moment = require('moment');
var fs = require('fs');
global.appRoot = path.resolve(__dirname);
var logger = require(global.appRoot + '/app/log');

// Get configs
var config = require('./config/config');
var db = require('./app/db');

// Get our API routes
var app = express();

//CORS and parser
app.use(cors());
app.use(cookieParser());
require('json.date-extensions');
JSON.useDateParser();

// compress all responses
app.use(compression());
app.disable('x-powered-by');
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// Parsers for POST data
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Point static path to dist || process.env.NODE_ENV == "development" ? "dist" : "dist";
var baseDirName = !process.env.NODE_ENV || process.env.NODE_ENV == "development" ? "dist" : "dist";
global.baseDir = path.resolve(__dirname + '/../Client/' + baseDirName);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../Client/dist/index.html'));
});


// app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(global.baseDir));

//setup login routes and check all other routes to make sure authenticated
require('./app/routes/securityRoutes.js')(app, db);
require('./app/routes/knexServicesNoAuth.js')(app, db);

// Login Required Middleware
var ensureAuthenticated = (req, res, next) => {
    try {
        var apiReqUrl, apiReqIp, apiReqParams, logMsg = '';
        var token, payload = null;
        try {
            var settings = JSON.parse(fs.readFileSync(global.baseDir + '/assets/settings.json', 'utf8'));
        } catch (error) {
            console.log("Default settings are used in the absence of a settings file.");
            var settings = {
                "authProviderLocal": false,
                "authProvider": "Dew",
                "loginScreenProvider": "Dew",
                "useAuthentication": true,
                "useDocuments": true,
                "useCodeTables": true,
                "useDewAuthorization": true,
                "useTag": true,
                "layoutStyle": "horizontal-navigation",
                "themeSettings": {
                    "primary": "blue",
                    "accent": "pink",
                    "warn": "red",
                    "background": "grey",
                    "isDark": false
                },
                "projectName": "test",
                "hasMailer": false,
                "hasFCM": false,
                "hasMessaging": false,
                "dbType": "mssql",
                "mailerType": "office365"
            }
        }

        // for logging
        if (req.connection || req.socket) {
            apiReqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        }
        apiReqUrl = req.originalUrl;
        apiReqParams = req.body || req.params || req.query;
        logMsg = "IP: " + apiReqIp + "| URL: " + apiReqUrl + " | Params: " + JSON.stringify(apiReqParams) + "| Method: " + req.method;
        // for logging ends

        if (settings.useDewAuthorization && settings.authProvider == 'NOLOGIN') {
            next();
        } else {
            if (req.query.token) {
                token = req.query.token;
            } else if (req.header('Authorization')) {
                token = req.header('Authorization');
            } else if (req.cookies && req.cookies['Authorization']) {
                token = req.cookies['Authorization'];
            } else if (req.headers && req.headers.cookie && req.headers.cookie.indexOf('Authorization') > -1) {
                var authCookieIndex = req.headers.cookie.indexOf('Authorization');
                if (authCookieIndex >= 0) {
                    var startIndex = req.headers.cookie.indexOf('=', authCookieIndex);
                    if (startIndex > 0) {
                        var endIndex = req.headers.cookie.indexOf(';', startIndex);
                        if (endIndex > 0) {
                            token = req.headers.cookie.substring(startIndex + 1, endIndex);
                        } else {
                            token = req.headers.cookie.substring(startIndex + 1);
                        }
                    }
                }
            } else {
                return res.status(401).send({
                    message: 'Not Authenticated'
                });
            }
            try {
                payload = jwt.decode(token, config.secret);
                if (payload.exp <= moment().unix()) {
                    return res.status(401).send({
                        message: 'Token has expired'
                    });
                }
                if (payload.token) {
                    payload.sub.token = payload.token;
                }
            } catch (err) {
                return res.status(401).send({
                    message: err.message
                });
            }
            //Assign req object with user and token
            req.token = token;
            req.user = payload.sub || {};
            logger.info("User: " + req.user.email + " " + logMsg);
            next();
        }
    } catch (ex) {
        console.log(ex);
    }
};

app.use((req, res, next) => {
    ensureAuthenticated(req, res, next);
});

//Error Handler
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    // res.render('error', { error: err })
    res.json({
        status: err.status || 500,
        message: err.message,
        stack: err.stack
    })
}

//Log Error
const logErrors = (err, req, res, next) => {
    // console.error('Error status: ', err.status);
    // console.error('Message: ', err.message);
    // console.error(err.stack);
    logger.error('Error status: ', err.status);
    logger.error('Message: ', err.message);
    logger.error(err.stack);
    next(err)
}


try {
    var knexAcl = require('./app/routes/acl-knex-backend');
    var knexBackend = new knexAcl(db);
} catch (error) {
    console.error(error);
}


(async () => {
    try {
        await knexBackend.setup();
        var acl = require('acl');
        acl = new acl(knexBackend);
        require('./config/aclMiddleware')(acl);
        require('./app/routes/routes')(app, acl); // pass our application into our routes
        require('./app/routes/mainServices.js')(app, db, acl, knexBackend); // pass our main services into our routes
        require('./app/routes/knexServices.js')(app, db, acl); // pass our knex services into our routes

        // Catch all other routes and return the index file
        app.get('/*', (req, res) => {
            res.sendFile(path.join(__dirname, '/../Client/dist/index.html'));
        });
        app.use(logErrors);
        app.use(errorHandler);
        // Get port from environment and store in Express.
        var port = process.env.PORT || '8080';
        app.set('port', port);
        app.listen(app.get('port'), () => {
            console.log('Express server listening on port ' + app.get('port'));
        }).on('error', (err) => { console.log("Server Connection Error", err); });
    }
    catch (error) {
        console.log("Error", error)
    }
})();


