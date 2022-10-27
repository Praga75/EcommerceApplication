const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/notverified
     * @apiName notverified
     * @apiGroup notverify
     *
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.get('/api/notverified', handler.asyncFn(async (req, res, next) => {
        let results = await notverifiedQuery(null, null);
        res.send(results);
    }));

    const notverifiedQuery = async (parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('sellerProduct.productid as productid', 'sellerProduct.sellerid as sellerid', 'sellerProduct.brand as brand', 'sellerProduct.category as category', 'sellerProduct.price as price', 'sellerProduct.totalsale as totalsale', 'sellerProduct.isVerified as isVerified', 'sellerProduct.productquantity as productquantity').from('sellerProduct as sellerProduct');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('sellerProduct.isVerified', '=', 1)
        })
        var queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, null, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };
    app.locals.services.notverifiedQuery = notverifiedQuery;
};