const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/selectSellerProductByID76501
     * @apiName selectSellerProductByID76501
     * @apiGroup sellerProduct
     *
     * @apiParam searching
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/selectSellerProductByID76501', handler.asyncFn(async (req, res, next) => {
        let results = await selectSellerProductByID76501Query(req.body.searching, null, null);
        res.send(results);
    }));

    const selectSellerProductByID76501Query = async (searching, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('sellerProduct.sellerid as sellerid', 'sellerProduct.brand as brand', 'sellerProduct.category as category', 'sellerProduct.price as price', 'sellerProduct.totalsale as totalsale', 'sellerProduct.isVerified as isVerified', 'sellerProduct.productquantity as productquantity', 'SellerProductSpecification.productid as productid', 'SellerProductSpecification.description as description', 'SellerProductSpecification.productName as productName', 'SellerProductSpecification.size as size', 'SellerProductSpecification.colour as colour', 'SellerProductSpecification.returnPolicy as returnPolicy', 'SellerProductSpecification.timeForReplacement as timeForReplacement', 'SellerProductSpecification.termsAndCondition as termsAndCondition', 'SellerProductImages.procductid as procductid', 'SellerProductImages.image as image').from('sellerProduct as sellerProduct').innerJoin('SellerProductSpecification as SellerProductSpecification', function() {
            this.on('sellerProduct.productid', '=', 'SellerProductSpecification.productid')
        }).innerJoin('SellerProductImages as SellerProductImages', function() {
            this.on('sellerProduct.productid', '=', 'SellerProductImages.procductid')
        });
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('sellerProduct.category', '=', searching)
                .andWhere('sellerProduct.isVerified', '=', 'Active')
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
    app.locals.services.selectSellerProductByID76501Query = selectSellerProductByID76501Query;
};