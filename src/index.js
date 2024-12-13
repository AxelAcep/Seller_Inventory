const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const {passport} = require('./passport');

const router = require('./routers');
const NotFoundMiddleware = require('./middlewares/NotFoundHandler');
const ErrorHandlerMiddleware = require('./middlewares/ErrorHandler');
const {receiveOrderNotifications} = require('./MessageBroker');

const app = express();
const port = 5000;

app.use(session({
  secret: 'Service',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors())
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//HelloWorld
app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

//Inisiasi di port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  receiveOrderNotifications();
});