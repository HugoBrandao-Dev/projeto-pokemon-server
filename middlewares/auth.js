function authentication(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.send('Faça o login.')
  }
}

module.exports = authentication