declare namespace Cypress {
  interface Chainable {
    /**
     * logs in with a test user
     *
     * @returns {typeof login}
     * @memberof Chainable
     * @example
     *    cy.login();
     */
    login: () => void;
  }
}
