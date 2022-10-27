const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/selectRichCardCustomerDetailsByID
     * @apiName selectRichCardCustomerDetailsByID
     * @apiGroup RichCardCustomerDetails
     *
     * @apiParam Email
     * @apiParam password
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/selectRichCardCustomerDetailsByID', handler.asyncFn(async (req, res, next) => {
        let results = await selectRichCardCustomerDetailsByIDQuery(req.body.Email, req.body.password, null, null);
        res.send(results);
    }));

    const selectRichCardCustomerDetailsByIDQuery = async (Email, password, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('RichCardCustomerDetails.customerid as customerid', 'RichCardCustomerDetails.FullName as FullName', 'RichCardCustomerDetails.Phone as Phone', 'RichCardCustomerDetails.Email as Email', 'RichCardCustomerDetails.password as password', 'RichCardCustomerDetails.gender as gender', 'RichCardCustomerDetails.status as status').from('RichCardCustomerDetails as RichCardCustomerDetails');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('RichCardCustomerDetails.Email', '=', Email)
                .andWhere('RichCardCustomerDetails.password', '=', password)
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
    app.locals.services.selectRichCardCustomerDetailsByIDQuery = selectRichCardCustomerDetailsByIDQuery;
};