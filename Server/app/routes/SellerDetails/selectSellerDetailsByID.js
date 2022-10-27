const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/selectSellerDetailsByID
     * @apiName selectSellerDetailsByID
     * @apiGroup SellerDetails
     *
     * @apiParam email
     * @apiParam password
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/selectSellerDetailsByID', handler.asyncFn(async (req, res, next) => {
        let results = await selectSellerDetailsByIDQuery(req.body.email, req.body.password, null, null);
        res.send(results);
    }));

    const selectSellerDetailsByIDQuery = async (email, password, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('SellerDetails.sellerid as sellerid', 'SellerDetails.FullName as FullName', 'SellerDetails.Phone as Phone', 'SellerDetails.Email as Email', 'SellerDetails.Password as Password', 'SellerDetails.Gender as Gender', 'SellerDetails.GSTnumber as GSTnumber', 'SellerDetails.Totalincome as Totalincome', 'SellerDetails.isVerified as isVerified', 'SellerDetails.isActive as isActive', 'SellerDetails.logo as logo').from('SellerDetails as SellerDetails');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('SellerDetails.Email', '=', email)
                .andWhere('SellerDetails.Password', '=', password)
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
    app.locals.services.selectSellerDetailsByIDQuery = selectSellerDetailsByIDQuery;
};