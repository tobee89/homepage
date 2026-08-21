---
title: NetBird
description: NetBird Widget Configuration
---

Learn more about [NetBird](https://netbird.io).

The widget reads from the NetBird management API of a self-hosted or cloud instance. Authentication uses a
[personal access token](https://docs.netbird.io/manage/public-api) that belongs to a user or, preferably, a service
user. A token issued to a service user with the `User` role is enough for the peer based fields; the `users` field
additionally requires the `Admin` role.

Allowed fields: `["peers", "online", "users", "groups", "login_expired", "version", "update"]`

A maximum of four fields are displayed. The `update` field shows the available management version when an update is
available, and `Up to date` otherwise.

```yaml
widget:
  type: netbird
  url: https://netbird.host.or.ip
  key: netbirdpersonalaccesstoken
  fields: ["peers", "online", "users", "groups"] # optional
```
