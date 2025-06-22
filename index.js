const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Visa Navigator Is Running Successfully')
})

app.listen(port, () => {
  console.log(`Visa Navigator Server Running on port ${port}`)
})