const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/selectRichCardCutomerAddress
     * @apiName selectRichCardCutomerAddress
     * @apiGroup RichCardCutomerAddress
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


    app.post('/api/selectRichCardCutomerAddress', handler.asyncFn(async (req, res, next) => {
        let results = await selectRichCardCutomerAddressQuery(req.body.gridProperties, null, null);
        res.send(results);
    }));

    const selectRichCardCutomerAddressQuery = async (gridProperties, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('RichCardCutomerAddress.customerid as customerid', 'RichCardCutomerAddress.addressLineOne as addressLineOne', 'RichCardCutomerAddress.addressLineTwo as addressLineTwo', 'RichCardCutomerAddress.city as city', 'RichCardCutomerAddress.state as state', 'RichCardCutomerAddress.pinCode as pinCode', 'RichCardCutomerAddress.country as country', 'RichCardCutomerAddress.Email as Email', 'RichCardCutomerAddress.Phone2 as Phone2', 'RichCardCutomerAddress.isPrimary as isPrimary').from('RichCardCutomerAddress as RichCardCutomerAddress');
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
    app.locals.services.selectRichCardCutomerAddressQuery = selectRichCardCutomerAddressQuery;
};