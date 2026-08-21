---
title: NetBird
description: NetBird Widget Configuration
---

Learn more about [NetBird](https://netbird.io).

The widget reads from the NetBird management API of a self-hosted or cloud instance. Authentication uses a
[personal access token](https://docs.netbird.io/manage/public-api), preferably one that belongs to a service user.
A token with the `User` role covers the peer based fields; `users` and `setup_keys` additionally require the
`Admin` role.

Allowed fields: `["peers", "online", "users", "groups", "login_expired", "outdated", "setup_keys", "version", "update"]`

A maximum of four fields are displayed.

- `online` counts peers currently connected, `login_expired` counts peers whose login has expired.
- `outdated` counts peers running a client older than the management server.
- `setup_keys` counts valid, non-revoked setup keys. It is only requested when the field is displayed.
- `update` shows the available management version when an update is available, and `Up to date` otherwise.

```yaml
widget:
  type: netbird
  url: https://netbird.host.or.ip
  key: netbirdpersonalaccesstoken
  fields: ["peers", "online", "users", "groups"] # optional
```
