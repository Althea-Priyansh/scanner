// "use client";
// import React, { useEffect } from "react";
// import Dwt from "./App";
// import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
// import { cloakConfig } from "@/keycloak";

// const Main = () => {
//   const { keycloak, initialized } = useKeycloak();

//   useEffect(() => {
//     if (initialized && !keycloak.authenticated) {
//       keycloak.login({
//         redirectUri: "http://localhost:3000",
//       });
//     }
//   }, [initialized, keycloak]);

//   if (!initialized) {
//     return <h1>Initializing Keycloak...</h1>;
//   }

//   if (!keycloak.authenticated) {
//     return <h1>Authenticating...</h1>;
//   }

//   return (
//     <div>
//       <Dwt />
//     </div>
//   );
// };

// const AppWrapper = () => {
//   const initOptions = {
//     onLoad: "login-required",
//     silentCheckSsoRedirectUri:
//       window.location.origin + "/silent-check-sso.html",
//     pkceMethod: "S256",
//     checkLoginIframe: false,
//     enableLogging: true,
//     flow: "standard",
//     redirectUri: window.location.origin,
//     // Authentication settings
//     clientId: cloakConfig.clientId,
//     enableCors: true,
//     publicClient: false,
//     // Token settings
//     tokenStorage: "sessionStorage",
//     useNonce: true,
//     scope: "openid profile email",
//   };

//   return (
//     <ReactKeycloakProvider
//       authClient={cloakConfig}
//       initOptions={initOptions}
//       onEvent={(event, error) => {
//         console.log("Keycloak Event:", event, error);
//         switch (event) {
//           case "onAuthSuccess":
//             console.log("Authentication successful");
//             break;
//           case "onAuthError":
//             console.error("Authentication error:", error);
//             break;
//           case "onTokenExpired":
//             console.log("Token expired, refreshing...");
//             // keycloak.updateToken(30).then(refreshed => {
//             //   if (refreshed) {
//             //     console.log('Token refreshed successfully');
//             //   } else {
//             //     console.log('Token not refreshed, valid for '
//             //       + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
//             //   }
//             // }).catch(() => {
//             //   console.error('Failed to refresh token');
//             // });
//             break;
//         }
//       }}
//     >
//       <Main />
//     </ReactKeycloakProvider>
//   );
// };

// export default AppWrapper;
"use client";
import React, { useEffect } from "react";
import Dwt from "./App";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { cloakConfig } from "@/keycloak";

const Main = () => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    // Auto-login if not authenticated
    if (initialized && !keycloak.authenticated) {
      keycloak.login({
        redirectUri: window.location.origin,
      });
    }
  }, [initialized, keycloak]);

  if (!initialized) {
    return <h1>Initializing...</h1>;
  }

  // Only show the app when authenticated
  if (!keycloak.authenticated) {
    return <h1>Redirecting to login...</h1>;
  }
  console.log(keycloak.idToken);
  return (
    <div>
      <Dwt />
    </div>
  );
};

const AppWrapper = () => {
  const initOptions = {
    onLoad: "login-required",
    silentCheckSsoRedirectUri:
      window.location.origin + "/silent-check-sso.html",
    pkceMethod: "S256",
    checkLoginIframe: false,
    enableLogging: true, // Enable detailed logging
    flow: "standard", // Use standard flow
    redirectUri: window.location.origin,
    responseMode: "query", // Use query instead of fragment
  };

  return (
    <ReactKeycloakProvider
      authClient={cloakConfig}
      initOptions={initOptions}
      onEvent={(event, error) => {
        console.log("Keycloak Event:", event, error);
      }}
    >
      <Main />
    </ReactKeycloakProvider>
  );
};

export default AppWrapper;

// import React, { useState } from "react";
// import axios from "axios";

// const keycloakConfig = {
//   url: "https://identity.consint.ai/realms/master/protocol/openid-connect/token?response_type=token",
//   clientId: "testcloak",
// };

// function Main() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);

//   const handleLogin = async () => {
//     try {
//       // Make a POST request to Keycloak's token endpoint with username and password
//       const response = await axios.post(
//         keycloakConfig.url,
//         new URLSearchParams({
//           client_id: keycloakConfig.clientId,
//           grant_type: "password",
//           username: username,
//           password: password,
//         }),
//         {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         }
//       );

//       // If successful, save the access token
//       setToken(response.data.access_token);
//       console.log("Access Token:", response.data.access_token);
//     } catch (err) {
//       console.error("Login failed:", err);
//       // setError('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {token && <p>Logged in successfully. Access Token: {token}</p>}
//     </div>
//   );
// }

// export default Main;
