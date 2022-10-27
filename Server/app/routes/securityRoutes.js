var config = require('../../config/config');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var _ = require('lodash');
var qs = require('querystring');
var moment = require('moment');
var mailer = require('../mailer/mailerServices');
var logger = require(global.appRoot + '/app/log');
var handler = require(global.appRoot + '/app/handler');

module.exports = (app, knex) => {

    // Server Static Pages
    app.get('/login', async (req, res) => {
        res.sendfile(global.baseDir + '/index.html');
    });

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/login Login
    * @apiName Login
    * @apiGroup Login
    *
    * @apiParam {String} username/email
    * @apiParam {String} password
    *
    * @apiSuccess {Object} Info of Token and success
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/login', handler.asyncFn(async (req, res, next) => {
        var user = await getApplicationUserbyUsernameorEmail(req.body.userName);
        if (user && user.isActive) {
            // check if password matches
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // if user is found and password is right create a token
                delete user.password;
                var token = await createJWT(user);
                res.send({ success: true, token: token, user: user });
            } else {
                res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        } else {
            res.send({ success: false, msg: 'Contact admin for activation.' });
        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/loginResponse Login
    * @apiName Login
    * @apiGroup Login
    *
    * @apiSuccess {url} Redirect
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.get('/loginResponse', (req, res) => {
        res.sendfile(global.baseDir + '/index.html');
    });


    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/forgotPassword Forgot Password
    * @apiName forgotPassword
    * @apiGroup Login
    *
    * @apiParam {String} email
    *
    * @apiSuccess {Object} Info of password reset mailed and success
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

     app.post('/api/forgotPassword', handler.asyncFn(async (req, res, next) => {
        let user = req.body;
        let randomPassword = Math.random().toString(36).substring(4);
        user.password = bcrypt.hashSync(randomPassword);
        user.generatedPassword = randomPassword;
        let results = await getApplicationUserbyUsernameorEmail(req.body.email);
        if (req.body.email == results.email) {
            let info = await mailer.passwordReset(user);
            if (user.generatedPassword) {
                let info = await updateApplicationUserByEmail(user);
                logger.info(info);
                res.send(true);
            } else {
                logger.error(err);
                throw new Error("Mailer Error");
            }
        } else {
            throw new Error("Email does not exist");
        }
    }));


    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/registerUser Register User
    * @apiName Registration
    * @apiGroup Login
    *
    * @apiParam {Object} User
    *
    * @apiSuccess {Object} Info of Inserted member
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/registerUser', handler.asyncFn(async (req, res, next) => {
        await addUserQuery(req.body)
            .then(result => {
                res.send(result);
            }).catch((err) => {
                if (err.code.indexOf('ER_DUP_ENTRY') >= 0 || err.stack.indexOf('UNIQUE') >= 0) {
                    if ((err.sqlMessage && err.sqlMessage.indexOf('username') >= 0) || (err.message && err.message.indexOf('username') >= 0)) {
                        throw new Error('Username already exist');
                    } else if ((err.sqlMessage && err.sqlMessage.indexOf('email') >= 0) || (err.message && err.message.indexOf('email') >= 0)) {
                        throw new Error('Email already exist');
                    } else {
                        throw new Error('User already exist');
                    }
                } else {
                    throw new Error('Server Error');
                }
            });
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getServiceConnectionByName Get Service Connection By Name
    * @apiName getServiceConnectionByName
    * @apiGroup External Services
    *
    * @apiParam {Object} serviceProviderName
    *
    * @apiSuccess {Object} Info of serviceProviderName
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.get('/api/getServiceConnectionByName', handler.asyncFn(async (req, res, next) => {
        var externalServiceConnections = JSON.parse(fs.readFileSync(global.baseDir + '/assets/externalServiceConnections.json', 'utf8'));
        var conn = _.find(externalServiceConnections, (conn) => {
            return conn.serviceProviderName == req.query.serviceProviderName;
        });
        if (!conn) {
            conn = {};
        }
        res.send(conn);
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getUserToken Get Service Connection By Name
    * @apiName getUserToken
    * @apiGroup External Services
    *
    * @apiParam {Object} serviceProviderName
    *
    * @apiSuccess {Object} Info of serviceProviderName
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getUserToken', async (req, res, next) => {
        var externalServiceConnections = JSON.parse(fs.readFileSync(global.baseDir + '/assets/externalServiceConnections.json', 'utf8'));

        var conn = _.find(externalServiceConnections, (c) => {
            return c.serviceProviderName == req.body.serviceProviderName;
        });
        if (!conn) { conn = {}; }
        _.each(conn.authParameters, (p) => {
            conn[p.key] = p.value;
        });
        var config = _.assign(conn, req.body);
        config.qs = qs;

        var optionJson = _.template(config.AccessTokenPath)(config);
        var atOptions = JSON.parse(optionJson);
        if (atOptions.params) {
            atOptions.qs = atOptions.params;
            delete atOptions.params;
        }
        if (atOptions.data) {
            atOptions.form = atOptions.data;
            delete atOptions.data;
        }

        var atUrl = atOptions.url;
        try {
            const response = fetch(atUrl, atOptions);
            config.body = await response.json();

            if ((response && response.statusCode && response.statusCode != 200) || !config.body) {
                res.end(500, "Server error");
                return;
            }
            if (config.AccessTokenReference && config.AccessTokenReference.length) {
                config.accessToken = _.template(config.AccessTokenReference)(config);
            }
            else {
                config.accessToken = null;
            }
            var user = null;
            if (config.isLogin) {
                if (config.ProfilePath && config.ProfilePath.length) {
                    var profileOptions = JSON.parse(_.template(config.ProfilePath)(config));
                    if (profileOptions.params) {
                        profileOptions.qs = profileOptions.params;
                        delete profileOptions.params;
                    }
                    if (profileOptions.data) {
                        profileOptions.form = profileOptions.data;
                        delete profileOptions.data;
                    }
                    const profileResponse = fetch(atUrl, atOptions);
                    var data = { profile: profileResponse.json() };
                    user = JSON.parse(_.template(config.LoginResponse)(data));
                    var searchResults = await getApplicationUserbyUsernameorEmail(user.userName);
                    if (searchResults.length > 0) {
                        knex('applicationusers')
                            .where('userName', user.userName)
                            .update({ firstName: user.firstName, lastName: user.lastName, displayName: user.displayName })
                            .then((updateResults, updateErr) => {
                                if (!updateErr) {
                                    user.token = config.accessToken;
                                    var token = createJWT(user);
                                    res.send({ success: true, token: token, user: user });
                                }
                            })
                            .catch((updateErr2) => {
                            });
                    } else {
                        knex('applicationusers').insert({
                            'userName': user.userName,
                            'firstName': user.firstName,
                            'lastName': user.lastName,
                            'email': user.userName,
                            'displayName': user.displayName
                        }).then((insertResults, insertErr) => {
                            if (!insertErr) {
                                user.token = config.accessToken;
                                var token = createJWT(user);
                                res.send({ success: true, token: token, user: user });
                            }
                        })
                            .catch((insertErr2) => {
                            });
                    }
                }
                else {
                    user = req.body;
                    user.token = config.accessToken;
                    var token = await createJWT(user);
                    res.send({ success: true, token: token, user: user });
                }
            }
            else {
                res.send({ success: true, token: config.accessToken, user: {} });
            }
        } catch (error) {
            res.end(500, "Server error");
            return;
        }
    });


    //Predefined methods
    const getApplicationUserbyUsernameorEmail = async (email) => {
        try {
            let user = await knex('applicationusers')
                .where('userName', email)
                .orWhere('email', email)
                .first();
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
        };
    };

    const updateApplicationUserByEmail = async (user) => {
        try {
            let userUpdate = knex('applicationusers')
                .where('email', user.email)
                .update({
                    password: user.password
                });
            return Promise.resolve(userUpdate);
        } catch (error) {
            return Promise.reject(error);
        };
    };

    const addUserQuery = async (user) => {
        try {
            user.password = bcrypt.hashSync(user.password);
            let results = knex('applicationusers')
                .insert({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    userName: user.userName,
                    isActive: user.isActive,
                    hasAddress: user.hasAddress,
                    displayName: user.displayName,
                    DocId: user.DocId,
                    originalProfilePicFileName: user.originalProfilePicFileName,
                    profilePicMimeType: user.profilePicMimeType
                }).returning('*');
            if (results && user.hasAddress) {
                let userAddressResults = knex('app_user_address')
                    .returning('*')
                    .insert({
                        usrId: results[0].userId ? results[0].userId : results[0],
                        addressline1: user.addressline1,
                        addressline2: user.addressline2,
                        country: user.country,
                        state: user.state,
                        city: user.city,
                        pincode: user.pincode,
                        created_at: new Date(),
                        createdBy: user.createdBy
                    });
                return Promise.resolve(userAddressResults);
            } else if (results) {
                return Promise.resolve(results);
            } else {
                return Promise.reject("Internal Server Error");
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const createJWT = (user) => {
        let extToken = null;
        if (user.token) {
            extToken = user.token;
            delete user.token;
        }
        user.password ? delete user.password : user.Password ? delete user.Password : null;
        let payload = {
            sub: user,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        if (extToken) { payload.token = extToken; }
        return jwt.encode(payload, config.secret);
    };

};
