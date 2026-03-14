const { ContentPlanner } = require("./planner");

const planner = new ContentPlanner();
planner.addItem("Welcome Post", "2026-03-20", "draft");
planner.addItem("Brand Story", "2026-03-25", "in-review");

console.log("Lemon Appeal Content Planning Studio");
console.log("Scheduled content:", planner.getItems());
