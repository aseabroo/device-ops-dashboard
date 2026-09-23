require('dotenv').config();

const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const dashboardRouter = require('./routes/dashboard');
const customersRouter = require('./routes/customers');
const devicesRouter = require('./routes/devices');
const firmwareRouter = require('./routes/firmware');
const deploymentsRouter = require('./routes/deployments');
const ticketsRouter = require('./routes/tickets');

const app = express();
const port = Number(process.env.PORT || 3000);

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function dateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

app.engine('hbs', engine({
  extname: '.hbs',
  helpers: { formatDate, formatDateTime, dateInput }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => res.redirect('/dashboard'));

app.use('/dashboard', dashboardRouter);
app.use('/customers', customersRouter);
app.use('/devices', devicesRouter);
app.use('/firmware', firmwareRouter);
app.use('/deployments', deploymentsRouter);
app.use('/tickets', ticketsRouter);

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Not found',
    message: 'The requested page does not exist.'
  });
});

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
