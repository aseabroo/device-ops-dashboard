require('dotenv').config();

const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const customersRouter = require('./routes/customers');
const devicesRouter = require('./routes/devices');
const firmwareRouter = require('./routes/firmware');
const ticketsRouter = require('./routes/tickets');

const app = express();
const port = Number(process.env.PORT || 3000);

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('home', { title: 'Device Ops Dashboard' });
});

app.use('/customers', customersRouter);
app.use('/devices', devicesRouter);
app.use('/firmware', firmwareRouter);
app.use('/tickets', ticketsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: 'Unexpected error',
    message: 'Something went wrong while processing the request.'
  });
});

app.listen(port, () => {
  console.log(`Device Ops Dashboard listening on http://localhost:${port}`);
});
