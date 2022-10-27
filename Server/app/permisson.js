module.exports = (acl, permission) => {
    const isAllowed = (req, cb) => {
        let permissions = permission.split("::"); //example employee::edit
        if (permissions.length != 2 || !req.user || !req.user.userName || req.user.userName.length == 0) {
            return Promise.reject(false);
        }
        else {
            try {
                //Compare and check 
                acl.isAllowed(req.user.userName, permissions[0], permissions[1], (err, res) => {
                    return Promise.resolve(!err && res);
                });
            } catch (error) {
                return Promise.reject(false);
            }
        }
    }
    // return a middleware
    return (req, res, next) => {
        isAllowed(req)
            .then(permitted => {
                next(); // user is allowed, so continue on the next middleware
            }).catch(err => {
                res.status(403).json({ message: "Forbidden" }); // user is forbidden
            });
    }
}
