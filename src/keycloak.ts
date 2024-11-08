// // keycloak.ts
import Keycloak from "keycloak-js";

export const cloakConfig = new Keycloak({
  url: "https://identity.consint.ai", // Remove /auth
  realm: "master",
  clientId: "testcloak",
});
