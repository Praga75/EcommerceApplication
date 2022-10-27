const _ = require('lodash');
const handler = require(global.appRoot + '/app/handler');
const externalServiceClient = require(global.appRoot + '/app/routes/externalServiceClient');
const commonServiceMethods = require(global.appRoot + '/app/routes/commonServiceMethods');
const permitOperation = require(global.appRoot + '/app/permisson');
const logger = require(global.appRoot + '/app/log');
module.exports = (app, knex, acl) => {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/updatestatus
     * @apiName updatestatus
     * @apiGroup notverify
     *
     * @apiParam data
     *
     * @apiSuccess {Object/Array} results
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       'info': 'Success'
     *     }
     */

    app.post('/api/updatestatus', handler.asyncFn(async (req, res, next) => {
        let results = await updatestatusQuery(req.body, null)
        res.send(JSON.stringify(results));
    }));

    const updatestatusQuery = async (data, transaction) => {
        let serviceParamObject = {
            
            sellerProduct:sellerProduct.Productid,
            sellerProduct:sellerProduct.isVerified,
        };
        console.log(data);
       
        // return Promise.resolve({success:true});


        let updateQuery = async (serviceParamObject, trx) => {
            try {
                let knexTrx = trx ? knex('sellerProduct').transacting(trx) : knex('sellerProduct');
                let results = await knexTrx.where('productid', serviceParamObject.sellerProduct.Productid)
                    .returning('*')
                    .update({
                        isVerified: serviceParamObject.sellerProduct.isVerified
                        
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
    app.locals.services.updatestatusQuery = updatestatusQuery;
};