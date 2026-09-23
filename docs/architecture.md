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

## Current tradeoffs

The project intentionally stays small and server-rendered. It does not introduce an ORM, SPA framework, authentication layer, or container stack simply to increase technology count. Those would be reasonable extensions if the application moved beyond portfolio scope.
