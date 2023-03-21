const express = require('express')
const app = express()

const session = require('express-session')
const validator = require('validator')

const DATABASE = require('./database/connection.js')
const acceptableCharacters = {
  inPassword: '.@#%&*!@_',
  inName: ' -\''
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(session({
  secret: "nioqwecvxopqwer547qwqer5",
  cookie: {
    maxAge: 86400000 // 1 dia
  }
}))

app.post('/login', (req, res) => {
  let email = req.body.email
  let user_password = req.body.user_password

  let is_email_OK = validator.isEmail(email)
  let is_user_password_OK = validator.isAlphanumeric(user_password, ['pt-BR'], {
    ignore: acceptableCharacters.inPassword
  })

  if (is_email_OK && is_user_password_OK) {
    DATABASE.select().where({ email }).table('users')
    .then(response => {
      if (response.length) {
        let user = response[0]
        if (user.user_password === user_password) {
          req.session.user = {
            id: user.id,
            full_name: user.full_name,
            born_date: user.born_date,
            email: user.email
          }
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
  } else {
    if (!is_email_OK) {
      res.send('Email inválido.')
    }
    if (!is_user_password_OK) {
      res.send('Senha inválida.')
    }
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.send('Usuário deslogado com sucesso.')
})

app.post("/register", (req, res) => {
  let full_name = req.body.full_name
  let born_date = req.body.born_date
  let email = req.body.email
  let user_password = req.body.user_password

  let is_full_name_OK = validator.isAlpha(full_name, ['pt-BR'], {
    ignore: acceptableCharacters.inName
  })
  let is_email_OK = validator.isEmail(email)
  let is_born_date_OK = validator.isDate(born_date)
  let is_user_password_OK = validator.isAlphanumeric(user_password, ['pt-BR'], {
    ignore: acceptableCharacters.inPassword
  })

  if (is_full_name_OK && is_email_OK && is_born_date_OK && is_user_password_OK) {
    DATABASE.insert({
    full_name,
    born_date,
    email,
    user_password
    })
    .into('users')
      .then(response => {
        res.send('Usuário cadastrado com sucesso.')
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    if (!is_full_name_OK) {
      res.send('Nome inválido.')
    }
    if (!is_email_OK) {
      res.send('Email inválido.')
    }
    if (!is_born_date_OK) {
      res.send('Data de nascimento inválida.')
    }
    if (!is_user_password_OK) {
      res.send('Senha inválida.')
    }
  }
})

app.post('/capture', (req, res) => {
  // ID do usuário que capturou o pokemon, geralmente o próprio usuário que estará logado na sessão.
  let user_id = req.body.user_id

  // Informações do pokemon a serem cadastradas.
  let chain_id = req.body.chain_id
  let evolution_id = req.body.evolution_id
  let experience_plus = req.body.experience_plus

  // Validando campos
  let is_user_id_OK = validator.isInt(user_id, {
    min: 1,
    allow_leading_zeroes: false
  })
  let is_chain_id_OK = validator.isInt(chain_id, {
    min: 1,
    allow_leading_zeroes: false
  })
  let is_evolution_id_OK = validator.isInt(evolution_id, {
    min: 1,
    max: 3,
    allow_leading_zeroes: false
  })
  let is_experience_plus_OK = validator.isInt(experience_plus, {
    allow_leading_zeroes: false
  })

  if (is_user_id_OK && is_chain_id_OK && is_evolution_id_OK && is_experience_plus_OK) {
    async function capturePokemon() {
      try {
        let pokemon_id = await DATABASE.insert({ chain_id, evolution_id, experience_plus }) .into('captured_pokemons')
        await DATABASE.insert({ user_id, pokemon_id}).into('users_pokemons')
        res.send('Pokemon capturado com sucesso.')
      } catch (error) {
        console.log(error)
      }
    }

    capturePokemon()
  } else {
    if (!is_user_id_OK) {
      res.send('ID do usuário inválido.')
    }
    if (!is_chain_id_OK) {
      res.send('ID da chain inválido.')
    }
    if (!is_evolution_id_OK) {
      res.send('ID da evolução inválido.')
    }
    if (!is_experience_plus_OK) {
      res.send('Valor da experiência adicional está inválido.')
    }
  }
})

/*
Essa rota é responsável por alterar as informações do pokemon, podendo ser usada tanto para acrescentar Exp, quanto para evoluir o pokemon.
*/
app.post('/upgradePokemon', (req, res) => {
  // A atualização dos status, tem como base o ID do pokemon
  let id = req.body.id

  // Informações do pokemon a serem atualizadas.
  let evolution_id = req.body.evolution_id
  let experience_plus = req.body.experience_plus

  // Validando campos
  let is_id_OK = validator.isInt(id, {
    min: 1,
    allow_leading_zeroes: false
  })
  let is_evolution_id_OK = validator.isInt(evolution_id, {
    min: 1,
    max: 3,
    allow_leading_zeroes: false
  })
  let is_experience_plus_OK = validator.isInt(experience_plus, {
    allow_leading_zeroes: false
  })

  if (is_id_OK && is_evolution_id_OK && is_experience_plus_OK) {
    DATABASE.update({ evolution_id, experience_plus }).where({ id }).table('captured_pokemons')
      .then(response => {
        res.send('Informações do pokemon atualizadas com sucesso.')
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    if (!is_id_OK) {
      res.send('ID do pokemon inválido.')
    }
    if (!is_evolution_id_OK) {
      res.send('ID da evolução inválido.')
    }
    if (!is_experience_plus_OK) {
      res.send('Valor da experiência adicional está inválido.')
    }
  }
})

// Faz a listagem de pokemons que o usuário já capturou.
app.get('/user/:id/pokemons', (req, res) => {
  let user_id = req.params.id

  // Validando campos
  let is_user_id_OK = validator.isInt(user_id, {
    min: 1,
    allow_leading_zeroes: false
  })

  if (is_user_id_OK) {
    DATABASE.select([
    'captured_pokemons.id',
    'captured_pokemons.chain_id',
    'captured_pokemons.evolution_id',
    'captured_pokemons.experience_plus']).table('users_pokemons')
    .innerJoin('captured_pokemons', 'captured_pokemons.id', 'users_pokemons.pokemon_id')
    .where({ 'users_pokemons.user_id': user_id })
      .then(response => {
        res.send(response)
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    if (!is_user_id_OK) {
      res.send('ID do usuário inválido.')
    }
  }
})

app.get('user/pokemon/:id', (req, res) => {
  let pokemon_id = req.params.id

  // Validando campos
  let is_pokemon_id_OK = validator.isInt(pokemon_id, {
    min: 1,
    allow_leading_zeroes: false
  })

  if (is_pokemon_id_OK) {
    DATABASE.select([
      "captured_pokemons.id",
      "captured_pokemons.chain_id",
      "captured_pokemons.evolution_id",
      "captured_pokemons.experience_plus",
      "users_pokemons.user_id"
    ])
    .table('captured_pokemons')
    .innerJoin('users_pokemons', 'users_pokemons.pokemon_id', 'captured_pokemons.id')
    .where({ 'captured_pokemons.id': pokemon_id })
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
    } else {
      res.send('O ID do pokemon é inválido.')
    }
})

/*
Faz a busca pelas quantidades de cada pokebola que o usuário possui.
id: ID do usuário.
*/
app.get('/user/:id/balls', (req, res) => {
  let user_id = req.params.id

  // Validando campos
  let is_user_id_OK = validator.isInt(user_id, {
    min: 1,
    allow_leading_zeroes: false
  })

  if (is_user_id_OK) {
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
  } else {
    res.send('O ID do usuário é inválido.')
  }
})


app.post('/balls', (req, res) => {
  let user_id = req.body.id
  let poke_ball = req.body['poke-ball']
  let great_ball = req.body['great-ball']
  let ultra_ball = req.body['ultra-ball']
  let master_ball = req.body['master-ball']

  // Validando campos
  let is_user_id_OK = validator.isInt(user_id, {
    min: 1,
    allow_leading_zeroes: false
  })
  let is_poke_ball_OK = validator.isInt(poke_ball, {
    allow_leading_zeroes: false
  })
  let is_great_ball_OK = validator.isInt(great_ball, {
    allow_leading_zeroes: false
  })
  let is_master_ball_OK = validator.isInt(ultra_ball, {
    allow_leading_zeroes: false
  })
  let is_ultra_ball_OK = validator.isInt(master_ball, {
    allow_leading_zeroes: false
  })

  if (is_user_id_OK && is_poke_ball_OK && is_great_ball_OK && is_ultra_ball_OK && is_master_ball_OK) {
    async function setBallsAmount() {
      try {
        await DATABASE.update({ amount: poke_ball })
        .where({ user_id, item_id: 1 })
        .table('users_items')

        await DATABASE.update({ amount: great_ball })
        .where({ user_id, item_id: 2 })
        .table('users_items')

        await DATABASE.update({ amount: ultra_ball })
        .where({ user_id, item_id: 3 })
        .table('users_items')

        await DATABASE.update({ amount: master_ball })
        .where({ user_id, item_id: 4 })
        .table('users_items')

      } catch (error) {
        console.log(error)
      }
    }

    setBallsAmount()
      .then(response => {
        res.send("Informações de poke-bolas guardadas.")
      })
      .catch(error => {
        res.send("Erro ao guardada informações das poke-bolas.")
      })
  } else {
    if (!is_user_id_OK) {
      res.send('O ID do usuário é inválido.')
    }
    if (!is_poke_ball_OK) {
      res.send('A quantidade de POKE BALL é inválida.')
    }
    if (!is_great_ball_OK) {
      res.send('A quantidade de GREAT BALL é inválida.')
    }
    if (!is_ultra_ball_OK) {
      res.send('A quantidade de ULTRA BALL é inválida.')
    }
    if (!is_master_ball_OK) {
      res.send('A quantidade de MASTER BALL é inválida.')
    }
  }
})

/*
Faz a busca pelas quantidades de cada fruta que o usuário possui.
id: ID do usuário.
*/
app.get('/user/:id/fruits', (req, res) => {
  let user_id = req.params.id

  let is_user_id_OK = validator.isInt(user_id, {
    min: 1,
    allow_leading_zeroes: false
  })

  if (is_user_id_OK) {
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
  } else {
    res.send('O ID do usuário é inválido.')
  }
})

app.post('/fruits', (req, res) => {
  let user_id = req.body.id
  let jaboca_berry = req.body['jaboca-berry']
  let razz_berry = req.body['razz-berry']
  let bluk_berry = req.body['bluk-berry']

  // Validando campos
  let is_user_id_OK = validator.isInt(user_id, {
    min: 1,
    allow_leading_zeroes: false
  })
  let is_jaboca_berry_OK = validator.isInt(jaboca_berry, {
    allow_leading_zeroes: false
  })
  let is_razz_berry_OK = validator.isInt(razz_berry, {
    allow_leading_zeroes: false
  })
  let is_bluk_berry_OK = validator.isInt(bluk_berry, {
    allow_leading_zeroes: false
  })

  if (is_user_id_OK && is_jaboca_berry_OK && is_razz_berry_OK && is_bluk_berry_OK) {
    async function setFruitsAmount() {
      try {
        await DATABASE.update({ amount: req.body['jaboca-berry'] })
        .where({ user_id, item_id: 5 })
        .table('users_items')

        await DATABASE.update({ amount: req.body['razz-berry'] })
        .where({ user_id, item_id: 6 })
        .table('users_items')

        await DATABASE.update({ amount: req.body['bluk-berry'] })
        .where({ user_id, item_id: 7 })
        .table('users_items')

      } catch (error) {
        console.log(error)
      }
    }

    setFruitsAmount()
      .then(response => {
        res.send("Informações de frutas guardadas.")
      })
      .catch(error => {
        res.send("Erro ao guardada informações das frutas.")
      })
  } else {
    if (!is_user_id_OK) {
      res.send('O ID do usuário é inválido.')
    }
    if (!is_jaboca_berry_OK) {
      res.send('A quantidade de JABOCA BERRY é inválida.')
    }
    if (!is_razz_berry_OK) {
      res.send('A quantidade de RAZZ BERRY é inválida.')
    }
    if (!is_bluk_berry_OK) {
      res.send('A quantidade de BLUK BERRY é inválida.')
    }
  }
})

app.listen(4000, error => {
  if (error) {
    console.error('Erro no servidor.')
  } else {
    console.log('Servidor iniciado com sucesso.')
  }
})