// import { createCookieSessionStorage } from "@remix-run/node";

export const login: Cypress.Chainable["login"] = () => {
  Cypress.log({
    name: "login via Discord OAuth2",
  });

  // How do we set the cookie? If using below, cypress will fail because it doesn't handle ?. code.
  // Inspired by these tests: https://github.com/sergiodxa/remix-auth-oauth2/blob/main/test/index.test.ts#L192

  // let sessionStorage = createCookieSessionStorage({
  //   cookie: { secrets: ["s3cr3t"] },
  // });
  // const session = await sessionStorage.getSession();
  // session.set("oauth2:state", "value");
  cy.visit(`auth/discord/callback?code=secret&state=value`, {
    failOnStatusCode: false,
    onBeforeLoad(win) {
      win.document.cookie = `_session='${JSON.stringify({
        "oauth2:state": "value",
      })}'`;
    },
  });

  // After authorized, navigate to admin page
  // cy.visit("admin");
};

Cypress.Commands.add("login", login);
