---
title: NetBird
description: NetBird Widget Configuration
---

Learn more about [NetBird](https://netbird.io).

The widget reads from the NetBird management API of a self-hosted or cloud instance. Authentication uses a
[personal access token](https://docs.netbird.io/manage/public-api), preferably one that belongs to a service user.
A token with the `User` role covers the peer based fields; `users` and `setup_keys` additionally require the
`Admin` role.

Allowed fields:
`["peers", "online", "users", "groups", "login_expired", "outdated", "setup_keys", "version", "current_version"]`

A maximum of four fields are displayed. The default is `["online", "users", "groups", "version"]`.

- `online` shows connected peers over the total, for example `6 / 8`; `peers` shows the total on its own.
- `login_expired` counts peers whose login has expired.
- `outdated` counts peers running a client older than the management server.
- `setup_keys` counts valid, non-revoked setup keys. It is only requested when the field is displayed.
- `version` shows `Up to date` or `Update available`; `current_version` shows the management version itself.

```yaml
widget:
  type: netbird
  url: https://netbird.host.or.ip
  key: netbirdpersonalaccesstoken
  fields: ["online", "users", "groups", "version"] # optional
```
