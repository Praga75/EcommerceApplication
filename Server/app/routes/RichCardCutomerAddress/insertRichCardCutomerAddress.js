const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertRichCardCutomerAddress
     * @apiName insertRichCardCutomerAddress
     * @apiGroup RichCardCutomerAddress
     *
     * @apiDescription RichCardCutomerAddress
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertRichCardCutomerAddress', handler.asyncFn(async (req, res, next) => {
        let results = await insertRichCardCutomerAddressQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertRichCardCutomerAddressQuery = async (RichCardCutomerAddress, transaction) => {
        var insertItemList = Array.isArray(RichCardCutomerAddress) ? RichCardCutomerAddress : [RichCardCutomerAddress];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    addressLineOne: insertListItem.addressLineOne,
                    addressLineTwo: insertListItem.addressLineTwo,
                    city: insertListItem.city,
                    state: insertListItem.state,
                    pinCode: insertListItem.pinCode,
                    country: insertListItem.country,
                    Phone2: insertListItem.Phone2,
                    isPrimary: insertListItem.isPrimary
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('RichCardCutomerAddress').transacting(transaction) : knex('RichCardCutomerAddress');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertRichCardCutomerAddressQuery = insertRichCardCutomerAddressQuery;
};