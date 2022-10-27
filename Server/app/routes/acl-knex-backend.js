const bcrypt = require('bcrypt-nodejs');
const contract = require('acl/lib/contract');
const _ = require('lodash');
const fs = require('fs');

function KnexDBBackend(db, prefix) {
    this.knex = db;
    this.bucketTable = prefix && prefix.length > 0 ? prefix + 'bucket' : 'acl_bucket';
    this.bucketValuesTable = prefix && prefix.length > 0 ? prefix + 'bucket_values' : 'acl_bucket_values';
}
<<<<<<< HEAD
// something

=======
// Test line one
>>>>>>> 0aa2c78499ff8614008e33202ed662fecdcef04d
KnexDBBackend.prototype = {
    //Begins a transaction.
    begin: function () {
        // returns a transaction object
        return [];
    },
    //Ends a transaction (and executes it)
    end: function (transaction, cb) {
        contract(arguments).params('array', 'function').end();
        var self = this;
        // self.knex.transaction(function(trx) {
        // })
        // .then(function(resp){
        //    //transaction complete
        // })
        // .catch(function(err){
        //    console.error(err);
        // });
        var currentIndex = -1;
        var trx = null;
        var processNext = function () {
            currentIndex++;
            if (currentIndex < transaction.length) {
                transaction[currentIndex](trx, function (err) {
                    if (err) {
                        // trx.rollback;
                        cb(err);
                    }
                    else {
                        processNext(trx);
                    }
                });

            }
            else {
                // trx.commit;
                cb();
            }
        };
        processNext();
    },
    //Cleans the whole storage.
    clean: function (cb) {
        contract(arguments)
            .params('function')
            .end()
            ;
        cb(undefined);
    },
    //Gets the contents at the bucket's key.
    get: async function (bucket, key, cb) {
        contract(arguments).params('string', 'string|number', 'function').end();
        var keys = Array.isArray(key) ? key : [key]; // we always want to have an array for values
        try {
            var values = await this.getBucketValues(bucket, keys);
            cb(undefined, values);
        } catch (error) {
            cb(error, []);
        }


    },
    //Returns the union of the values in the given keys.
    union: async function (bucket, keys, cb) {
        contract(arguments).params('string', 'array', 'function').end();
        var keys2 = Array.isArray(keys) ? keys : [keys]; // we always want to have an array for values

        try {
            var values = await this.getBucketValues(bucket, keys2);
            cb(undefined, values);
        } catch (error) {
            cb(error, []);
        }
    },
    //Adds values to a given key inside a table.
    add: function (transaction, bucket, key, values) {
        contract(arguments).params('array', 'string', 'string|number', 'string|array|number').end();
        var self = this;
        transaction.push(function (knexTrx, cb) {
            self.insertAclBucketItem(knexTrx, bucket, key, values, cb);
        });
    },
    // Delete the given key(s) at the bucket
    del: function (transaction, bucket, keys) {
        contract(arguments).params('array', 'string', 'string|array').end();
        var self = this;
        keys = Array.isArray(keys) ? keys : [keys]; // we always want to have an array for keys
        transaction.push(function (knexTrx, cb) {
            self.deleteBucketQuery(knexTrx, bucket, keys, cb);
        });
    },
    //Removes values from a given key inside a bucket.
    remove: function (transaction, bucket, key, values) {
        contract(arguments).params('array', 'string', 'string|number', 'string|array').end();
        var self = this;
        values = Array.isArray(values) ? values : [values]; // we always want to have an array for values
        transaction.push(function (knexTrx, cb) {
            self.deleteBucketValueQuery(knexTrx, bucket, key, values, cb);
        });
    },

    getBucketValues: async function (bucketName, keys) {
        var self = this;
        try {
            let results = await self.knex.select('Value')
                .from(self.bucketValuesTable)
                .whereIn('Key', [keys])
                .andWhere('BucketName', bucketName);

            var values = [];
            _.each(results, function (rec) {
                values.push(rec.Value);
            });
            return Promise.resolve(values);
        } catch (error) {
            return Promise.reject(error);

        }
    },

    getPermissionsByRole: async function (roles) {
        var self = this;
        roles = Array.isArray(roles) ? roles : [roles]; // we always want to have an array
        try {
            let results = await self.knex.select('BucketName', 'Key', 'Value')
                .from(self.bucketValuesTable)
                .whereIn('Key', roles)
                .andWhere('BucketName', 'like', 'allows_%')
            return Promise.resolve(results);
        } catch (error) {
            return Promise.reject(error);

        }
    },

    getPermissionsByResource: function (resource, cb) {
        var self = this;
        self.knex.select('BucketName', 'Key', 'Value')
            .from(self.bucketValuesTable)
            .where('BucketName', 'allows_' + resource)
            .then(function (results, err) {
                var roles = [];
                var operations = [];
                _.each(results, function (r) {
                    if (!roles[results[r.Key]]) {
                        roles.push(results[r.Key]);
                    }
                    if (!operations[results[r.Value]]) {
                        operations.push(results[r.Value]);
                    }
                });
                cb(results, roles, operations, err);
            })
            .catch(function (error) {
                cb(null, error);
            });
    },

    insertAclBucketItem: function (knexTrx, bucket, key, values, cb) {
        var bucketRecord = { BucketName: bucket, Key: key };
        var bucketValues = [];
        var valueArray = Array.isArray(values) ? values : [values]; // we always want to have an array for values
        _.each(valueArray, function (value) {
            var bucketValue = { BucketName: bucket, Key: key, Value: value };
            bucketValues.push(bucketValue);
        });
        var self = this;
        self.updateBucketQuery(knexTrx, bucketRecord, function (err) {
            if (err) {
                cb(err);
            }
            else {
                self.updateMultipleInTransaction(self, knexTrx, bucketValues, self.updateBucketValueQuery, function (err) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        cb();
                    }
                });
            }
        });
    },

    updateBucketQuery: function (knexTrx, bucketRecord, cb) {
        var self = this;
        self.knex.select('BucketName', 'Key')
            // .transacting(knexTrx)
            .from(self.bucketTable)
            .where({ 'BucketName': bucketRecord.BucketName, 'Key': bucketRecord.Key })
            .then(function (results, err) {
                if (err) {
                    cb(err);
                    return;
                }
                if (results.length === 0) {
                    self.knex(self.bucketTable)
                        .insert(bucketRecord)
                        // .transacting(knexTrx)
                        .then(function (results, err) {
                            cb(err);
                        })
                        .catch(function (error) {
                            cb(error);
                        });

                } else {
                    cb(null);
                }
            })
            .catch(function (error) {
                cb(error);
            });
    },

    deleteBucketQuery: function (knexTrx, bucketName, keys, cb) {
        var self = this;
        self.knex(self.bucketValuesTable)
            // .transacting(knexTrx)
            .whereIn('Key', keys)
            .andWhere('BucketName', bucketName)
            .del()
            .then(function (results, err) {
                if (err) {
                    cb(err);
                }
                else {
                    self.knex(self.bucketTable)
                        // .transacting(knexTrx)
                        .whereIn('Key', keys)
                        .andWhere('BucketName', bucketName)
                        .del()
                        .then(function (results, err) {
                            cb(err);
                        })
                        .catch(function (error) {
                            cb(error);
                        });
                }
            })
            .catch(function (error) {
                cb(error);
            });
    },

    updateBucketValueQuery: function (self, knexTrx, bucketValueRecord, cb) {
        self.knex.select('Value')
            .from(self.bucketValuesTable)
            // .transacting(knexTrx)
            .where({
                'BucketName': bucketValueRecord.BucketName,
                'Key': bucketValueRecord.Key,
                'Value': bucketValueRecord.Value
            })
            .then(function (results, err) {
                if (err) {
                    cb(err);
                    return;
                }
                if (results.length === 0) {
                    self.knex(self.bucketValuesTable).insert(bucketValueRecord)
                        .then(function (results, err) {
                            cb(err);
                        })
                        .catch(function (error) {
                            cb(error);
                        });

                } else {
                    cb(null);
                }
            })
            .catch(function (error) {
                cb(error);
            });
    },

    deleteBucketValueQuery: function (knexTrx, bucketName, key, values, cb) {
        var self = this;
        self.knex(self.bucketValuesTable)
            // .transacting(knexTrx)
            .whereIn('Value', values)
            .andWhere({ 'BucketName': bucketName, 'Key': key })
            .del()
            .then(function (results, err) {
                cb(err);
            })
            .catch(function (error) {
                cb(error);
            });
    },

    updateMultipleInTransaction: function (self, knexTrx, updateItems, updateFunction, cb) {
        var currentIndex = -1;
        var processNext = function () {
            currentIndex++;
            if (currentIndex < updateItems.length) {
                updateFunction(self, knexTrx, updateItems[currentIndex], function (err) {
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

        processNext();
    }
};

KnexDBBackend.prototype.setup = function () {
    const self = this;
    try {
        settings = JSON.parse(fs.readFileSync(global.baseDir + '/assets/settings.json', 'utf8'));
   } catch (error) {
       console.log("Default settings are used in the absence of a settings file.");
        settings = {
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
    return new Promise((resolve, reject) => {
        const createAppUsers = async () => {
            try {
                let exists = await self.knex.schema.hasTable('applicationusers');
                if (!exists) {
                    try {
                        let results = await self.knex.schema.createTable('applicationusers', function (t) {
                            t.increments('userId').primary();
                            t.string('userName', 64).unique();
                            t.string('firstName', 64);
                            t.string('lastName', 64);
                            t.string('email', 64).unique();
                            t.string('password', 128);
                            t.string('displayName', 64);
                            t.boolean('hasAddress');
                            t.boolean('isActive');
                            t.string('DocId', 128);
                            t.string('originalProfilePicFileName', 128);
                            t.string('profilePicMimeType', 64);
                            t.timestamps();
                        })
                        let loginInsert = await self.knex('applicationusers')
                            .insert({
                                'userName': 'dewAdmin',
                                'firstName': 'Admin',
                                'lastName': 'Admin',
                                'email': 'dewadmin@gdkn.com',
                                'password': bcrypt.hashSync('adminStart2019'),
                                'displayName': 'Dew Admin',
                                'hasAddress': false,
                                'isActive': true
                            })
                        return Promise.resolve(loginInsert);
                    } catch (error) {
                        return Promise.reject(error + "Acl Bucket Creation  Error")
                    }
                }
            } catch (error) {
                console.error(error);
            }

        };
        // Create Security Entities list table entity
        const createAclBucket = async () => {
            if (!settings.useDewAuthorization) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable(self.bucketTable)
            if (!exists) {
                try {
                    let bucketTableResults = await self.knex.schema.createTable(self.bucketTable, function (table) {
                        table.string('BucketName');
                        table.string('Key');
                        table.primary(['BucketName', 'Key']);
                    });
                    let bucketValuesTable = await self.knex.schema.createTable(self.bucketValuesTable, function (table2) {
                        table2.string('BucketName');
                        table2.string('Key');
                        table2.string('Value');
                        table2.primary(['BucketName', 'Key', 'Value']);
                    });
                    let bucketTablerolesInsert = await self.knex(self.bucketTable)
                        .insert({ 'BucketName': 'meta', 'Key': 'roles' });

                    let bucketTableInsert = await self.knex(self.bucketTable)
                        .insert({ 'BucketName': 'meta', 'Key': 'users' });
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Acl Bucket Creation  Error")
                }
            }
            else {
                return Promise.resolve();
            }
        };
        //createSecurityEntitiesTable
        const createSecurityEntitiesTable = async () => {
            if (!settings.useDewAuthorization) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable('securityentities');
            if (!exists) {
                try {
                    await self.knex.schema.createTable('securityentities', function (t) {
                        t.string('EntityName', 64).primary();
                        t.string('Description', 64);
                    });
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Security entities Error")
                }
            }
            else {
                return Promise.resolve();
            }
        };
        //create Security Operations Table
        const createSecurityOperationsTable = async () => {
            if (!settings.useDewAuthorization) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable('securityoperations');
            if (!exists) {
                try {
                    await self.knex.schema.createTable('securityoperations', function (t) {
                        t.string('OperationName', 64).primary();
                        t.string('Description', 64);
                    })
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Security operations Creation Error")
                }
            }
            else {
                return Promise.resolve();
            }
        };
        //create Tags Table
        const createTagsTable = async () => {
            if (!settings.useTag) {
                return Promise.resolve();
            }

            let exists = await self.knex.schema.hasTable('dew_tags')
            if (!exists) {
                try {
                    let results = await self.knex.schema.createTable('dew_tags', function (t) {
                        t.increments('TagId').primary();
                        t.string('Tag', 64);
                    })
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Tags Table Creation Error")
                }
            } else {
                return Promise.resolve();
            }
        };
        //create Doc Table
        const createDocTable = async () => {
            if (!settings.useDocuments) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable('dew_docs');
            if (!exists) {
                try {
                    let results = await self.knex.schema.createTable('dew_docs', function (t) {
                        t.increments('DocId').primary();
                        t.string('ModuleName', 64);
                        t.string('Name', 64);
                        t.string('Description', 64);
                        t.string('FileName', 128);
                        t.string('OriginalFileName', 128);
                        t.string('MimeType', 128);
                        t.integer('DewDocs')
                        t.timestamps();
                    });
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Create Doc Table Creation Error")
                }
            } else {
                return Promise.resolve();
            }
        };
        //create Image Table
        const createImageTable = async () => {
            let exists = await self.knex.schema.hasTable('dew_Images');
            if (!exists) {
                try {
                    let results = await self.knex.schema.createTable('dew_Images', function (t) {
                        t.increments('ImageId').primary();
                        t.string('FileName', 128);
                    })
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "create Image Table Error")
                }
            }
            else {
                return Promise.resolve();
            }
        };
        //create Doc Tags Table
        const createDocTagsTable = async () => {
            if (!settings.useDocuments) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable('dew_doc_tags')
            if (!exists) {
                try {
                    let results = await self.knex.schema.createTable('dew_doc_tags', function (t) {
                        t.integer('DocId');
                        t.string('Tag', 64);
                    })
                    return Promise.resolve()
                } catch (error) {
                    return Promise.reject(error + "Code Doc Tags Table Creation Error")
                }
            }
            else {
                return Promise.resolve()
            }
        };
        //Create CodeTable Header
        const createCodeTableHeader = async () => {
            if (!settings.useCodeTables) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable('CodeTableHeader');
            if (!exists) {
                try {
                    let results = await self.knex.schema.createTable('CodeTableHeader', function (t) {
                        t.string('CodeName', 32);
                        t.string('CodeNameDescription', 128);
                        t.primary(['CodeName']);
                        t.timestamps();
                    });
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Code Table Header Creation Error")
                }
            } else {
                return Promise.resolve();
            }
        };
        //Create CodeTable
        const createCodeTable = async () => {
            if (!settings.useCodeTables) {
                return Promise.resolve();
            }
            let exists = await self.knex.schema.hasTable('CodeTable');
            if (!exists) {
                try {
                    let results = await self.knex.schema.createTable('CodeTable', function (t) {
                        t.increments('CodeId').primary();
                        t.string('CodeName', 32);
                        t.string('CodeValue', 32);
                        t.string('CodeDisplayValue', 128);
                        t.string('CodeValueDescription', 128);
                        t.integer('CodeSequence');
                        t.timestamps();
                        t.foreign('CodeName').references('CodeName').inTable('CodeTableHeader');
                    });
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error + "Code Table Creation Error")
                }
            } else {
                return Promise.resolve();
            }
        };
        // Create an address to added user
        const createAppUserAddress = async (userId) => {
            userId = userId ? userId : 1;
            if (userId) {
                let exists = await self.knex.schema.hasTable('app_user_address');
                if (!exists) {
                    try {
                        let app_user_address = await self.knex.schema.createTable('app_user_address', function (t) {
                            t.increments('addressId').primary();
                            t.integer('usrId');
                            t.string('addressline1', 128);
                            t.string('addressline2', 128);
                            t.string('country', 64);
                            t.string('state', 32);
                            t.string('city', 128);
                            t.string('pincode', 32);
                            t.timestamps();
                            t.integer('createdBy');
                        })
                        let app_user_addressinsert = await self.knex('app_user_address')
                            .insert({
                                'usrId': userId,
                                'created_at': new Date(),
                                'createdBy': userId
                            })
                        return Promise.resolve();
                    } catch (error) {
                        return Promise.reject(error + "Error occured on app user address");
                    }
                } else { Promise.resolve(); }
            } else { Promise.resolve(); }
        }

        // Start once on application start
        try {
            (async () => {
                let user = await createAppUsers();
                let userId = user ? ((user[0].userId) ? user[0].userId : user[0]) : null;
                await createAppUserAddress(userId);
                await createAclBucket();
                await createSecurityEntitiesTable();
                await createSecurityOperationsTable();
                await createTagsTable();
                await createDocTable();
                await createImageTable();
                await createDocTagsTable();
                await createCodeTableHeader();
                await createCodeTable();
                resolve();
            })();
        } catch (error) {
            reject(error);
        }
    });
};

KnexDBBackend.prototype.teardown = async function () {
    const self = this;
    try {
        let bucketTableResults = await self.knex.schema.dropTable(self.bucketTable);
        let bucketValuesTableResults = await knex.schema.dropTable(self.bucketValuesTable);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error + "Acl Bucket Creation  Error")
    }
};

exports = module.exports = KnexDBBackend;
