const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/productConfirmationbySeller
     * @apiName productConfirmationbySeller
     * @apiGroup seller
     *
     * @apiParam sellerid
     * @apiParam productid
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/productConfirmationbySeller', handler.asyncFn(async (req, res, next) => {
        let results = await productConfirmationbySellerQuery(req.body.sellerid, req.body.productid, null, null);
        res.send(results);
    }));

    const productConfirmationbySellerQuery = async (sellerid, productid, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('ProductFullDetailsResponse.sellerid as sellerid', 'ProductFullDetailsResponse.brand as brand', 'ProductFullDetailsResponse.category as category', 'ProductFullDetailsResponse.price as productRealprice', 'ProductFullDetailsResponse.totalsale as totalsale', 'ProductFullDetailsResponse.isVerified as isVerified', 'ProductFullDetailsResponse.productquantity as productquantity', 'ProductFullDetailsResponse.description as description', 'ProductFullDetailsResponse.productName as productName', 'ProductFullDetailsResponse.size as size', 'ProductFullDetailsResponse.colour as colour', 'ProductFullDetailsResponse.returnPolicy as returnPolicy', 'ProductFullDetailsResponse.timeForReplacement as timeForReplacement', 'ProductFullDetailsResponse.termsAndCondition as termsAndCondition', 'ProductFullDetailsResponse.procductid as procductid', 'ProductFullDetailsResponse.image as image', 'CustomerOrderDetails.orderid as orderid', 'CustomerOrderDetails.productid as productid', 'CustomerOrderDetails.customerid as customerid', 'CustomerOrderDetails.orderStatus as orderStatus', 'CustomerOrderDetails.shippingAddress as shippingAddress', 'CustomerOrderDetails.deliveringAddress as deliveringAddress', 'CustomerOrderDetails.paymentid as paymentid', 'CustomerOrderDetails.deliveryCharge as deliveryCharge', 'CustomerOrderDetails.dateOfOrder as dateOfOrder', 'CustomerOrderDetails.dateOfDelivery as dateOfDelivery', 'CustomerOrderDetails.price as price').from('ProductFullDetailsResponse as ProductFullDetailsResponse');
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('ProductFullDetailsResponse.sellerid', '=', sellerid)
                .andWhere('CustomerOrderDetails.productid', '=', productid)
        })
        var queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, null, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };
    app.locals.services.productConfirmationbySellerQuery = productConfirmationbySellerQuery;
};