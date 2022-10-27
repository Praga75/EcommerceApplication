const request = require('request');
const _ = require('lodash');
const xml2js = require('xml2js');
const fs = require('fs');
const commonServiceMethods = require('./commonServiceMethods');
const logger = require(global.appRoot + '/app/log');

module.exports = (app, knex, acl) => {
    this.processExternalService = (req, res, baseServiceName, url, data, requestContentType, responseContentType, serviceHeaders, httpMethod, callback) => {
        var allConnections = JSON.parse(fs.readFileSync(global.baseDir + '/assets/externalServiceConnections.json', 'utf8'));
        var serviceConnection = _.find(allConnections, (c) => {
            return c.serviceProviderName == baseServiceName;
        });
        if (!serviceConnection) {
            return;
        }
        getUserAppProperties(req, serviceConnection, url)
            .then(() => {
                var cleanUrl = url;
                if (url.indexOf('<%=') > -1) {
                    cleanUrl = _.template(url)(serviceConnection);
                }
                var options = {
                    method: httpMethod,
                    url: getServiceUrl(serviceConnection, cleanUrl),
                    headers: {}
                };

                if (serviceHeaders && serviceHeaders.length > 0) {
                    _.each(serviceHeaders, (h) => {
                        if (h.value.indexOf('<%=') > -1) {
                            options.headers[h.key] = _.template(h.value)(serviceConnection);
                        }
                        else {
                            options.headers[h.key] = h.value;
                        }
                    });
                }

                if (requestContentType) {
                    options.headers['Content-Type'] = requestContentType;
                }
                if (data && !(_.isEmpty(data))) {
                    options.form = data;
                }

                getServiceAuthentication(serviceConnection, options);

                request(options, cb)
                    .on('error', (err) => {
                        logger.error(err);
                    });


                cb = (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        try {
                            if (responseContentType.indexOf("xml") >= 0) {
                                xml2js.parseString(body, (err, result) => {
                                    res.send(result);
                                });
                            }
                            else if (responseContentType.indexOf("json") >= 0) {
                                res.send(JSON.parse(body));
                            }
                        }
                        catch (err) {
                            logger.error(err);
                            res.end(500, "Server error");
                        }
                    }
                    else {
                        logger.error(err);
                        res.end(500, "Server error");
                    }
                }
            }).catch((err) => { res.end(500, "Server error"); })
    };

    const getUserAppProperties = async (req, serviceConnection, url) => {
        if (!serviceConnection.appId) {
            cb(null);
            return;
        }
        var sql = `SELECT paramName,
                              paramValue
                       FROM userappparameters
                       Where appId = ` + serviceConnection.appId +
            `And userName = '` + req.user.userName + `'`;

        var query = knex.raw(sql);
        try {
            let results = await commonServiceMethods.getResultsNative(query, null, null);
            if (!serviceConnection.authParameters) {
                serviceConnection.authParameters = [];
            }
            _.each(results.results, (p) => {
                var ap = _.find(serviceConnection.authParameters, (ap2) => {
                    return ap2.key == p.paramName;
                });
                if (ap) {
                    ap.value = p.paramValue;
                }
                else {
                    serviceConnection.authParameters.push({
                        key: p.paramName,
                        value: p.paramValue
                    });
                }
            });
            return Promise.resolve();
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    };

    const getServiceUrl = (serviceConnection, url) => {
        var baseUrl = serviceConnection.serviceHost.endsWith('/') ? serviceConnection.serviceHost : serviceConnection.serviceHost;
        url = url.startsWith('/') ? url.substring(1) : url;
        return baseUrl + url;
    };

    const getServiceAuthentication = (serviceConnection, options) => {
        if (serviceConnection && serviceConnection.authHeaders.length > 0) {
            _.each(serviceConnection.authHeaders, (h) => {
                if (h.value.indexOf('<%=') > -1) {
                    options.headers[h.key] = _.template(h.value)(serviceConnection);
                }
                else {
                    options.headers[h.key] = h.value;
                }
            });
        }
        if (serviceConnection.authType == 'BasicAuth') {
            var user = '';
            var pwd = '';
            _.each(serviceConnection.authParameters, (p) => {
                if (p.key == 'userName') {
                    user = p.value;
                }
                if (p.key == 'password') {
                    pwd = p.value;
                }
            });
            options.headers['Authorization'] = 'Basic ' + Buffer.from(user + ':' + pwd).toString('base64');

        }
        else if (serviceConnection.authType == 'OAuth2') {
            options.headers['Authorization'] = 'Bearer ' + serviceConnection.token.access_token ? serviceConnection.token.access_token : serviceConnection.token;
            //options.headers['x-li-format'] = 'json';
        }
        else if (serviceConnection.ProvidesToken && serviceConnection.token) {
            options.headers['Authorization'] = 'Bearer ' + serviceConnection.token.access_token ? serviceConnection.token.access_token : serviceConnection.token;
            //options.headers['x-li-format'] = 'json';
        }
    };

    return this;
}

