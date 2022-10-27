const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/updateSellerProduct
     * @apiName updateSellerProduct
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

    app.post('/api/updateSellerProduct', handler.asyncFn(async (req, res, next) => {
        let results = await updateSellerProductQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const updateSellerProductQuery = async (sellerProduct, transaction) => {
        let serviceParamObject = {
            sellerProduct: sellerProduct
        };

        let updateQuery = async (serviceParamObject, trx) => {
            try {
                let knexTrx = trx ? knex('sellerProduct').transacting(trx) : knex('sellerProduct');
                let results = await knexTrx.where('productid', serviceParamObject.sellerProduct.productid)
                    .returning('*')
                    .update({
                        sellerid: serviceParamObject.sellerProduct.sellerid,
                        brand: serviceParamObject.sellerProduct.brand,
                        category: serviceParamObject.sellerProduct.category,
                        price: serviceParamObject.sellerProduct.price,
                        totalsale: serviceParamObject.sellerProduct.totalsale,
                        isVerified: serviceParamObject.sellerProduct.isVerified,
                        productquantity: serviceParamObject.sellerProduct.productquantity
                    });

                return Promise.resolve(results);
            } catch (err) {
                logger.error(err);
                return Promise.reject(err);
            };
        };
        var updateItems = Array.isArray(serviceParamObject) ? serviceParamObject : [serviceParamObject];
        return new Promise(async (resolve, reject) => {
            try {
                let updates = await commonServiceMethods.updateMultipleInTrancsaction(updateItems, updateQuery, knex, transaction);
                resolve(updates);
            } catch (error) {
                reject(error);
            }
        });
    };
    app.locals.services.updateSellerProductQuery = updateSellerProductQuery;
};