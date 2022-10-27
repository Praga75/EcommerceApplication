const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {
    app.locals.services = {};

    require(global.appRoot + '/app/routes/SellerDetails/selectSellerDetailsByID36233.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProduct/selectSellerProductByID.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProduct/updateSellerProduct.js')(app, knex, acl);







};