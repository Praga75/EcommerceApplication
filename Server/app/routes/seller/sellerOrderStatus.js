const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/sellerOrderStatus
     * @apiName sellerOrderStatus
     * @apiGroup seller
     *
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/sellerOrderStatus', handler.asyncFn(async (req, res, next) => {
        let results = await sellerOrderStatusQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const sellerOrderStatusQuery = async (orderTable, transaction) => {
        let serviceParamObject = {
            orderTable: orderTable
        };

        let updateQuery = async (serviceParamObject, trx) => {
            try {
                let knexTrx = trx ? knex('orderTable').transacting(trx) : knex('orderTable');
                let results = await knexTrx.where('productid', serviceParamObject.orderTable.productid)
                    .returning('*')
                    .update({
                        productid: serviceParamObject.orderTable.productid,
                        customerId: serviceParamObject.orderTable.customerId,
                        orderStatus: serviceParamObject.orderTable.orderStatus,
                        paymentId: serviceParamObject.orderTable.paymentId,
                        price: serviceParamObject.orderTable.price,
                        shippingAddress: serviceParamObject.orderTable.shippingAddress,
                        deliveringAddress: serviceParamObject.orderTable.deliveringAddress,
                        deliveryCharge: serviceParamObject.orderTable.deliveryCharge,
                        dateOfOrder: serviceParamObject.orderTable.dateOfOrder,
                        dateOfDelivery: serviceParamObject.orderTable.dateOfDelivery,
                        totalPrice: serviceParamObject.orderTable.totalPrice
                    });

                return Promise.resolve(results);
            } catch (err) {
                logger.error(err);
                return Promise.reject(err);
            };
        };
        var updateItems = Array.isArray(serviceParamObject) ? serviceParamObject : [serviceParamObject];
        return new Promise(async (resolve, reject) => {
            try {
                let updates = await commonServiceMethods.updateMultipleInTrancsaction(updateItems, updateQuery, knex, transaction);
                resolve(updates);
            } catch (error) {
                reject(error);
            }
        });
    };
    app.locals.services.sellerOrderStatusQuery = sellerOrderStatusQuery;
};