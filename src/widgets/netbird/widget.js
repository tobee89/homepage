import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    peers: {
      endpoint: "peers",
    },
    users: {
      endpoint: "users",
    },
    groups: {
      endpoint: "groups",
    },
    setupKeys: {
      endpoint: "setup-keys",
    },
    version: {
      endpoint: "instance/version",
    },
  },
};

export default widget;
