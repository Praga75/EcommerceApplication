const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/addtocardlist
     * @apiName addtocardlist
     * @apiGroup cardlist
     *
     * @apiParam customerid
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/addtocardlist', handler.asyncFn(async (req, res, next) => {
        let results = await addtocardlistQuery(req.body.customerid, null, null);
        res.send(results);
    }));

    const addtocardlistQuery = async (customerid, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('RichCardAddToCard.cardid as cardid', 'RichCardAddToCard.productid as productid', 'RichCardAddToCard.quantity as quantity', 'RichCardAddToCard.customerid as customerid').from('RichCardAddToCard as RichCardAddToCard');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('RichCardAddToCard.customerid', '=', customerid)
        })
        var queryContainsOrderBy = false;
        query.first();
        try {
            let results = await commonServiceMethods.getResults(query, null, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };
    app.locals.services.addtocardlistQuery = addtocardlistQuery;
};