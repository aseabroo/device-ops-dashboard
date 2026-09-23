# Device Ops Dashboard

A full-stack portfolio project for managing connected devices, firmware releases, customer ownership, deployment relationships, and service tickets.

## Why this project exists

Device Ops Dashboard is an independent rebuild of database and full-stack concepts I originally practiced in coursework. It is not a republished assignment solution. The data model, project structure, implementation, validation, seed data, and documentation were rebuilt for portfolio use.

The goal is to demonstrate practical skills in:

- relational database design;
- CRUD-oriented backend development;
- parameterized SQL;
- server-side rendering;
- input validation;
- modular Express routing;
- many-to-many relationships;
- foreign-key behavior;
- testable utility code.

## Stack

- Node.js
- Express
- Handlebars
- MySQL / MariaDB-compatible SQL
- `mysql2/promise`
- Node's built-in test runner
- HTML / CSS

## Domain Model

The application models a small connected-device operations platform.

### Customers

Customer records represent device owners.

### Devices

Each device belongs to a customer and tracks:

- serial number;
- model;
- purchase date;
- lifecycle status.

### Firmware Releases

Firmware records track version, release date, package size, and release status.

### Device ↔ Firmware Deployments

A junction table models the many-to-many relationship between devices and firmware releases.

### Service Tickets

Support tickets connect customers to optional device records and track issue summaries and workflow status.

## Relational Design

```text
customers
   |
   | 1:M
   v
devices --------< device_firmware >-------- firmware_releases
   |
   | 1:M
   v
service_tickets

customers 1:M service_tickets
```

The schema demonstrates primary keys, unique constraints, foreign keys, cascading deletes, nullable relationships, enums, and a composite primary key for the junction table.

## Project Structure

```text
device-ops-dashboard/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── public/
│   └── styles.css
├── src/
│   ├── app.js
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── customers.js
│   │   ├── devices.js
│   │   ├── firmware.js
│   │   └── tickets.js
│   ├── utils/
│   │   └── validation.js
│   └── views/
│       ├── layouts/
│       ├── customers.hbs
│       ├── devices.hbs
│       ├── firmware.hbs
│       ├── home.hbs
│       └── tickets.hbs
├── test/
│   └── validation.test.js
├── .env.example
├── .gitignore
└── package.json
```

## Security and Code Quality Choices

Unlike the earlier coursework implementation that inspired the rebuild, this version uses:

- parameterized SQL rather than interpolating request values into queries;
- environment variables for database credentials;
- modular route files instead of a single monolithic application file;
- constrained status values;
- simple reusable validation utilities;
- synthetic seed data rather than copied assignment data;
- tests for reusable validation behavior.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy the example file:

```bash
cp .env.example .env
```

Then update the database credentials in `.env`.

### 3. Create and seed the database

From a MySQL-compatible client:

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 4. Start the application

```bash
npm start
```

The application defaults to:

```text
http://localhost:3000
```

## Tests

Run:

```bash
npm test
```

The current test suite covers shared validation rules. Route and database integration tests are a planned extension.

## Current Features

- customer listing and creation;
- device inventory with customer ownership;
- device lifecycle-status updates;
- firmware release listing;
- support-ticket listing;
- support-ticket workflow updates;
- normalized relational schema;
- synthetic seed dataset;
- responsive server-rendered dashboard UI.

## Planned Improvements

- full create/edit/delete workflows for all entities;
- device-to-firmware deployment management;
- pagination and filtering;
- route-level integration tests;
- Docker-based local database setup;
- dashboard summary metrics;
- screenshots and deployment demo.

## Portfolio Note

This repository is intentionally separate from the original private coursework archive. It demonstrates the same underlying computer-science concepts through an independently structured and rewritten application suitable for public portfolio presentation.
