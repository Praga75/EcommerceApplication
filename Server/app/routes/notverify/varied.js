const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/varied
     * @apiName varied
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


    app.get('/api/varied', handler.asyncFn(async (req, res, next) => {
        let results = await variedQuery(null, null);
        res.send(results);
    }));

    const variedQuery = async (parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('sellerProduct.productid as productid', 'sellerProduct.sellerid as sellerid', 'sellerProduct.brand as brand', 'sellerProduct.category as category', 'sellerProduct.price as price', 'sellerProduct.totalsale as totalsale', 'sellerProduct.isVerified as isVerified', 'sellerProduct.productquantity as productquantity').from('sellerProduct as sellerProduct');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('sellerProduct.isVerified', '=', 'Active')
        })
        var queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, null, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };
    app.locals.services.variedQuery = variedQuery;
};