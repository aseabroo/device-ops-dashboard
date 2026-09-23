const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const pool = require('../src/config/database');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await pool.end();
});

test('health endpoint reports readiness', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('dashboard renders seeded operational metrics', async () => {
  const response = await fetch(`${baseUrl}/dashboard`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /Dashboard/i);
  assert.match(body, /Customers/i);
  assert.match(body, /Devices/i);
});

test('customer create route persists data with parameterized SQL', async () => {
  const email = `integration-${Date.now()}@example.com`;
  const form = new URLSearchParams({
    name: 'Integration Test Customer',
    email
  });

  const createResponse = await fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
    redirect: 'manual'
  });

  assert.equal(createResponse.status, 302);
  assert.equal(createResponse.headers.get('location'), '/customers');

  const [rows] = await pool.execute(
    'SELECT customer_id, name, email FROM customers WHERE email = ?',
    [email]
  );

  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, 'Integration Test Customer');

  await pool.execute('DELETE FROM customers WHERE customer_id = ?', [rows[0].customer_id]);
});

test('invalid customer input is rejected without a database write', async () => {
  const form = new URLSearchParams({
    name: '',
    email: 'not-an-email'
  });

  const response = await fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
    redirect: 'manual'
  });

  assert.equal(response.status, 400);
});
