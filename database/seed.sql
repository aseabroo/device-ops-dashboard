USE device_ops;

INSERT INTO customers (name, email) VALUES
  ('Jordan Lee', 'jordan.lee@example.com'),
  ('Maya Patel', 'maya.patel@example.com'),
  ('Noah Chen', 'noah.chen@example.com');

INSERT INTO devices (customer_id, serial_number, model, purchased_on, status) VALUES
  (1, 'HUB-A1001', 'HomeHub Pro', '2025-01-14', 'active'),
  (1, 'CAM-B2001', 'SecureCam Mini', '2025-02-03', 'active'),
  (2, 'THERM-C3001', 'ClimateSense', '2024-11-20', 'maintenance'),
  (3, 'LOCK-D4001', 'EntryLock X', '2025-03-08', 'active');

INSERT INTO firmware_releases (version, released_on, size_mb, release_status) VALUES
  ('2.4.0', '2025-06-01', 84.50, 'active'),
  ('2.5.0', '2025-08-15', 92.25, 'active'),
  ('2.6.0-beta', '2025-10-01', 95.10, 'planned');

INSERT INTO device_firmware (device_id, firmware_id) VALUES
  (1, 2),
  (2, 2),
  (3, 1),
  (4, 2);

INSERT INTO service_tickets (customer_id, device_id, summary, status) VALUES
  (1, 2, 'Intermittent disconnects after router restart', 'open'),
  (2, 3, 'Temperature reading drifts after several hours', 'in_progress'),
  (3, 4, 'Auto-lock schedule did not trigger', 'resolved');
