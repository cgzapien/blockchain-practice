const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Blockchain = require("./blockchain");
const uuid = require('uuid')
const bitcoin = new Blockchain();
const port = process.argv[2];
const rp = require('request-promise')

const nodeAddy = uuid.v4().split('-').join('')

app.use(express.json());


app.get('/blockchain', (req, res) => {
  res.send(bitcoin)
})
app.post('/transaction', (req, res) => {
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient,
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}`})
})
app.get('/mine', (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const prevBlockHash = lastBlock['hash']
  const currentBlockData = {
    transaction: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  }
  const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData)
  const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce)
  bitcoin.createNewTransaction(12.5, "00", nodeAddy)
  const newBlock = bitcoin.createNewBlock( nonce, prevBlockHash, blockHash );
  res.json({
    note: 'block mined',
    block: newBlock
  })
})

app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1 ) bitcoin.networkNodes.push(newNodeUrl)
  const reqNodePromises = [];
  bitcoin.networkNodes.forEach(networkNodeURL => {
    const requestOptions = {
      uri: networkNodeURL + '/register-node',
      method: "POST",
      body: { newNodeUrl: newNodeUrl},
      json: true
    };
    reqNodePromises.push(rp(requestOptions))
  })
  Promise.all(reqNodePromises)
  .then(data => {
    console.log(data)
    const requestBulkOptions = {
      uri: networkNodeURL + '/register-nodes-bulk',
      method: "POST",
      body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeURL]},
      json: true
      }
      return rp(requestBulkOptions)
    })
    .then(data => {
      console.log(data)
      res.json({note: "new node registered successfully"})
    })
})

app.post('/register-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1; 
  const notCurrentNode = bitcoin.currentNodeURL !== newNodeUrl
  if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl)
  res.json({note: "new node registered successfully."})
})

app.post('/register-nodes-bulk', (req, res) => {
})


app.listen(port, () => {
  console.log(`Blockchain is running...${port}`)
})