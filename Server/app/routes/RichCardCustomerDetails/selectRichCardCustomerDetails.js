const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/selectRichCardCustomerDetails
     * @apiName selectRichCardCustomerDetails
     * @apiGroup RichCardCustomerDetails
     *
     * @apiParam gridProperties
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/selectRichCardCustomerDetails', handler.asyncFn(async (req, res, next) => {
        let results = await selectRichCardCustomerDetailsQuery(req.body.gridProperties, null, null);
        res.send(results);
    }));

    const selectRichCardCustomerDetailsQuery = async (gridProperties, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('RichCardCustomerDetails.customerid as customerid', 'RichCardCustomerDetails.FullName as FullName', 'RichCardCustomerDetails.Phone as Phone', 'RichCardCustomerDetails.Email as Email', 'RichCardCustomerDetails.password as password', 'RichCardCustomerDetails.gender as gender', 'RichCardCustomerDetails.status as status').from('RichCardCustomerDetails as RichCardCustomerDetails');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = false;
        commonServiceMethods.getGridFilters(query, isWhereAlreadyAdded, gridProperties);
        var queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, gridProperties, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };
    app.locals.services.selectRichCardCustomerDetailsQuery = selectRichCardCustomerDetailsQuery;
};