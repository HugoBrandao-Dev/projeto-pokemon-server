const express = require('express')
const app = express()
const DATABASE = require('./database/connection.js')

let FAKE_FORMS = {
  forLogin: [{
    email: 'tobias@gmail.com',
    user_password: 'tobias123'
  }],
  forRegister: [{
    full_name: 'Tobias de Oliveira',
    born_date: '1975-03-15',
    email: 'tobias@gmail.com',
    user_password: 'tobias123'
  }]
}

app.get('/login', (req, res) => {
  let email = FAKE_FORMS.forLogin[0].email
  let user_password = FAKE_FORMS.forLogin[0].user_password

  DATABASE.select(['email', 'user_password']).where({ email }).table('users')
    .then(response => {
      if (response.length) {
        let user = response[0]
        if (user.user_password === user_password) {
          res.send('Logado com sucesso.')
        } else {
          res.send('Senha inválida.')
        }
      } else {
        res.send('Usuário não encontrado.')
      }
    })
    .catch(error => {
      console.log(error)
    })
})

app.get("/register", (req, res) => {
  DATABASE.insert(FAKE_FORMS.forRegister[0]).into('users')
    .then(response => {
      res.send('Usuário cadastrado com sucesso.')
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/capture', (req, res) => {
  let id = 0
  let pokemon = {
    chain_id: 1,
    evolution_id: 1,
    experience_plus: 50
  }
  DATABASE.insert(pokemon).into('captured_pokemons')
    .then(responsePokemon => {
      let pokemon_id = responsePokemon[0]
      DATABASE.insert({ user_id: id, pokemon_id}).into('users_pokemons')
        .then(responseCapture => {
          res.send('Pokemon cadastrado com sucesso.')
        })
        .catch(error => {
          console.log(error)
        })
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