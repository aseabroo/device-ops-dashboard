CREATE DATABASE IF NOT EXISTS device_ops;
USE device_ops;

DROP TABLE IF EXISTS device_firmware;
DROP TABLE IF EXISTS service_tickets;
DROP TABLE IF EXISTS firmware_releases;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
  device_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  serial_number VARCHAR(80) NOT NULL UNIQUE,
  model VARCHAR(120) NOT NULL,
  purchased_on DATE NULL,
  status ENUM('active','maintenance','retired') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_devices_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE
);

CREATE TABLE firmware_releases (
  firmware_id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(40) NOT NULL UNIQUE,
  released_on DATE NOT NULL,
  size_mb DECIMAL(8,2) NOT NULL,
  release_status ENUM('planned','active','deprecated') NOT NULL DEFAULT 'planned'
);

CREATE TABLE device_firmware (
  device_id INT NOT NULL,
  firmware_id INT NOT NULL,
  installed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (device_id, firmware_id),
  CONSTRAINT fk_df_device
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_df_firmware
    FOREIGN KEY (firmware_id) REFERENCES firmware_releases(firmware_id)
    ON DELETE CASCADE
);

CREATE TABLE service_tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  device_id INT NULL,
  summary VARCHAR(220) NOT NULL,
  status ENUM('open','in_progress','resolved') NOT NULL DEFAULT 'open',
  reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_ticket_device
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
    ON DELETE SET NULL
);
