const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(express.json())


app.get('/blockchain', (req, res) => {
  res.send(`blockchain`)
})
app.post('/transaction', (req, res) => {
  console.log(req.body)
  res.send(`${req.body.amount}`)
})
app.get('/mine', (req, res) => {
  
})


app.listen(3000, () => {
  console.log("Blockchain is running...")
})