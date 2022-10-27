const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertSellerProduct
     * @apiName insertSellerProduct
     * @apiGroup sellerProduct
     *
     * @apiDescription sellerProduct
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertSellerProduct', handler.asyncFn(async (req, res, next) => {
        let results = await insertSellerProductQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertSellerProductQuery = async (sellerProduct, transaction) => {
        var insertItemList = Array.isArray(sellerProduct) ? sellerProduct : [sellerProduct];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    sellerid: insertListItem.sellerid,
                    brand: insertListItem.brand,
                    category: insertListItem.category,
                    price: insertListItem.price,
                    totalsale: insertListItem.totalsale,
                    isVerified: insertListItem.isVerified,
                    productquantity: insertListItem.productquantity
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('sellerProduct').transacting(transaction) : knex('sellerProduct');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertSellerProductQuery = insertSellerProductQuery;
};