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
