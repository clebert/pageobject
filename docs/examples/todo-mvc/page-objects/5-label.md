# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./page-objects/1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./page-objects/2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./page-objects/3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./page-objects/4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > **Label**
- TodoApp > TodoList > Todo[ ] > [Toggle](./page-objects/6-toggle.md#page-object-toggle)

## Page object: Label

![label](../images/label.png)

### Choosing a CSS selector

```html
<li> <!-- Todo (relative root) -->
  <div class="view"> <!-- No page object (implementation detail) -->
    <label> <!-- Label -->
```

### Implementing the page object

```js
class Label extends FlexiblePageObject {
  get selector() {
    return 'label';
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
}
```

[external-todomvc]: http://todomvc.com/examples/react/#/
