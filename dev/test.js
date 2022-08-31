const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();
// bitcoin.createNewBlock(12, 'BBBBNNNNN', 'BNNNNMMMMM');

// bitcoin.createNewTransaction(100, 'arizona', 'cali')

const prevBlockHash = 'jhdsjhjsdhgjdhgd'
const currentBlockData = [
  {
    amount: 10,
    sender: 'carlos',
    recipient: "charlie" 
  },
  {
    amount: 50,
    sender: 'carlos',
    recipient: "charlie" 
  },
  {
    amount: 80,
    sender: 'carlos',
    recipient: "charlie" 
  },
];
const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData)

console.log(bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce))
console.log(bitcoin)

 