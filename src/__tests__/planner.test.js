const { ContentPlanner } = require("../planner");

describe("ContentPlanner", () => {
  let planner;

  beforeEach(() => {
    planner = new ContentPlanner();
  });

  test("adds a content item with default draft status", () => {
    const item = planner.addItem("Test Post", "2026-04-01");
    expect(item.title).toBe("Test Post");
    expect(item.status).toBe("draft");
  });

  test("throws when title is missing", () => {
    expect(() => planner.addItem("")).toThrow("Title is required");
  });

  test("filters items by status", () => {
    planner.addItem("Post A", "2026-04-01", "draft");
    planner.addItem("Post B", "2026-04-02", "published");
    const drafts = planner.getItems("draft");
    expect(drafts).toHaveLength(1);
    expect(drafts[0].title).toBe("Post A");
  });

  test("updates item status", () => {
    const item = planner.addItem("Post C", "2026-04-03");
    const updated = planner.updateStatus(item.id, "published");
    expect(updated.status).toBe("published");
  });

  test("throws when updating non-existent item", () => {
    expect(() => planner.updateStatus(9999, "published")).toThrow(
      "Item 9999 not found"
    );
  });
});
