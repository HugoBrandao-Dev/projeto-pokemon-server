const express = require('express')
const app = express()
const DATABASE = require('./database/connection.js')

app.get("/register", (req, res) => {
  DATABASE.insert({
    full_name: 'Tobias de Oliveira',
    born_date: '2023-03-15',
    email: 'josias@gmail.com',
    user_password: 'tobias123'
  }).into('users')
    .then(response => {
      res.send('Usuário inserido com sucesso.')
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