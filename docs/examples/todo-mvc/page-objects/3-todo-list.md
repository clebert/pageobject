# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./2-new-todo.md#page-object-newtodo)
- TodoApp > **TodoList**
- TodoApp > TodoList > [Todo](./4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > [Toggle](./6-toggle.md#page-object-toggle)

## Page object: TodoList

![todo-list](../images/todo-list.png)

### Choosing a CSS selector

```html
<section class="todoapp"> <!-- Relative root (TodoApp) -->
  <div>
    <section class="main">
      <ul class="todo-list"> <!-- TodoList -->
```

### Implementing the page object

```js
class TodoList extends FlexiblePageObject {
  get selector() {
    return '.todo-list';
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

  get todoList() {
    return this.select(TodoList);
  }
}
```

[external-todomvc]: http://todomvc.com/examples/react/#/
