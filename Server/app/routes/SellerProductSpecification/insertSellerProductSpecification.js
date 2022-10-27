const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertSellerProductSpecification
     * @apiName insertSellerProductSpecification
     * @apiGroup SellerProductSpecification
     *
     * @apiDescription SellerProductSpecification
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertSellerProductSpecification', handler.asyncFn(async (req, res, next) => {
        let results = await insertSellerProductSpecificationQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertSellerProductSpecificationQuery = async (SellerProductSpecification, transaction) => {
        var insertItemList = Array.isArray(SellerProductSpecification) ? SellerProductSpecification : [SellerProductSpecification];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    description: insertListItem.description,
                    productName: insertListItem.productName,
                    size: insertListItem.size,
                    colour: insertListItem.colour,
                    returnPolicy: insertListItem.returnPolicy,
                    timeForReplacement: insertListItem.timeForReplacement,
                    termsAndCondition: insertListItem.termsAndCondition
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('SellerProductSpecification').transacting(transaction) : knex('SellerProductSpecification');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertSellerProductSpecificationQuery = insertSellerProductSpecificationQuery;
};