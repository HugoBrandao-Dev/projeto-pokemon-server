const express = require('express')
const app = express()

app.get("/", (req, res) => {
  res.send('<h1>Home</h1>')
})

app.listen(4000, error => {
  if (error) {
    console.error('Erro no servidor.')
  } else {
    console.log('Servidor iniciado com sucesso.')
  }
})