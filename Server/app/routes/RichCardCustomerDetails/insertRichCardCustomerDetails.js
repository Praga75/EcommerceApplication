const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertRichCardCustomerDetails
     * @apiName insertRichCardCustomerDetails
     * @apiGroup RichCardCustomerDetails
     *
     * @apiDescription RichCardCustomerDetails
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertRichCardCustomerDetails', handler.asyncFn(async (req, res, next) => {
        let results = await insertRichCardCustomerDetailsQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertRichCardCustomerDetailsQuery = async (RichCardCustomerDetails, transaction) => {
        var insertItemList = Array.isArray(RichCardCustomerDetails) ? RichCardCustomerDetails : [RichCardCustomerDetails];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    FullName: insertListItem.FullName,
                    Phone: insertListItem.Phone,
                    Email: insertListItem.Email,
                    password: insertListItem.password,
                    gender: insertListItem.gender,
                    status: insertListItem.status
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('RichCardCustomerDetails').transacting(transaction) : knex('RichCardCustomerDetails');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertRichCardCustomerDetailsQuery = insertRichCardCustomerDetailsQuery;
};