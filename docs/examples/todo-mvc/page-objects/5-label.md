# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > **Label**
- TodoApp > TodoList > Todo[ ] > [Toggle](./6-toggle.md#page-object-toggle)

## Page object: Label

![label](../images/label.png)

### Choosing a CSS selector

```html
<li> <!-- Relative root (Todo) -->
  <div class="view">
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
