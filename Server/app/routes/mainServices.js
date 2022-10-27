const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const multer = require('multer');
const upload = multer({ dest: './tmp/' });
const storageProvider = require('../storage/storageProvider');
const fs = require('fs');
const request = require('request');
const qs = require('querystring');
const config = require('../../config/config');
const mailer = require('../mailer/mailerServices');
const notify = require('../notifications/notificationService');
const logger = require(global.appRoot + '/app/log');
const commonServiceMethods = require('./commonServiceMethods');
const handler = require(global.appRoot + '/app/handler');

module.exports = (app, knex, acl, knexBackend) => {

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getExternalServiceConnections get External Service Connections
    * @apiName getExternalServiceConnections
    * @apiGroup ExternalService
    *
    * @apiSuccess {Object} Info of External Service Connections
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.get('/api/getExternalServiceConnections', handler.asyncFn(async (req, res, next) => {
        let externalServiceConnections = JSON.parse(fs.readFileSync(global.baseDir + '/assets/externalServiceConnections.json', 'utf8'));
        res.send(externalServiceConnections);
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/saveExternalServiceConnection Save External Service Connection
    * @apiName saveExternalServiceConnection
    * @apiGroup ExternalService
    *
    * @apiSuccess {Object} Info of saved External Service Connection
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */


    app.post('/api/saveExternalServiceConnection', handler.asyncFn(async (req, res, next) => {
        let connections = JSON.parse(fs.readFileSync(global.baseDir + '/assets/externalServiceConnections.json', 'utf8'));
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].serviceProviderName == req.body.serviceProviderName) {
                connections.splice(i, 1);
                break;
            }
        }
        let externalServiceConnectionFile = global.baseDir + '/assets/externalServiceConnections.json';
        fs.writeFile(externalServiceConnectionFile, JSON.stringify(connections), (err) => {
            if (err) {
                throw new Error("Server error");
            } else {
                res.send(200, "ok");
            }
        });
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/saveExternalServiceConnections Save External Service Connections
    * @apiName saveExternalServiceConnections
    * @apiGroup ExternalService
    *
    * @apiSuccess {Object} Info of saved External Service Connections
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/saveExternalServiceConnections', handler.asyncFn(async (req, res, next) => {
        let externalServiceConnectionFile = global.baseDir + '/assets/externalServiceConnections.json';
        fs.writeFile(externalServiceConnectionFile, JSON.stringify(req.body), (err) => {
            if (err) {
                throw new Error("Save External Service Connections Server error");
            } else {
                res.send(req.body);
            }
        });
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/uploadDewDocFile upload Dew Document File
    * @apiName uploadDewDocFile
    * @apiGroup DewDoc
    *
    * @apiSuccess {Object} Info of upload Dew Document File
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post("/api/uploadDewDocFile", upload.single("file"), handler.asyncFn(async (req, res, next) => {
        if (req.file) {
            try {
                let fileUpload = await storageProvider.uploadFile(req.file);
                if (req.body) {
                    let docs = {
                        ModuleName: "Documents",
                        Name: req.file.originalname,
                        Description: "",
                        FileName: req.file.filename,
                        OriginalFileName: req.file.originalname,
                        MimeType: req.file.mimetype,
                        isDewDoc: req.body.isDewDoc,
                        DewDocs: false
                    };
                    let results = await insertDocumentQuery(docs);
                    res.send(JSON.stringify(results));
                } else {
                    res.send({
                        mimeType: req.file.mimetype,
                        originalFileName: req.file.originalname,
                        remoteFileName: req.file.filename
                    });
                }
            } catch (error) {
                throw new Error("Server error");
            }

        } else {
            throw new Error("File Upload error");
        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/uploadFile upload File
    * @apiName uploadFile
    * @apiGroup Uploads
    *
    * @apiSuccess {Object} Info of upload File
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/uploadFile', upload.single('file'), handler.asyncFn(async (req, res, next) => {
        if (req.file) {
            try {
                let fileUpload = await storageProvider.uploadFile(req.file);
                if (req.body && req.body.isDewDoc) {
                    let docs = {
                        ModuleName: 'Documents',
                        Name: req.file.originalname,
                        Description: '',
                        FileName: req.file.filename,
                        OriginalFileName: req.file.originalname,
                        MimeType: req.file.mimetype,
                        isDewDoc: req.body.isDewDoc,
                        DewDocs: false
                    }
                    let results = await insertDocumentQuery(docs);
                    res.send(JSON.stringify(results));
                } else {
                    res.send({
                        mimeType: req.file.mimetype,
                        originalFileName: req.file.originalname,
                        remoteFileName: req.file.filename
                    });
                }
            } catch (error) {
                throw new Error("Server error");
            }
        } else {
            throw new Error("File Upload error");
        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/uploadCameraImage upload File
    * @apiName uploadCameraImage
    * @apiGroup Uploads
    *
    * @apiSuccess {Object} Info of upload Camera Image
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/uploadCameraImage', upload.single('file'), handler.asyncFn(async (req, res, next) => {
        try {
            let imagename = await storageProvider.uploadCameraImage(req.body);
            let imgname = { 'FileName': imagename };
            await insertImageQuery(imgname);
            res.send({
                imagename: imagename
            });
        } catch (err) {
            res.writeHead(500, 'Server error in uploadCameraImage route' + err);
            res.end();
        }
    }));

    const insertImageQuery = async (dew_Images) => {
        let inserCollection = [];
        inserCollection.push(dew_Images);
        try {
            let results = await knex('dew_Images')
                .insert(inserCollection);
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };


    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getImage Get Image
    * @apiName getImage
    * @apiGroup Uploads
    *
    * @apiSuccess {Object} Info of Get Image
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getImage', handler.asyncFn(async (req, res, next) => {
        let imagename = req.body.imagename;
        let results = await getImageQuery(imagename);
        res.send({
            imagename: results[0].FileName,
            imgid: results[0].ImageId
        });
    }));

    const getImageQuery = async (FileName) => {
        let query = knex('dew_Images');
        let isWherAlreadyAdded = true;
        query.where(function () {
            this.where('FileName', '=', FileName)
        });
        try {
            let results = await query;
            let resObj = { results: results };
            return Promise.resolve(resObj);
        } catch (error) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteAppUser Delete App User
    * @apiName deleteAppUser
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Delete App User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteAppUser', handler.asyncFn(async (req, res, next) => {
        try {
            let user = req.body;
            let results = await knex('applicationusers')
                .where('userId', user.userId)
                .transacting(null)
                .del();
            res.send({
                results: results
            });
        } catch (error) {
            throw new Error("Server Error." + error);
        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/downloadFile Download File
    * @apiName downloadFile
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Download File
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.get('/api/downloadFile', handler.asyncFn(async (req, res, next) => {
        let docId = req.query.DocId ? req.query.DocId : null;
        let fileName = req.query.FileName ? req.query.FileName : null;
        let value = docId ? docId : (fileName ? fileName : null);
        let field = docId ? 'DocId' : (fileName ? 'FileName' : 'DocId');
        if (value && value.length > 0) {
            try {
                let docs = await knex('dew_docs').where(field, "=", value);
                if (docs && docs.length > 0) {
                    if (docs[0].MimeType && docs[0].MimeType.length > 0) {
                        res.header('Content-Type', docs[0].MimeType);
                    }
                    else {
                        res.header('Content-Type', 'application/octet-stream');
                    }
                    if (docs[0].OriginalFileName && docs[0].OriginalFileName.length > 0) {
                        res.header('Content-disposition', 'attachment; filename=' + docs[0].OriginalFileName);
                    }
                    storageProvider.downloadFile(req, res, docs[0].FileName);
                }
                else {
                    throw new Error("Document not found.");
                }
            } catch (error) {
                throw new Error("Document Error." + error);
            }
        } else { throw new Error("Invalid Request."); }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/downloadProfilePic Download Profile File
    * @apiName downloadFile
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Profile File
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.get('/api/downloadProfilePic', handler.asyncFn(async (req, res, next) => {
        let docId = req.query.DocId ? req.query.DocId : null;
        let fileName = req.query.FileName ? req.query.FileName : null;
        let value = docId ? docId : (fileName ? fileName : null);
        let field = docId ? 'DocId' : (fileName ? 'FileName' : 'DocId');
        if (value && value.length > 0) {
            try {
                let docs = await knex('applicationusers').where(field, "=", value);
                if (docs && docs.length > 0) {
                    if (docs[0].profilePicMimeType && docs[0].profilePicMimeType.length > 0) {
                        res.header('Content-Type', docs[0].profilePicMimeType);
                    }
                    else {
                        res.header('Content-Type', 'application/octet-stream');
                    }
                    if (docs[0].originalProfilePicFileName && docs[0].originalProfilePicFileName.length > 0) {
                        res.header('Content-disposition', 'attachment; filename=' + docs[0].originalProfilePicFileName);
                    }
                    storageProvider.downloadFile(req, res, docs[0].DocId);
                }
                else {
                    throw new Error("Image not found.");
                }
            } catch (error) {
                throw new Error("Document Error." + error);
            }
        } else { res.end(400, "Invalid Request."); }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getPermissions Get Permissions
    * @apiName getPermissions
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Permissions
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getPermissions', async (req, res, next) => {
        acl.userRoles(req.user.userName, async (err, roles) => {
            if (!err) {
                let auths = [];
                let results = await knexBackend.getPermissionsByRole(roles);
                _.each(results, (result) => {
                    auths.push(result.BucketName.substring(7) + '::' + result.Value);
                });
                res.send(auths);
            }
            else {
                res.end(500, "Server error");
            }
        });
    });

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getUsers Get Users
    * @apiName getUsers
    * @apiGroup AppUser
    *
    * @apiSuccess {Array} Info of Users
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getUsers', handler.asyncFn(async (req, res, next) => {
        let results = await getUsersQuery(req.body.gridProperties);
        res.send(results);
    }));

    const getUsersQuery = async (gridProperties) => {
        let query = knex('applicationusers')
            .whereNot('email', 'dewadmin@gdkn.com')
            .leftOuterJoin('app_user_address', function () {
                this
                    .on('applicationusers.userId', 'app_user_address.usrId')
            });

        let isWherAlreadyAdded = false;
        let queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getUser Get User
    * @apiName getUser
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getUser', handler.asyncFn(async (req, res, next) => {
        let results = await getUserQuery(req.body);
        res.send(results);
    }));


    const getUserQuery = async (user) => {
        let query = knex('applicationusers')
            .where('userId', user.userId)
            .first()
            .leftOuterJoin('app_user_address', function () {
                this.on('applicationusers.userId', 'app_user_address.usrId')
            });
        try {
            let results = await query;
            let resObj = { results: results };
            return Promise.resolve(resObj);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getApplicationUserbyUserName Get Application User by UserName
    * @apiName getApplicationUserbyUserName
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getApplicationUserbyUserName', handler.asyncFn(async (req, res, next) => {
        let results = await getApplicationUserbyUserNameQuery(req.body);
        res.send(JSON.stringify(results));
    }));

    const getApplicationUserbyUserNameQuery = async (user) => {
        try {
            let users = await knex('applicationusers')
                .where('userName', user.username);
            return Promise.resolve(users);
        } catch (error) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getApplicationUserbyEmail Get Application User by Email
    * @apiName getApplicationUserbyEmail
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getApplicationUserbyEmail', handler.asyncFn(async (req, res, next) => {
        let results = await getApplicationUserbyEmailQuery(req.body);
        res.send(JSON.stringify(results));
    }));

    const getApplicationUserbyEmailQuery = async (users) => {
        try {
            let ObtainedUser = await knex('applicationusers')
                .where('email', users.email);
            return Promise.resolve(ObtainedUser);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/changepassword Change Password
    * @apiName changepassword
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/changepassword', handler.asyncFn(async (req, res, next) => {
        let result = await changepasswordQuery(req.body);
        res.send(result);
    }));

    const changepasswordQuery = async (users) => {
        try {
            users.password = bcrypt.hashSync(users.newpassword);
            let user = await knex('applicationusers')
                .where('userId', users.userId)
                .first();
            if (user && bcrypt.compareSync(users.oldpassword, user.password)) {
                users.password = bcrypt.hashSync(users.newpassword);
                let results = await knex('applicationusers')
                    .where('userId', users.userId)
                    .update({ password: users.password });
                return Promise.resolve(JSON.stringify(results));
            } else {
                return Promise.reject('Authentication failed.');
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteUser Delete User
    * @apiName deleteUser
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteUser', handler.asyncFn(async (req, res, next) => {
        let result = await deleteUserQuery(req.body);
        res.send(result);
    }));

    const deleteUserQuery = async (users) => {
        try {
            let results = await knex('app_user_address')
                .where('usrId', users.userId)
                .del();
            let applicationusersresults = await knex('applicationusers')
                .where('userId', users.userId)
                .del();
            return Promise.resolve(JSON.stringify(applicationusersresults));
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/updateUser Update User
    * @apiName updateUser
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Updated User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/updateUser', handler.asyncFn(async (req, res, next) => {
        try {
            let result = await updateUserQuery(req.body);
            res.send(result);
        } catch (err) {
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
        }
    }));

    const updateUserQuery = async (users) => {
        try {
            let results = await knex('applicationusers')
                .where('userId', users.userId)
                .update({
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    isActive: users.isActive,
                    hasAddress: users.hasAddress,
                    displayName: users.displayName,
                    DocId: users.DocId,
                    originalProfilePicFileName: users.originalProfilePicFileName,
                    profilePicMimeType: users.profilePicMimeType
                });
            if (users.hasAddress && !users.addressId) {
                let results = await knex('app_user_address')
                    .insert({
                        usrId: users.userId,
                        addressline1: users.addressline1,
                        addressline2: users.addressline2,
                        country: users.country,
                        state: users.state,
                        city: users.city,
                        pincode: users.pincode,
                        created_at: new Date(),
                        createdBy: users.createdBy
                    })
                return Promise.resolve(JSON.stringify(results));
            } else if (users.hasAddress && users.addressId) {
                let results = await knex('app_user_address')
                    .where('usrId', users.userId)
                    .update({
                        addressline1: users.addressline1,
                        addressline2: users.addressline2,
                        country: users.country,
                        state: users.state,
                        city: users.city,
                        pincode: users.pincode,
                        updated_at: new Date()
                    });
                return Promise.resolve(JSON.stringify(results));
            } else if (!users.hasAddress && users.addressId) {
                let results = await knex('app_user_address')
                    .where('usrId', users.userId)
                    .del();
                return Promise.resolve(JSON.stringify(results));
            } else {
                return Promise.resolve(JSON.stringify(results));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/addUser Add User
    * @apiName addUser
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of added User
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/addUser', handler.asyncFn(async (req, res, next) => {
        try {
            let result = await addUserQuery(req.body);
            res.send(result);
        } catch (err) {
            if (err && err.code && err.code.indexOf('ER_DUP_ENTRY') >= 0 || err.stack.indexOf('UNIQUE') >= 0) {
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
        }
    }));

    const addUserQuery = async (users) => {
        try {
            users.password = bcrypt.hashSync(users.password);
            let results = await knex('applicationusers')
                .insert({
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    password: users.password,
                    userName: users.userName,
                    isActive: users.isActive,
                    hasAddress: users.hasAddress,
                    displayName: users.displayName,
                    DocId: users.DocId,
                    originalProfilePicFileName: users.originalProfilePicFileName,
                    profilePicMimeType: users.profilePicMimeType
                })
                .returning('*');
            if (users.hasAddress) {
                let app_user_address_results = await knex('app_user_address')
                    .returning('*')
                    .insert({
                        usrId: results[0].userId ? results[0].userId : results[0],
                        addressline1: users.addressline1,
                        addressline2: users.addressline2,
                        country: users.country,
                        state: users.state,
                        city: users.city,
                        pincode: users.pincode,
                        created_at: new Date(),
                        createdBy: users.createdBy
                    })
                return Promise.resolve(JSON.stringify(app_user_address_results));
            } else {
                return Promise.resolve(JSON.stringify(results));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertUserRole Add User Role
    * @apiName insertUserRole
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of added User Role
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertUserRole', async (req, res, next) => {
        let userrole = req.body;
        acl.removeUserRoles(userrole.userName, userrole.existingRoles, (err) => {
            if (!err) {
                acl.addUserRoles(userrole.userName, userrole.roles, (err) => {
                    if (!err) {
                        res.writeHead(200);
                        res.end();
                    }
                    else {
                        res.end(500, "Server error");
                    }
                });
            }
            else {
                res.end(500, "Server error");
            }
        });
    });

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteUserRole Delete User Role
    * @apiName deleteUserRole
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of deleted User Role
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteUserRole', async (req, res, next) => {
        let userrole = req.body;
        acl.removeUserRoles(userrole.userName, userrole.RoleName, (err) => {
            if (!err) {
                res.writeHead(200);
                res.end();
            }
            else {
                res.end(500, "Server error");
            }
        });
    });

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getUserRoles Get User Role
    * @apiName getUserRoles
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of User Role
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */


    app.get('/api/getUserRoles', async (req, res, next) => {
        acl.userRoles(req.query.userName, (err, results) => {
            let roles = [];
            _.each(results, (role) => {
                roles.push({ userName: req.query.userName, RoleName: role });
            });
            res.send(roles);
        });
    });

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getRoles Get Roles
    * @apiName getRoles
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Roles
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getRoles', handler.asyncFn(async (req, res, next) => {
        try {
            let results = await knexBackend.getBucketValues('meta', 'roles');
            let roles = [];
            _.each(results, (role) => {
                roles.push({ RoleName: role });
            });
            res.send(roles);
        } catch (error) {
            throw new Error("Server error");

        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getRoleDetails Get Roles
    * @apiName getRoleDetails
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Role Details
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getRoleDetails', handler.asyncFn(async (req, res, next) => {
        try {
            let parents = await knexBackend.getBucketValues('parents', req.body.RoleName);
            let role = { RoleName: req.body.RoleName, RoleParents: parents, Permissions: [] };
            let results = await knexBackend.getPermissionsByRole(role.RoleName);
            _.each(results, (result) => {
                role.Permissions.push({
                    RoleName: result.Key,
                    EntityName: result.BucketName.substring(7),
                    OperationName: result.Value
                });
            });
            res.send(role);
        } catch (error) {
            throw new Error("Server Error");
        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/updateRoles Update Roles
    * @apiName updateRoles
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of updated Role Details
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/updateRoles', async (req, res, next) => {
        updateRolesQuery(req, res, next, req.body);
    });

    const updateRolesQuery = (req, res, next, role) => {
        let roleParents = role.RoleParents ? role.RoleParents : [];
        acl.removeRoleParents(role.OldRoleName, (err) => {
            if (!err) {
                acl.addRoleParents(role.RoleName, roleParents, (err) => {
                    if (!err) {
                        res.writeHead(200);
                        res.end();
                    }
                    else {
                        res.end(500, "Server error");
                    }
                });
            }
            else {
                res.end(500, "Server error");
            }
        });
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertRoles Insert Roles
    * @apiName insertRoles
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Inserted Role Details
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertRoles', async (req, res, next) => {
        insertRolesQuery(req, res, next, req.body);
    });

    const insertRolesQuery = async (req, res, next, role) => {
        let roleParents = role.RoleParents ? role.RoleParents : [];
        acl.addRoleParents(role.RoleName, roleParents, (err) => {
            if (!err) {
                res.writeHead(200);
                res.end();
            }
            else {
                res.end(500, "Server error");
            }
        });
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteRole Delete Roles
    * @apiName deleteRole
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Deleted Role Details
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteRole', (req, res, next) => {
        deleteRoleQuery(req, res, next, req.body);
    });

    const removeRoleUsers = async (roleName, cb) => {
        let currentIndex = -1;
        let users = [];
        let processNext = () => {
            currentIndex++;
            if (currentIndex < users.length) {
                acl.removeUserRoles(users[currentIndex], roleName, (err) => {
                    if (err) {
                        cb(err);
                    }
                    else {
                        processNext();
                    }
                });
            }
            else {
                cb();
            }
        };

        acl.roleUsers(roleName, (err, results) => {
            users = results;
            processNext();
        });
    };

    const deleteRoleQuery = async (req, res, next, role) => {
        removeRoleUsers(role.RoleName, (err) => {
            if (!err) {
                acl.removeRole(role.RoleName, (err) => {
                    if (!err) {
                        res.writeHead(200);
                        res.end();
                    }
                    else {
                        res.end(500, "Server error");
                    }
                });
            }
            else {
                res.end(500, "Server error");
            }
        });
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getRoleEntityOperations Role Entity Operations
    * @apiName getRoleEntityOperations
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Role Entity Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getRoleEntityOperations', handler.asyncFn(async (req, res, next) => {
        try {
            let results = await knexBackend.getPermissionsByRole(req.query.roleName);
            let permissions = [];
            _.each(results, (result) => {
                permissions.push({
                    RoleName: result.Key,
                    EntityName: result.BucketName.substring(7),
                    OperationName: result.Value
                });
            });
            res.send(permissions);
        } catch (error) {
            throw new Error("Server error");
        }
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertRoleEntityOperation Insert Role Entity Operations
    * @apiName insertRoleEntityOperation
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Role Entity Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertRoleEntityOperation', async (req, res, next) => {
        insertRoleEntityOperationQuery(req, res, next, req.body);
    });

    const insertRoleEntityOperationQuery = async (req, res, next, roleoperations) => {
        acl.allow(roleoperations.RoleName, [roleoperations.EntityName], [roleoperations.OperationName], (err) => {
            if (!err) {
                res.writeHead(200);
                res.end();
            }
            else {
                res.end(500, "Server error");
            }
        });
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteRoleEntityOperation Delete Role Entity Operations
    * @apiName deleteRoleEntityOperation
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Role Entity Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteRoleEntityOperation', (req, res, next) => {
        deleteRoleEntityOperationQuery(req, res, next, req.body);
    });

    const deleteRoleEntityOperationQuery = (req, res, next, roleoperations) => {
        acl.removeAllow(roleoperations.RoleName, [roleoperations.EntityName], [roleoperations.OperationName], (err) => {
            if (!err) {
                res.writeHead(200);
                res.end();
            }
            else {
                res.end(500, "Server error");
            }
        });
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getOperations Get Operations
    * @apiName getOperations
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getOperations', handler.asyncFn(async (req, res, next) => {
        let results = await getOperationsQuery(req.body.gridProperties);
        res.send(results);
    }));

    const getOperationsQuery = async (gridProperties) => {
        let query = knex('securityoperations');
        let isWherAlreadyAdded = false;
        let queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertOperations Insert Operations
    * @apiName insertOperations
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertOperations', handler.asyncFn(async (req, res, next) => {
        let results = insertOperationsQuery(req.body);
        res.send(results);
    }));

    const insertOperationsQuery = async (securityoperations) => {
        let inserCollection = [];
        inserCollection.push(securityoperations);
        try {
            let results = await knex('securityoperations')
                .insert(inserCollection);
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/updateOperations Update Operations
    * @apiName updateOperations
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/updateOperations', handler.asyncFn(async (req, res, next) => {
        let result = await updateOperationsQuery(req.body);
        res.send(JSON.stringify(result));
    }));

    const updateOperationsQuery = async (securityoperations) => {
        let isUpdate = securityoperations.OperationName;
        if (isUpdate) {
            try {
                let results = await knex('securityoperations')
                    .where('OperationName', securityoperations.OperationName)
                    .update({ Description: securityoperations.Description })
                return Promise.resolve(JSON.stringify(results));
            } catch (error) {
                return Promise.reject(error);
            }
        }
        else {
            try {
                let results = await knex('securityoperations')
                    .insert({
                        Description: securityoperations.Description,
                        OperationName: securityoperations.OperationName
                    });
                return Promise.resolve(JSON.stringify(results));
            } catch (error) {
                return Promise.reject(error);
            }
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteOperations Delete Operations
    * @apiName deleteOperations
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Delete Operations
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteOperations', handler.asyncFn(async (req, res, next) => {
        let result = await deleteOperationsQuery(req.body);
        res.send(JSON.stringify(result));
    }));

    const deleteOperationsQuery = async (securityoperations) => {
        try {
            let results = await knex('securityoperations')
                .where('OperationName', securityoperations.OperationName)
                .del();
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getSecurityEntities Get Security Entities
    * @apiName getSecurityEntities
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Security Entities
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getSecurityEntities', handler.asyncFn(async (req, res, next) => {
        let results = await getSecurityEntitiesQuery(req.body.gridProperties);
        res.send(results);
    }));

    const getSecurityEntitiesQuery = async (gridProperties) => {
        let query = knex('securityentities');
        let isWherAlreadyAdded = false;
        let queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertSecurityEntity Insert Security Entities
    * @apiName insertSecurityEntity
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Security Entities
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertSecurityEntity', handler.asyncFn(async (req, res, next) => {
        let results = await insertSecurityEntityQuery(req.body);
        res.send(results);
    }));

    const insertSecurityEntityQuery = async (securityentities) => {
        let inserCollection = [];
        inserCollection.push(securityentities);
        try {
            let results = await knex('securityentities')
                .insert(inserCollection);
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }

    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/updateSecurityEntity Update Security Entities
    * @apiName updateSecurityEntity
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Security Entities
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/updateSecurityEntity', handler.asyncFn(async (req, res, next) => {
        let result = await updateSecurityEntityQuery(req.body);
        res.send(result);
    }));

    const updateSecurityEntityQuery = async (securityentities) => {
        let isUpdate = securityentities.EntityName;
        if (isUpdate) {
            try {
                let results = await knex('securityentities')
                    .where('EntityName', securityentities.EntityName)
                    .update({ Description: securityentities.Description });
                return Promise.resolve(JSON.stringify(results));
            } catch (error) {
                return Promise.reject(error);
            }
        }
        else {
            try {
                let results = await knex('securityentities')
                    .insert({ Description: securityentities.Description, EntityName: securityentities.EntityName });
                return Promise.resolve(JSON.stringify(results));
            } catch (error) {
                return Promise.reject(error);
            }
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteSecurityEntity Delete Security Entities
    * @apiName deleteSecurityEntity
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Security Entities
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteSecurityEntity', handler.asyncFn(async (req, res, next) => {
        let results = await deleteSecurityEntityQuery(req.body);
        res.send(JSON.stringify(results));
    }));

    const deleteSecurityEntityQuery = async (entity) => {
        try {
            let removeResource = await removeResourceACL(entity.EntityName);
            let securityentities = await knex('securityentities')
                .where('EntityName', entity.EntityName)
                .del();
            return Promise.resolve(securityentities);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const removeResourceACL = async (EntityName) => {
        acl.removeResource(EntityName, (err) => {
            if (!err) {
                return Promise.resolve();
            }
            else {
                return Promise.reject("Remove ACL Resource error");
            }
        });
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getTags Get Tags
    * @apiName getTags
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Tags
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getTags', handler.asyncFn(async (req, res, next) => {
        let results = await getTagsQuery(req.body.gridProperties, null);
        res.send(results);
    }));

    const getTagsQuery = async (gridProperties, parentQuery) => {
        let query = knex('dew_tags');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        let isWherAlreadyAdded = false;
        commonServiceMethods.getGridFilters(query, isWherAlreadyAdded, gridProperties);
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, null);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertTags Insert Tags
    * @apiName insertTags
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Tags
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertTags', handler.asyncFn(async (req, res, next) => {
        let results = await insertTagsQuery(req.body);
        res.send(results);
    }));

    const insertTagsQuery = async (dewTags) => {
        let inserCollection = [];
        inserCollection.push(dewTags);
        try {
            let results = await knex('dew_tags')
                .insert(inserCollection);
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getDocuments Get Documents
    * @apiName getDocuments
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Documents
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getDocuments', handler.asyncFn(async (req, res, next) => {
        let results = await getDocumentsQuery(req.query.moduleName, req.body.gridProperties, req.body.status, null);
        res.send(results);
    }));

    const getDocumentsQuery = async (moduleName, gridProperties, status, parentQuery) => {
        let query = knex('dew_docs');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        let isWherAlreadyAdded = true;
        query.where(function () {
            if (status != "null") {
                this.where("ModuleName", "=", moduleName).andWhere('DewDocs', "=", status)
            } else {
                this.where("ModuleName", "=", moduleName)
            }
        });
        commonServiceMethods.getGridFilters(query, isWherAlreadyAdded, gridProperties);
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, null)
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertDocument Insert Documents
    * @apiName insertDocument
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Documents
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertDocument', handler.asyncFn(async (req, res, next) => {
        let results = await insertDocumentQuery(req.body);
        res.send(results);

    }));

    const insertDocumentQuery = async (dew_docs) => {
        let inserCollection = [];
        let dewDocs = Object.assign({}, dew_docs);
        if (dewDocs.isDewDoc) {
            delete dewDocs.isDewDoc
        }
        inserCollection.push(dewDocs);
        try {
            if (dewDocs.DewDocs) {
                let results = await knex('dew_docs')
                    .update({
                        ModuleName: dewDocs.ModuleName,
                        Name: dewDocs.Name,
                        Description: dewDocs.Description,
                        FileName: dewDocs.FileName,
                        OriginalFileName: dewDocs.OriginalFileName,
                        MimeType: dewDocs.MimeType,
                        DewDocs: dewDocs.DewDocs
                    })
                    .where('FileName', dew_docs.FileName);
                return Promise.resolve({
                    mimeType: dew_docs.MimeType,
                    originalFileName: dew_docs.OriginalFileName,
                    remoteFileName: dew_docs.FileName
                });
            } else {
                let results = await knex('dew_docs')
                    .insert(inserCollection)
                    .returning('*')
                if (dew_docs.isDewDoc) {
                    return Promise.resolve({
                        docId: results[0].DocId ? results[0].DocId : results[0],
                        mimeType: dew_docs.MimeType,
                        originalFileName: dew_docs.OriginalFileName,
                        remoteFileName: dew_docs.FileName
                    })
                } else {
                    return Promise.resolve(results);
                }
            }
        } catch (error) {
            return Promise.reject(error);

        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/updateDocument Update Documents
    * @apiName updateDocument
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Documents
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/updateDocument', handler.asyncFn(async (req, res, next) => {
        let result = await deleteolddocumentQuery(req.body);
        let results = await updateDocumentQuery(req.body);
        res.send(JSON.stringify(results));
    }));
    const deleteolddocumentQuery = async (dew_docs) => {
        try {
            let results = await knex('dew_docs')
                .where('FileName', dew_docs.FileName).andWhere('Name', dew_docs.OriginalFileName)
                .del();
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const updateDocumentQuery = async (dew_docs) => {
        try {
            let results = await knex('dew_docs')
                .update({
                    ModuleName: dew_docs.ModuleName,
                    Name: dew_docs.Name,
                    Description: dew_docs.Description,
                    FileName: dew_docs.FileName,
                    OriginalFileName: dew_docs.OriginalFileName,
                    MimeType: dew_docs.MimeType,
                    DewDocs: dew_docs.DewDocs
                })
                .where('DocId', dew_docs.DocId);
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };


    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteDocument Delete Documents
    * @apiName deleteDocument
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Documents
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteDocument', handler.asyncFn(async (req, res, next) => {
        let results = await knex('dew_docs')
            .where('DocId', req.body.DocId)
            .del();
        res.send(JSON.stringify(results));
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteTag Delete Documents
    * @apiName deleteTag
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Documents
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteTag', handler.asyncFn(async (req, res, next) => {
        let results = await knex('dew_tags')
            .where('Tag', req.body.Tag)
            .del();
        res.send(JSON.stringify(results));
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertCodeTableHeader Insert Code Table Header
    * @apiName insertCodeTableHeader
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Code Table Header
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertCodeTableHeader', handler.asyncFn(async (req, res, next) => {
        let results = await insertCodeTableHeaderQuery(req.body);
        res.send(results);
    }));

    const insertCodeTableHeaderQuery = async (codetableheader) => {
        try {
            let insertCollection = Array.isArray(codetableheader) ? codetableheader : [codetableheader];
            var query = await knex.raw("SELECT CodeName FROM CodeTableHeader WHERE CodeName = '" + insertCollection[0].CodeName + "'")
            if (query.length > 0) {
                return Promise.resolve({
                    msg: "CodeName is already Exist"
                });
            } else {
                let results = await knex('CodeTableHeader')
                    .insert(insertCollection)
                return Promise.resolve(results);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteTableHeader Delete Code Table Header
    * @apiName deleteTableHeader
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Code Table Header
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteTableHeader', handler.asyncFn(async (req, res, next) => {
        let results = await deleteTableHeaderQuery(req.body);
        res.send(JSON.stringify(results));
    }));

    const deleteTableHeaderQuery = async (codetableheader) => {
        try {
            var query = await knex.raw("SELECT CodeName FROM CodeTable WHERE CodeName = '" + codetableheader.CodeName + "'");
            if (query.length > 0) {
                return Promise.resolve({
                    msg: "CodeName is Exist"
                });
            } else {
            let results = await knex('CodeTableHeader')
                .where('CodeName', codetableheader.CodeName)
                .del();
            return Promise.resolve(results);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/insertCodeTable Insert Code Table Header
    * @apiName insertCodeTable
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Code Table Header
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/insertCodeTable', handler.asyncFn(async (req, res, next) => {
        let results = await insertCodeTableQuery(req.body);
        res.send(JSON.stringify(results));
    }));

    const insertCodeTableQuery = async (codetable) => {
        try {
            let insertCollection = Array.isArray(codetable) ? codetable : [codetable];
            let results = await knex('CodeTable')
                .insert(insertCollection)
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getCodeTableHeaders Get Code Table Headers
    * @apiName getCodeTableHeaders
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Code Table Headers
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getCodeTableHeaders', handler.asyncFn(async (req, res, next) => {
        let results = await getCodeTableHeadersQuery(null, req.body.gridProperties);
        res.send(results);
    }));

    const getCodeTableHeadersQuery = async (parentQuery, gridProperties) => {
        let query = knex('CodeTableHeader');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        let isWherAlreadyAdded = false;
        commonServiceMethods.getGridFilters(query, isWherAlreadyAdded, gridProperties);
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, null)
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };


    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/getCodeTables Get Code Tables
    * @apiName getCodeTables
    * @apiGroup AppUser
    *
    * @apiSuccess {Object} Info of Code Tables
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/getCodeTables', handler.asyncFn(async (req, res, next) => {
        let results = await getCodeTablesQuery(req.query.CodeName, null, req.body.gridProperties);
        res.send(results);
    }));

    const getCodeTablesQuery = async (CodeName, parentQuery, gridProperties) => {
        let query = knex('CodeTable');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        query.where(function () {
            this.where('CodeName', '=', CodeName)
        });
        let isWherAlreadyAdded = true;
        commonServiceMethods.getGridFilters(query, isWherAlreadyAdded, gridProperties);
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, null)
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/sendNotification Send Notification
    * @apiName sendNotification
    * @apiGroup Notification
    *
    * @apiSuccess {Object} Info of Notification
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/sendNotification', handler.asyncFn(async (req, res, next) => {
        let results = await notify.sendNotification(msgObj);
        res.send(results);
    }));

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/updateCodeTable Update CodeTable
    * @apiName updateCodeTable
    * @apiGroup CodeTable
    *
    * @apiSuccess {Object} Info of Code Tables
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/updateCodeTable', handler.asyncFn(async (req, res, next) => {
        let results = await updateCodeTableQuery(req.body);
        res.send(results);
    }));

    const updateCodeTableQuery = async (codetable) => {
        let isUpdate = codetable.CodeName && codetable.CodeValue;
        if (isUpdate) {
            try {
                let results = await knex('CodeTable')
                    .where('CodeName', codetable.CodeName)
                    .andWhere('CodeId', codetable.CodeId)
                    .update({
                        CodeDisplayValue: codetable.CodeDisplayValue,
                        CodeValueDescription: codetable.CodeValueDescription,
                        CodeSequence: codetable.CodeSequence,
                        CodeValue: codetable.CodeValue
                    });
                return Promise.resolve(JSON.stringify(results));
            } catch (error) {
                return Promise.reject(error);

            }
        }
        else {
            try {
                let results = await knex('CodeTable')
                    .insert({
                        CodeDisplayValue: codetable.CodeDisplayValue,
                        CodeValueDescription: codetable.CodeValueDescription,
                        CodeSequence: codetable.CodeSequence,
                        CodeName: codetable.CodeName,
                        CodeValue: codetable.CodeValue
                    });
                return Promise.resolve(JSON.stringify(results));

            } catch (error) {
                return Promise.reject(error);
            }
        }
    };

    /**
    * @apiVersion 1.0.0
    * @api {POST} /api/deleteCodeTable Delete Code Table
    * @apiName updateCodeTable
    * @apiGroup CodeTable
    *
    * @apiSuccess {Object} Info of Code Tables
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "info": "Success"
    *     }
    */

    app.post('/api/deleteCodeTable', handler.asyncFn(async (req, res, next) => {
        let results = await deleteCodeTableQuery(req.body)
        res.send(results);
    }));

    const deleteCodeTableQuery = async (codetable) => {
        let isDelete = codetable.CodeName && codetable.CodeValue;
        if (isDelete) {
            try {
                let results = await knex('CodeTable')
                    .where('CodeId', codetable.CodeId)
                    .del();
                return Promise.resolve(JSON.stringify(results));
            } catch (error) {
                return Promise.reject(error);
            }
        } else {
            return Promise.reject("Code Name doesn't exist");
        }
    };
};
