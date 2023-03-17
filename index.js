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
  let id = 1
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

app.get('/pokemons', (req, res) => {
  let id_user = 1

  DATABASE.select([
    'captured_pokemons.id',
    'captured_pokemons.chain_id',
    'captured_pokemons.evolution_id',
    'captured_pokemons.experience_plus']).table('users_pokemons')
  .innerJoin('captured_pokemons', 'captured_pokemons.id', 'users_pokemons.pokemon_id')
  .where({ 'users_pokemons.user_id': id_user })
    .then(response => {
      if (response.length) {
        let pokemons = response[0]
        res.send(pokemons)
      } else {
        res.send('O usuário não tem pokemons.')
      }
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/pokemon/:id', (req, res) => {
  let pokemon_id = req.params.id

  DATABASE.select().table('captured_pokemons').where({ 'captured_pokemons.id': pokemon_id })
    .then(response => {
      if (response.length) {
        let pokemon = response[0]
        res.send(pokemon)
      } else {
        res.send('Pokemon não encontrado.')
      }
    })
    .catch(error => {
      console.log(error)
    })
})

// O id é o ID do usuário.
app.get('/balls/:id', (req, res) => {
  let user_id = req.params.id

  DATABASE.select([
    'items.id',
    'items.item',
    'users_items.amount'
  ]).table('users_items')
  .innerJoin('items', 'items.id', 'users_items.item_id')
  .innerJoin('items_types', 'items_types.id', 'items.type_id')
  .where({'users_items.user_id': user_id, 'items_types.type_name': 'ball'})
    .then(response => {
      if (response.length) {
        res.send(response)
      } else {
        res.send('Usuário não possui poke-bolas.')
      }
    })
})

// O id é o ID do usuário.
app.get('/fruits/:id', (req, res) => {
  let user_id = req.params.id

  DATABASE.select([
    'items.id',
    'items.item',
    'users_items.amount'
  ]).table('users_items')
  .innerJoin('items', 'items.id', 'users_items.item_id')
  .innerJoin('items_types', 'items_types.id', 'items.type_id')
  .where({'users_items.user_id': user_id, 'items_types.type_name': 'fruit'})
    .then(response => {
      if (response.length) {
        res.send(response)
      } else {
        res.send('Usuário não possui frutas.')
      }
    })
})

app.listen(4000, error => {
  if (error) {
    console.error('Erro no servidor.')
  } else {
    console.log('Servidor iniciado com sucesso.')
  }
})