exports.authorizeAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/signin");
};

exports.redirectAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/page");
  }
  return next();
};

exports.authorizeMember = (req, res, next) => {
  if (req.user.isMember) {
    return next();
  }
  return res.redirect("/user/page");
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }

  res.redirect("/user/page");
};
exports.authorizeAuthenticatedAdmin = (req, res, next) => {
  if (req.user.isAuthenticatedAdmin) {
    return next();
  }
  res.redirect("/user/admin-pass");
};
exports.redirectAuthenticatedAdmin = (req, res, next) => {
  if (req.user.isAuthenticatedAdmin) {
    return res.redirect("/admin/page");
  }
  return next();
};
