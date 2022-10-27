const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/insertSellerDetails
     * @apiName insertSellerDetails
     * @apiGroup SellerDetails
     *
     * @apiDescription SellerDetails
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/insertSellerDetails', handler.asyncFn(async (req, res, next) => {
        let results = await insertSellerDetailsQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const insertSellerDetailsQuery = async (SellerDetails, transaction) => {
        var insertItemList = Array.isArray(SellerDetails) ? SellerDetails : [SellerDetails];
        var insertItems = [];
        if (insertItemList) {
            _.each(insertItemList, function(insertListItem) {
                var item = {
                    FullName: insertListItem.FullName,
                    Phone: insertListItem.Phone,
                    Email: insertListItem.Email,
                    Password: insertListItem.Password,
                    Gender: insertListItem.Gender,
                    GSTnumber: insertListItem.GSTnumber,
                    Totalincome: insertListItem.Totalincome,
                    isVerified: insertListItem.isVerified,
                    isActive: insertListItem.isActive,
                    logo: insertListItem.logo
                };
                insertItems.push(item);
            });
        }
        try {
            let knexTrx = transaction ? knex('SellerDetails').transacting(transaction) : knex('SellerDetails');
            let results = await knexTrx.returning('*').insert(insertItems);
            return Promise.resolve(results);
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        };
    };
    app.locals.services.insertSellerDetailsQuery = insertSellerDetailsQuery;
};