const test = require('node:test');
const assert = require('node:assert/strict');

const {
  nonEmpty,
  validEmail,
  validDeviceStatus,
  validTicketStatus
} = require('../src/utils/validation');

test('nonEmpty rejects blank values', () => {
  assert.equal(nonEmpty('   '), false);
  assert.equal(nonEmpty('device'), true);
});

test('validEmail accepts a basic valid email and rejects malformed input', () => {
  assert.equal(validEmail('operator@example.com'), true);
  assert.equal(validEmail('operator-at-example.com'), false);
});

test('device status is constrained to the lifecycle enum', () => {
  assert.equal(validDeviceStatus('active'), true);
  assert.equal(validDeviceStatus('offline'), false);
});

test('ticket status is constrained to the workflow enum', () => {
  assert.equal(validTicketStatus('resolved'), true);
  assert.equal(validTicketStatus('closed'), false);
});
