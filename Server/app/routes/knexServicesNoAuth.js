const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {
    app.locals.services = {};

    require(global.appRoot + '/app/routes/SellerDetails/insertSellerDetails.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/SellerDetails/selectSellerDetailsByID.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/SellerAddress/insertSellerAddress.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/SellerAddress2/insertSellerAddress2.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProduct/insertSellerProduct.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/SellerProductSpecification/insertSellerProductSpecification.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/notverify/notverifyproduct.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/notverify/varied.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/notverify/updatestatus.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProduct/productDetails.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/status/updatesellerStatus.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/join/joinproduct.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/FullDetails/ProductFullDetails.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/RichCardCustomerDetails/insertRichCardCustomerDetails.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/RichCardCutomerAddress/insertRichCardCutomerAddress.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/RichCardCustomerDetails/selectRichCardCustomerDetailsByID.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/RichCardAddToCard/insertRichCardAddToCard.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/RichCardAddToCard/selectRichCardAddToCardByID.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/cardlist/addtocardlist.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProduct/selectSellerProductByID76501.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/searching/searching.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/databyid/databyid.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/databyid/prodetailbyid.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProductlist/sellerProductlist.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProductlist/sellerProductlist.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/sellerProductlist/sellerAddProductList.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/order/orderDetails.js')(app, knex, acl);
    require(global.appRoot + '/app/routes/seller/sellerOrderStatus.js')(app, knex, acl);







};