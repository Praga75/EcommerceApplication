const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/orderDetails
     * @apiName orderDetails
     * @apiGroup order
     *
     * @apiParam productid
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/orderDetails', handler.asyncFn(async (req, res, next) => {
        let results = await orderDetailsQuery(req.body.productid, null, null);
        res.send(results);
    }));

    const orderDetailsQuery = async (productid, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('orderTable.orderid as orderid', 'orderTable.productid as productid', 'orderTable.customerId as customerId', 'orderTable.orderStatus as orderStatus', 'orderTable.paymentId as paymentId', 'orderTable.price as price', 'orderTable.shippingAddress as shippingAddress', 'orderTable.deliveringAddress as deliveringAddress', 'orderTable.deliveryCharge as deliveryCharge', 'orderTable.dateOfOrder as dateOfOrder', 'orderTable.dateOfDelivery as dateOfDelivery', 'orderTable.totalPrice as totalPrice').from('orderTable as orderTable');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('orderTable.productid', '=', productid)
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
    app.locals.services.orderDetailsQuery = orderDetailsQuery;
};