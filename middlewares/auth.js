const jwt = require('jsonwebtoken')

const secret = 'qwuirlsklaflks23'

function authentication(req, res, next) {
  const authToken = req.headers['authorization']

  if (authToken) {
    const bearer = authToken.split(' ')
    const token = bearer[1]
    try {
      let decoded = jwt.verify(token, secret)

      if (decoded) {
        next()
      }
    } catch (error) {
      console.error(error)
      res.json({
        errorField: 'token',
        msg: 'Token inválido.'
      })
    }
  } else {
    res.json({
      errorField: 'token',
      msg: 'Faça o login.'
    })
  }
}

module.exports = authentication