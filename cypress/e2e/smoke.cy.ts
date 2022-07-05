describe("smoke tests", () => {
  it("should show Login with Discord if not authorized and going to admin", () => {
    cy.visit("/admin");

    // Redirect to /login because not authorized
    cy.location().its("pathname").should("eq", "/login");

    cy.findByRole("form")
      .within(() =>
        cy.findByRole("button", { name: "Login with Discord" }).should("exist")
      )
      .should("have.attr", "action", "/auth/discord");
  });
});
