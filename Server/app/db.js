var config = require('../config/config');
var knex = require('knex')(config.db[config.environment]);
module.exports = knex;
//Migrate all entites made/altered to DB 
knex.migrate.latest([config.db]);
