const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertRichCardAddToCard
     * @apiName insertRichCardAddToCard
     * @apiGroup RichCardAddToCard
     *
     * @apiDescription RichCardAddToCard
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertRichCardAddToCard', handler.asyncFn(async (req, res, next) => {
        let results = await insertRichCardAddToCardQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertRichCardAddToCardQuery = async (RichCardAddToCard, transaction) => {
        var insertItemList = Array.isArray(RichCardAddToCard) ? RichCardAddToCard : [RichCardAddToCard];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    productid: insertListItem.productid,
                    quantity: insertListItem.quantity,
                    customerid: insertListItem.customerid
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('RichCardAddToCard').transacting(transaction) : knex('RichCardAddToCard');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertRichCardAddToCardQuery = insertRichCardAddToCardQuery;
};