import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next/pages";

import useWidgetAPI from "utils/proxy/use-widget-api";

// Compares two NetBird release strings (e.g. "0.76.2"). Returns true when
// "version" is older than "reference". Unknown or empty versions never count
// as outdated, otherwise a peer that has not reported yet raises a false alarm.
function isOlder(version, reference) {
  if (!version || !reference) return false;

  const left = version.split(".").map((part) => parseInt(part, 10));
  const right = reference.split(".").map((part) => parseInt(part, 10));

  if (left.some(Number.isNaN) || right.some(Number.isNaN)) return false;

  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const a = left[i] ?? 0;
    const b = right[i] ?? 0;
    if (a !== b) return a < b;
  }

  return false;
}

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const MAX_ALLOWED_FIELDS = 4;
  if (widget.fields?.length === 0 || !widget.fields) {
    widget.fields = ["online", "users", "groups", "version"];
  } else if (widget.fields?.length > MAX_ALLOWED_FIELDS) {
    widget.fields = widget.fields.slice(0, MAX_ALLOWED_FIELDS);
  }

  // setup-keys requires an admin token, so it is only requested when the field
  // is actually displayed. An empty endpoint makes useWidgetAPI skip the call.
  const setupKeysEndpoint = widget.fields.includes("setup_keys") ? "setupKeys" : "";

  const { data: peersData, error: peersError } = useWidgetAPI(widget, "peers");
  const { data: usersData, error: usersError } = useWidgetAPI(widget, "users");
  const { data: groupsData, error: groupsError } = useWidgetAPI(widget, "groups");
  const { data: versionData, error: versionError } = useWidgetAPI(widget, "version");
  const { data: setupKeysData, error: setupKeysError } = useWidgetAPI(widget, setupKeysEndpoint);

  const error = peersError ?? usersError ?? groupsError ?? versionError ?? setupKeysError;

  if (error) {
    return <Container service={service} error={error} />;
  }

  if (!peersData || !usersData || !groupsData || !versionData || (setupKeysEndpoint && !setupKeysData)) {
    return (
      <Container service={service}>
          <Block label="netbird.online" />
        <Block label="netbird.users" />
        <Block label="netbird.groups" />
        <Block label="netbird.version" />
      </Container>
    );
  }

  const peers = Array.isArray(peersData) ? peersData : [];
  const users = Array.isArray(usersData) ? usersData : [];
  const groups = Array.isArray(groupsData) ? groupsData : [];
  const setupKeys = Array.isArray(setupKeysData) ? setupKeysData : [];

  const currentVersion = versionData.management_current_version;

  const online = peers.filter((peer) => peer.connected).length;
  const loginExpired = peers.filter((peer) => peer.login_expired).length;
  const outdated = peers.filter((peer) => isOlder(peer.version, currentVersion)).length;
  const humanUsers = users.filter((user) => !user.is_service_user).length;
  const validKeys = setupKeys.filter((key) => key.valid && !key.revoked).length;

  const versionStatus = versionData.management_update_available
    ? t("netbird.update_available")
    : t("netbird.up_to_date");

  return (
    <Container service={service}>
      <Block label="netbird.peers" value={t("common.number", { value: peers.length })} />
      <Block
        label="netbird.online"
        value={`${t("common.number", { value: online })} / ${t("common.number", { value: peers.length })}`}
      />
      <Block label="netbird.users" value={t("common.number", { value: humanUsers })} />
      <Block label="netbird.groups" value={t("common.number", { value: groups.length })} />
      <Block label="netbird.login_expired" value={t("common.number", { value: loginExpired })} />
      <Block label="netbird.outdated" value={t("common.number", { value: outdated })} />
      <Block label="netbird.setup_keys" value={t("common.number", { value: validKeys })} />
      <Block label="netbird.version" value={versionStatus} />
      <Block label="netbird.current_version" value={currentVersion} />
    </Container>
  );
}
