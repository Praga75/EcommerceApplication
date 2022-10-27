
module.exports = (acl) => {
    acl.authorizeRoute = (permission) => {
        return (req, res, next) => {
            var parts = permission.split('::');
            if (parts.length == 2) {
                acl.isAllowed(req.user.UserName, parts[0], parts[1], (err, allowed) => {
                    if (!err && allowed) {
                        next();
                    }
                    else {
                        if (req.headers['authorization']) {
                            res.status(401);
                            res.end();
                        }
                        else {
                            return res.status(403).redirect("/login");
                        }
                    }
                });
            }
            else {
                if (req.headers['authorization']) {
                    res.status(401);
                    res.end();
                }
                else {
                    return res.status(403).redirect("/login");
                }
            }
        };
    };
};
