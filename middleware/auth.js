const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    return next()
  }
  req.flash('warning_msg', '請先登入!')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    if (getUser(req).role) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
