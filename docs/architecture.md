# Architecture

## Application layers

The project separates HTTP routing, database access configuration, validation helpers, presentation templates, and SQL schema/seed files.

```text
Browser
  |
  v
Express routes
  |
  +--> validation helpers
  |
  v
mysql2/promise
  |
  v
MySQL relational database
```

## Data model

```text
customers
  | 1
  |------< devices
  |          |
  |          | M
  |          +------< device_firmware >------+ firmware_releases
  |
  +------< service_tickets >------ optional device
```

### Relationship behavior

- deleting a customer cascades to owned devices and tickets;
- deleting a device removes deployment rows and sets linked ticket devices to NULL;
- deleting firmware removes its deployment rows;
- device/firmware deployments use a composite primary key to prevent duplicates.

## Backend design

Each resource has its own Express router. SQL statements use placeholders and bound values rather than string interpolation.

The dashboard route runs aggregate queries for portfolio-friendly operational metrics.

Application construction and server startup are separated: `src/app.js` exports the configured Express app, while `src/server.js` owns the listening socket. That keeps production startup simple while allowing route-level integration tests to start the app on an ephemeral port.

## Current tradeoffs

The project intentionally stays small and server-rendered. It does not introduce an ORM, SPA framework, or authentication layer simply to increase technology count.

Docker Compose is used only for reproducible local MySQL setup. GitHub Actions provisions a disposable MySQL service for integration tests, so database-backed routes can be exercised without turning the application into a larger infrastructure project.
