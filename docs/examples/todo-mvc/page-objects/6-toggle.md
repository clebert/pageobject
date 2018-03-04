# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./page-objects/1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./page-objects/2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./page-objects/3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./page-objects/4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./page-objects/5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > **Toggle**

## Page object: Toggle

![toggle](../images/toggle.png)

### Choosing a CSS selector

```html
<li> <!-- Todo (relative root) -->
  <div class="view"> <!-- No page object (implementation detail) -->
    <input class="toggle" type="checkbox"> <!-- Toggle -->
```

### Implementing the page object

```js
class Toggle extends FlexiblePageObject {
  get selector() {
    return '.toggle';
  }

  isSelected(operator = equals(true)) {
    return this.getProperty('checked', operator);
  }
}
```

### Integrating the page object

```js
class Todo extends FlexiblePageObject {
  get selector() {
    return 'li';
  }

  get label() {
    return this.select(Label);
  }

  get toggle() {
    return this.select(Toggle);
  }
}
```

[external-todomvc]: http://todomvc.com/examples/react/#/
