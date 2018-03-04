# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./1-todo-app.md#page-object-todoapp)
- TodoApp > **NewTodo**
- TodoApp > [TodoList](./3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > [Toggle](./6-toggle.md#page-object-toggle)

## Page object: NewTodo

![new-todo](../images/new-todo.png)

### Choosing a CSS selector

```html
<section class="todoapp"> <!-- Relative root (TodoApp) -->
  <div>
    <header class="header">
      <input class="new-todo"> <!-- NewTodo -->
```

### Implementing the page object

```js
class NewTodo extends FlexiblePageObject {
  get selector() {
    return '.new-todo';
  }
}
```

### Integrating the page object

```js
class TodoApp extends FlexiblePageObject {
  get selector() {
    return '.todoapp';
  }

  get newTodo() {
    return this.select(NewTodo);
  }
}
```

[external-todomvc]: http://todomvc.com/examples/react/#/
