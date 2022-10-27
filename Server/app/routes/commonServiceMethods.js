const _ = require('lodash');
const asyncLib = require('async');
const externalServiceClient = require('./externalServiceClient');
const logger = require(global.appRoot + '/app/log');
const BPromise = require('bluebird');

const knexFunctions = {
    "equal": null,
    "not equal": null,
    "in": "In",
    "not in": "NotIn",
    "begins with": null,
    "doesn't begins with": "Not",
    "contains": null,
    "doesn't contains": "Not",
    "ends with": null,
    "doesn't ends with": "Not",
    "is empty": null,
    "is not empty": null,
    "is null": "Null",
    "is not null": "NotNull",
    "less": null,
    "less or equal": null,
    "greater": null,
    "greater or equal": null,
    "between": "Between",
    "not between": "NotBetween"
};

const knexOperators = {
    "equal": "=",
    "not equal": "!=",
    "in": null,
    "not in": null,
    "begins with": "like",
    "doesn't begins with": "like",
    "contains": "like",
    "doesn't contains": "like",
    "ends with": "like",
    "doesn't ends with": "like",
    "is empty": null,
    "is not empty": null,
    "is null": null,
    "is not null": null,
    "less": "<",
    "less or equal": "<=",
    "greater": ">",
    "greater or equal": ">=",
    "between": null,
    "not between": null
};

const mappings = {
    "EXACT": "equal",
    "NOT_EQUAL": "not equal",
    "LESS_THAN": "less",
    "LESS_THAN_OR_EQUAL": "less or equal",
    "GREATER_THAN": "greater",
    "GREATER_THAN_OR_EQUAL": "greater or equal",
    "STARTS_WITH": "begins with",
    "ENDS_WITH": "ends with",
    "CONTAINS": "contains"
};

const updateMultipleInTrancsaction = async (updateItems, updateFunction, knex, transaction) => {
    var results = [];
    var processNext = async (item, trx1) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await updateFunction(item, trx1);
                if (result) { results.push({ result: result[0] }); }
                resolve(results);
            } catch (error) {
                reject(err);
            }
        });
    };

    if (transaction) {
        return new Promise(async (resolve, reject) => {
            try {
                await BPromise.map(updateItems, (updateItem) => {
                    return processNext(updateItem, transaction);
                });
                console.log("Transaction commit");
                resolve(updateItems.length > 1 ? results : results[0]);
            } catch (error) {
                console.log("Transaction rollback");
                console.log(error);
                reject(error);
            }
        });
    } else {
        if (updateItems && updateItems.length > 1) {
            return new Promise(async (resolve, reject) => {
                try {
                    knex.transaction(async (trx) => {
                        await BPromise.map(updateItems, (updateItem) => {
                            return processNext(updateItem, trx);
                        });
                        var resultData = updateItems.length > 1 ? results : results[0];
                        console.log("Transaction commit");
                        // trx.commit();
                        resolve(resultData);
                    });
                } catch (err) {
                    console.log("Transaction rollback");
                    console.error(err);
                    // trx.rollback(err);
                    reject(err);
                }
            });

        } else if (updateItems.length == 1) {
            try {
                let result = await updateFunction(updateItems[0], null);
                if (result) { results.push({ result: result[0] }); }
                return Promise.resolve(results);
            } catch (error) {
                return Promise.reject(error);
            }
        } else {
            return Promise.reject("Item not found");
        }
    }
};

const insertMultipleInTrancsaction = (req, res, next, insertItems, insertFunction) => {
    var currentIndex = -1;
    var processNext = (trx, callBack) => {
        currentIndex++;
        if (currentIndex < insertItems.length) {
            insertFunction(trx, (err) => {
                if (err) {
                    callBack(err)
                } else {
                    processNext(trx, callBack)
                }
            }, insertItems[currentIndex]);
        } else {
            callBack();
        }
    };
    knex.transaction((trx) => {
        //var trx = knex.transaction();
        processNext(trx,
            (err) => {
                if (err) {
                    if (trx) {
                        trx.rollback;
                    }
                    res.writeHead(500, 'Error');
                    res.end();
                } else {
                    if (trx) {
                        trx.commit;
                    }
                    res.writeHead(200);
                    res.end();
                }
            });
    })
        .then((resp) => {
            console.log('Transaction complete.');
        }).catch((err) => {
            console.error(err);
        });
};

const getChildSets = (childSets, parentResults, done) => {
    asyncLib.each(childSets, (set, callback) => {
        var resultsCallBack = (childResults) => {
            getChildResults(parentResults, childResults, set.joinConditions, set.columnName, set.isChildArray);
            callback();
        };
        set.args.push(resultsCallBack);
        execChildSet(set.childQueryFunction, set.args);
    }, (err) => {
        done();
    });
};

const execChildSet = (fn, args) => {
    fn = (typeof fn == "function") ? fn : window[fn]; // Allow fn to be a function object or the name of a global function
    return fn.apply(this, args || []); // args is optional, use an empty array by default
};

const getParentJoin = (query, parentQuery) => {
    if (parentQuery && parentQuery.query && parentQuery.joinConditions) {
        // var parentQueryCompiled = parentQuery.query.toSQL();
        query.join(parentQuery.query.as(parentQuery.queryName), () => {
            var self = this;
            _.each(parentQuery.joinConditions, (jc) => {
                self.on(parentQuery.queryName + "." + jc.leftColumn, '=', jc.rightEntityName + "." + jc.rightColumn);
            });
        });
        // var sql = query.toSQL();
        // var i = 0
    }
};

const getChildResults = (parentResults, childResults, joinConditions, propName, isChildArray) => {
    //when parentRecs is modified, parentResults has same reference.
    var parentRecs = {};
    _.each(parentResults.results, (parent) => {
        var key = "";
        _.each(joinConditions, (jc) => {
            key += parent[jc.leftColumn] ? parent[jc.leftColumn].toString().replace(/ /g, '') : "";
        });
        if (!parentRecs[key])
            parentRecs[key] = parent;
    });
    _.each(childResults.results, (child) => {
        var key = "";
        _.each(joinConditions, (jc) => {
            key += child[jc.rightColumn] ? child[jc.rightColumn].toString().replace(/ /g, '') : "";
        });
        if (!parentRecs[key][propName]) {
            if (isChildArray) {
                parentRecs[key][propName] = [];
            } else {
                parentRecs[key][propName] = {};
            }
        }
        if (parentRecs[key]) {
            if (isChildArray) {
                parentRecs[key][propName].push(child);
            } else {
                parentRecs[key][propName] = child;
            }
        }
    });
};

const getKnexOPForGridOP = (gridOP) => {
    if (gridOP) {
        var op = mappings[gridOP];
        if (op) return op;
    }
    return "equal";
};

const getResults = async (query, gridProperties, queryContainsOrderBy) => {
    return new Promise((resolve, reject) => {
        if (gridProperties && gridProperties.sortColumns && gridProperties.sortColumns.length > 0) {
            _.each(gridProperties.sortColumns, (col) => {
                query.orderBy(col.fieldName, col.order);
            });
        } else if (!queryContainsOrderBy) {
            query.orderByRaw("1");
        }
        if (gridProperties && gridProperties.pageNumber) {
            var pageSize = gridProperties.pageSize ? gridProperties.pageSize : 20;
            var cQuery = query.clone();
            if (cQuery._statements && cQuery._statements.length > 0) {
                for (var i = cQuery._statements.length - 1; i > -1; i--) {
                    if (cQuery._statements[i].grouping == "columns" || cQuery._statements[i].grouping == "order") {
                        //this statement is not good. no direct solution from knex
                        cQuery._statements.splice(i, 1);
                    }
                }
            }
            var countQuery = cQuery.count('* as count');
            countQuery.then((countResultsArr) => {
                var countResults = countResultsArr[0]['count'];
                if (countResults < offset) {
                    gridProperties.pageNumber = 1;
                }
                pageSize = gridProperties.pageSize ? gridProperties.pageSize : 20;
                var offset = (gridProperties.pageNumber - 1) * pageSize;
                query.limit(pageSize).offset(offset);
                query.then((results, err) => {
                    var resObj = {
                        results: results,
                        total: countResults,
                        pageNumber: gridProperties.pageNumber
                    };
                    resolve(resObj);
                }).catch((err) => {
                    reject(err);
                });
            });
        } else {
            query.limit(1000);
            query.then((results, err) => {
                var resObj = {
                    results: results,
                    total: (results && Array.isArray(results) ? results.length : (results ? 1 : 0)),
                    pageNumber: 1
                };
                resolve(resObj);
            }).catch((err) => {
                reject(err);
            });
        }
    });
};

const getResultsNative = async (query, gridProperties, queryContainsOrderBy) => {
    return new Promise((resolve, reject) => {
        query.then((nativeResults, err) => {
            var results = nativeResults.length == 2 && Array.isArray(nativeResults[0]) && Array.isArray(nativeResults[1]) ?
                nativeResults[0] : nativeResults;
            var resObj = {
                results: results,
                total: (results && Array.isArray(results) ? results.length : (results ? 1 : 0)),
                pageNumber: 1
            };
            resolve(resObj);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getGridSortAndPaging = async (query, gridProperties) => {
    if (gridProperties && gridProperties.sortColumns && gridProperties.sortColumns.length > 0) {
        _.each(gridProperties.sortColumns, (col) => {
            query.orderBy(col.fieldName, col.order);
        });
    }
    if (gridProperties && gridProperties.pageNumber) {
        var pageSize = gridProperties.pageSize ? gridProperties.pageSize : 20;
        query.limit(pageSize).offset((gridProperties.pageNumber - 1) * pageSize);
    }
    return query;
};

const getGridFilters = (query, isWherAlreadyAdded, gridProperties) => {
    if (gridProperties) {
        if (!gridProperties.filters) {
            gridProperties.filters = [];
        }
        for (var prop in gridProperties) {
            if (prop != 'name' && prop != 'filters' && prop != 'sortColumns' && prop != 'pageNumber' && prop != 'pageSize' && prop != 'totalItems') {
                if (gridProperties.hasOwnProperty(prop) && gridProperties[prop] && gridProperties[prop].toString().length > 0) {
                    gridProperties.filters.push({
                        fieldName: prop,
                        condition: 'EXACT',
                        term: gridProperties[prop]
                    });
                }
            }
        }
        if (gridProperties.filters.length > 0) {
            getGridFilterCondtions(query, gridProperties, isWherAlreadyAdded);
        }
    }
    return query;
};

const getGridFilterCondtions = (query, gp, isWherAlreadyAdded) => {
    if (gp) {
        _.each(gp.filters, (filter, i) => {
            var op = getKnexOPForGridOP(filter.condition);
            var prefix = "";
            var suffix = "";
            if (knexOperators[op] == "like") {
                if (op.indexOf("begins") >= 0) {
                    suffix = "%";
                } else if (op.indexOf("contains") >= 0) {
                    prefix = "%";
                    suffix = "%";
                } else if (op.indexOf("ends") >= 0) {
                    prefix = "%";
                }
            }

            if (isWherAlreadyAdded) {
                query.andWhere(filter.fieldName, knexOperators[op], prefix + filter.term + suffix);
            } else {
                query.where(filter.fieldName, knexOperators[op], prefix + filter.term + suffix);
            }
        });
    }
};

module.exports = {
    updateMultipleInTrancsaction,
    insertMultipleInTrancsaction,
    getChildSets,
    execChildSet,
    getParentJoin,
    getChildResults,
    getKnexOPForGridOP,
    getResults,
    getResultsNative,
    getGridSortAndPaging,
    getGridFilters,
    getGridFilterCondtions,
    mappings,
    knexFunctions,
    knexOperators
};

