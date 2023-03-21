function authentication(req, res, next) {
  if (req.session.user) {
    next()
  }
}

module.exports = authentication