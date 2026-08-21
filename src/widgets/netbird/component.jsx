import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next/pages";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: peersData, error: peersError } = useWidgetAPI(widget, "peers");
  const { data: usersData, error: usersError } = useWidgetAPI(widget, "users");
  const { data: groupsData, error: groupsError } = useWidgetAPI(widget, "groups");
  const { data: versionData, error: versionError } = useWidgetAPI(widget, "version");

  const error = peersError ?? usersError ?? groupsError ?? versionError;

  if (error) {
    return <Container service={service} error={error} />;
  }

  const MAX_ALLOWED_FIELDS = 4;
  if (widget.fields?.length === 0 || !widget.fields) {
    widget.fields = ["peers", "online", "users", "groups"];
  } else if (widget.fields?.length > MAX_ALLOWED_FIELDS) {
    widget.fields = widget.fields.slice(0, MAX_ALLOWED_FIELDS);
  }

  if (!peersData || !usersData || !groupsData || !versionData) {
    return (
      <Container service={service}>
        <Block label="netbird.peers" />
        <Block label="netbird.online" />
        <Block label="netbird.users" />
        <Block label="netbird.groups" />
      </Container>
    );
  }

  const peers = Array.isArray(peersData) ? peersData : [];
  const users = Array.isArray(usersData) ? usersData : [];
  const groups = Array.isArray(groupsData) ? groupsData : [];

  const online = peers.filter((peer) => peer.connected).length;
  const loginExpired = peers.filter((peer) => peer.login_expired).length;
  const humanUsers = users.filter((user) => !user.is_service_user).length;

  const updateAvailable = versionData.management_update_available
    ? versionData.management_available_version
    : t("netbird.up_to_date");

  return (
    <Container service={service}>
      <Block label="netbird.peers" value={t("common.number", { value: peers.length })} />
      <Block label="netbird.online" value={t("common.number", { value: online })} />
      <Block label="netbird.users" value={t("common.number", { value: humanUsers })} />
      <Block label="netbird.groups" value={t("common.number", { value: groups.length })} />
      <Block label="netbird.login_expired" value={t("common.number", { value: loginExpired })} />
      <Block label="netbird.version" value={versionData.management_current_version} />
      <Block label="netbird.update" value={updateAvailable} />
    </Container>
  );
}
