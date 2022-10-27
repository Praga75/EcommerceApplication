const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertSellerAddress2
     * @apiName insertSellerAddress2
     * @apiGroup SellerAddress2
     *
     * @apiDescription SellerAddress2
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertSellerAddress2', handler.asyncFn(async (req, res, next) => {
        let results = await insertSellerAddress2Query(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertSellerAddress2Query = async (SellerAddress2, transaction) => {
        var insertItemList = Array.isArray(SellerAddress2) ? SellerAddress2 : [SellerAddress2];
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
            let knexTrx = transaction ? knex('SellerAddress2').transacting(transaction) : knex('SellerAddress2');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertSellerAddress2Query = insertSellerAddress2Query;
};