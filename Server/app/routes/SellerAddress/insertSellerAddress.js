const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertSellerAddress
     * @apiName insertSellerAddress
     * @apiGroup SellerAddress
     *
     * @apiDescription SellerAddress
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertSellerAddress', handler.asyncFn(async (req, res, next) => {
        let results = await insertSellerAddressQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertSellerAddressQuery = async (SellerAddress, transaction) => {
        var insertItemList = Array.isArray(SellerAddress) ? SellerAddress : [SellerAddress];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    addressOne: insertListItem.addressOne,
                    addressTwo: insertListItem.addressTwo,
                    city: insertListItem.city,
                    state: insertListItem.state,
                    pincode: insertListItem.pincode,
                    country: insertListItem.country,
                    isPrimary: insertListItem.isPrimary
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('SellerAddress').transacting(transaction) : knex('SellerAddress');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertSellerAddressQuery = insertSellerAddressQuery;
};