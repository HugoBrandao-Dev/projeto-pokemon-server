const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

const session = require('express-session')

// Bibliotecas
const validator = require('validator')
const bcrypt = require('bcryptjs')

const DATABASE = require('./database/connection.js')
const auth = require('./middlewares/auth.js')
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
        if (bcrypt.compareSync(user_password, user.user_password)) {
          req.session.user = {
            id: user.id,
            full_name: user.full_name,
            born_date: user.born_date,
            email: user.email
          }
          res.json({ errorField: '' })
        } else {
          res.json({ errorField: 'iptPassword', msg: 'Senha inválida.' })
        }
      } else {
        res.json({ errorField: 'iptLogin', msg: 'Email não cadastrado.' })
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
  res.json({ errorField: '' })
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
    async function registerUser() {
      try {
        // Busca um email igual
        let resEmail = await DATABASE.select().where({ email }).table('users')

        // Verifica se já o email já foi cadastrado.
        if (resEmail.length) {
          res.json({ errorField: 'iptEmail', msg: 'Email já cadastrado' })
        } else {
          let salt = bcrypt.genSaltSync(8)

          let password_hash = bcrypt.hashSync(user_password, salt)

          await DATABASE.insert({
            full_name,
            born_date,
            email,
            user_password: password_hash
          })
          .into('users')

          res.json({ errorField: '' })
        }
      } catch (error) {
        console.error(error)
      }
    }
    registerUser()
  } else {
    if (!is_full_name_OK) {
      res.json({ errorField: 'iptName', msg: 'Nome inválido.' })
    }
    if (!is_email_OK) {
      res.json({ errorField: 'iptEmail', msg: 'Email inválido.' })
    }
    if (!is_born_date_OK) {
      res.json({ errorField: 'iptBornDate', msg: 'Data de nascimento inválida.' })
    }
    if (!is_user_password_OK) {
      res.json({ errorField: 'iptPassword', msg: 'Senha inválida.' })
    }
  }
})

app.post('/capture', auth, (req, res) => {

  // Informações do pokemon a serem cadastradas.
  let chain_id = req.body.chain_id
  let evolution_id = req.body.evolution_id
  let experience_plus = req.body.experience_plus

  // Validando campos
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

  if (is_chain_id_OK && is_evolution_id_OK && is_experience_plus_OK) {
    async function capturePokemon() {
      try {
        let pokemon_id = await DATABASE.insert({
          chain_id,
          evolution_id,
          experience_plus
        }).into('captured_pokemons')

        await DATABASE.insert({
          user_id: req.session.user.id,
          pokemon_id
        }).into('users_pokemons')

        res.json({ errorField: '' })
      } catch (error) {
        console.error(error)
      }
    }

    capturePokemon()
  } else {
    if (!is_chain_id_OK) {
      res.json({
        errorField: 'chain_id',
        msg: 'O ID da chain é inválido.'
      })
    }
    if (!is_evolution_id_OK) {
      res.json({
        errorField: 'evolution_id',
        msg: 'O ID da evolução é inválido.'
      })
    }
    if (!is_experience_plus_OK) {
      res.json({
        errorField: 'experience_plus',
        msg: 'O valor da experiencia adicional é inválido.'
      })
    }
  }
})

/*
Essa rota é responsável por alterar as informações do pokemon, podendo ser usada tanto para acrescentar Exp, quanto para evoluir o pokemon.
*/
app.post('/upgradePokemon', auth, (req, res) => {
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
        res.json({ errorField: '' })
      })
      .catch(error => {
        console.log(error)
      })
  } else {
    if (!is_id_OK) {
      res.json({
        errorField: 'id',
        msg: 'O ID do pokemon é inválido.'
      })
    }
    if (!is_evolution_id_OK) {
      res.json({
        errorField: 'evolution_id',
        msg: 'O ID da evolução é inválido.'
      })
    }
    if (!is_experience_plus_OK) {
      res.json({
        errorField: 'experience_plus',
        msg: 'O valor da experiencia adicional é inválido.'
      })
    }
  }
})

// Faz a listagem de pokemons que o usuário já capturou.
app.get('/user/pokemons', auth, (req, res) => {
  DATABASE.select([
    'captured_pokemons.id',
    'captured_pokemons.chain_id',
    'captured_pokemons.evolution_id',
    'captured_pokemons.experience_plus'
  ]).table('users_pokemons')
  .innerJoin('captured_pokemons', 'captured_pokemons.id', 'users_pokemons.pokemon_id')
  .where({ 'users_pokemons.user_id': req.session.user.id })
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.error(error)
    })
})

app.get('/user/pokemon/:id', auth, (req, res) => {
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
    .where({ 'captured_pokemons.id': pokemon_id, 'users_pokemons.user_id': req.session.user.id })
      .then(response => {
        if (response.length) {
          let pokemon = response[0]
          res.json(pokemon)
        } else {
          res.json({
            errorField: 'pokemon_id',
            msg: 'Pokemon não encontrado.'
          })
        }
      })
      .catch(error => {
        console.error(error)
      })
    } else {
      res.json({
        errorField: 'pokemon_id',
        msg: 'O ID do pokemon é inválido.'})
    }
})

/*
Faz a busca pelas quantidades de cada pokebola que o usuário possui.
id: ID do usuário.
*/
app.get('/user/balls', auth, (req, res) => {
  DATABASE.select([
    'items.id',
    'items.item',
    'users_items.amount'
  ]).table('users_items')
  .innerJoin('items', 'items.id', 'users_items.item_id')
  .innerJoin('items_types', 'items_types.id', 'items.type_id')
  .where({'users_items.user_id': req.session.user.id, 'items_types.type_name': 'ball'})
    .then(response => {
      if (response.length) {
        res.json(response)
      } else {
        res.json({
          msg: 'Usuário não possui poke-bolas.'
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
})


app.post('/balls', auth, (req, res) => {
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
        console.error(error)
      }
    }

    setBallsAmount()
      .then(response => {
        res.json({
          errorField: '',
          msg: "Informações de poke-bolas guardadas."
        })
      })
      .catch(error => {
        res.json({
          errorField: '',
          msg: "Erro ao guardada informações das poke-bolas."
        })
      })
  } else {
    if (!is_user_id_OK) {
      res.json({
        errorField: 'id',
        msg: 'O ID do usuário é inválido.'})
    }
    if (!is_poke_ball_OK) {
      res.json({
        errorField: 'poke-ball',
        msg: 'A quantidade de POKE BALL é inválida.'})
    }
    if (!is_great_ball_OK) {
      res.json({
        errorField: 'great-ball',
        msg: 'A quantidade de GREAT BALL é inválida.'})
    }
    if (!is_ultra_ball_OK) {
      res.json({
        errorField: 'ultra-ball',
        msg: 'A quantidade de ULTRA BALL é inválida.'})
    }
    if (!is_master_ball_OK) {
      res.json({
        errorField: 'master-ball',
        msg: 'A quantidade de MASTER BALL é inválida.'})
    }
  }
})

/*
Faz a busca pelas quantidades de cada fruta que o usuário possui.
id: ID do usuário.
*/
app.get('/user/:id/fruits', auth, (req, res) => {
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
          res.json(response)
        } else {
          res.json({
            msg: 'Usuário não possui frutas.'
          })
        }
      })
      .catch(error => {
        console.error(error)
      })
  } else {
    res.json({
      errorField: 'user_id',
      msg: 'O ID do usuário é inválido.'
    })
  }
})

app.post('/fruits', auth, (req, res) => {
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
        res.json({
          errorField: "",
          msg: "Informações de frutas guardadas."
        })
      })
      .catch(error => {
        res.json({
          errorField: "",
          msg: "Erro ao guardada informações das frutas."
        })
      })
  } else {
    if (!is_user_id_OK) {
      res.json({
        errorField: 'id',
        msg: 'O ID do usuário é inválido.'
      })
    }
    if (!is_jaboca_berry_OK) {
      res.json({
        errorField: 'jaboca-berry',
        msg: 'A quantidade de JABOCA BERRY é inválida.'
      })
    }
    if (!is_razz_berry_OK) {
      res.json({
        errorField: 'razz-berry',
        msg: 'A quantidade de RAZZ BERRY é inválida.'
      })
    }
    if (!is_bluk_berry_OK) {
      res.json({
        errorField: 'bluk-berry',
        msg: 'A quantidade de BLUK BERRY é inválida.'
      })
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