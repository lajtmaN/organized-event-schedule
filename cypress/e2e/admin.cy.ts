describe("admin tests", () => {
  it("should be able to create an activity on an event", async () => {
    cy.login();
    cy.findByRole("table").should("exist");
    cy.findByRole("heading").should("be", "Events");
  });
});
