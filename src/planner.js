/**
 * Lemon Appeal Content Planning Studio
 * Core content planner module
 */

class ContentPlanner {
  constructor() {
    this.items = [];
  }

  addItem(title, dueDate, status = "draft") {
    if (!title) throw new Error("Title is required");
    const item = { id: Date.now(), title, dueDate, status };
    this.items.push(item);
    return item;
  }

  getItems(filterStatus) {
    if (filterStatus) {
      return this.items.filter((i) => i.status === filterStatus);
    }
    return [...this.items];
  }

  updateStatus(id, status) {
    const item = this.items.find((i) => i.id === id);
    if (!item) throw new Error(`Item ${id} not found`);
    item.status = status;
    return item;
  }
}

module.exports = { ContentPlanner };
