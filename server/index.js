const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const db = require('./config/dbConnection')
const router = require('./router/index')
const bodyParse = require('body-parser')
const cookiesParse = require('cookie-parser');
const cor = require('cors');
const morgan = require('morgan')
require('dotenv').config()

app.use(cor({
  origin:process.env.URL_CLIENT,
  credentials:true
}))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({
  extended:true
}));
app.use(cookiesParse())
app.use(morgan('common'))

router(app);
db.dbConnect();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})