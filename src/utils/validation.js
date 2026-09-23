const DEVICE_STATUSES = new Set(['active', 'maintenance', 'retired']);
const TICKET_STATUSES = new Set(['open', 'in_progress', 'resolved']);

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validEmail(value) {
  if (!nonEmpty(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validDeviceStatus(value) {
  return DEVICE_STATUSES.has(value);
}

function validTicketStatus(value) {
  return TICKET_STATUSES.has(value);
}

module.exports = {
  nonEmpty,
  validEmail,
  validDeviceStatus,
  validTicketStatus
};
