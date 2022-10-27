const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/prodetailbyid
     * @apiName prodetailbyid
     * @apiGroup databyid
     *
     * @apiParam id
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */


    app.post('/api/prodetailbyid', handler.asyncFn(async (req, res, next) => {
        let results = await prodetailbyidQuery(req.body.id, null, null);
        res.send(results);
    }));

    const prodetailbyidQuery = async (id, parentQuery, trx) => {
        let knexTrx = trx ? knex.transacting(trx) : knex;
        let query = knexTrx.select('SellerAddress2.sellerid as sellerid', 'SellerAddress2.addressOne as addressOne', 'SellerAddress2.addressTwo as addressTwo', 'SellerAddress2.city as city', 'SellerAddress2.state as state', 'SellerAddress2.pincode as pincode', 'SellerAddress2.country as country', 'SellerAddress2.isPrimary as isPrimary', 'sellerProduct.productid as productid', 'sellerProduct.brand as brand', 'sellerProduct.category as category', 'sellerProduct.price as price', 'sellerProduct.totalsale as totalsale', 'sellerProduct.isVerified as isVerified', 'sellerProduct.productquantity as productquantity', 'SellerProductSpecification.description as description', 'SellerProductSpecification.productName as productName', 'SellerProductSpecification.size as size', 'SellerProductSpecification.colour as colour', 'SellerProductSpecification.returnPolicy as returnPolicy', 'SellerProductSpecification.timeForReplacement as timeForReplacement', 'SellerProductSpecification.termsAndCondition as termsAndCondition', 'SellerProductImages.image as image').from('SellerAddress2 as SellerAddress2').innerJoin('SellerProductSpecification as SellerProductSpecification', function() {
            this.on('sellerProduct.productid', '=', 'SellerProductSpecification.productid')
        }).innerJoin('SellerProductImages as SellerProductImages', function() {
            this.on('sellerProduct.productid', '=', 'SellerProductImages.procductid')
        }).innerJoin(' as ', function() {
            this.on('sellerProduct.sellerid', '=', 'SellerAddress2.sellerid')
        });
        if (parentQuery) {
            commonServiceMethods.getParentJoin(query, parentQuery);
        }
        var isWhereAlreadyAdded = true;
        query.where(function() {
            this.where('sellerProduct.productid', '=', id)
                .andWhere('sellerProduct.isVerified', '=', 'Active')
        })
        var queryContainsOrderBy = false;
        try {
            let results = await commonServiceMethods.getResults(query, null, queryContainsOrderBy);
            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    };
    app.locals.services.prodetailbyidQuery = prodetailbyidQuery;
};