const express = require('express')
const app = express()
const DATABASE = require('./database/connection.js')

let FAKE_FORMS = {
  forLogin: [{
    email: 'tobias@gmail',
    user_password: 'tobias'
  }],
  forRegister: [{
    full_name: 'Tobias de Oliveira',
    born_date: '1975-03-15',
    email: 'tobias@gmail.com',
    user_password: 'tobias123'
  }]
}

app.get("/register", (req, res) => {
  DATABASE.insert(FAKE_FORMS.forRegister[0]).into('users')
    .then(response => {
      res.send('Usuário cadastrado com sucesso.')
    })
    .catch(error => {
      console.log(error)
    })
})

app.listen(4000, error => {
  if (error) {
    console.error('Erro no servidor.')
  } else {
    console.log('Servidor iniciado com sucesso.')
  }
})