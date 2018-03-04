# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > **Todo**[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > [Toggle](./6-toggle.md#page-object-toggle)

## Page object: Todo

![todo](../images/todo.png)

### Choosing a CSS selector

```html
<ul class="todo-list"> <!-- Relative root (TodoList) -->
  <li> <!-- Todo -->
  <li> <!-- Todo -->
  ....
```

### Implementing the page object

```js
class Todo extends FlexiblePageObject {
  get selector() {
    return 'li';
  }
}
```

### Integrating the page object

```js
class TodoList extends FlexiblePageObject {
  get selector() {
    return '.todo-list';
  }

  get todos() {
    return this.select(Todo);
  }
}
```

### Using the page object

```js
todoApp.todoList.todos.nth(1);
```

```js
todoApp.todoList.todos.where(todo => todo.label.getRenderedText(equals('foo')));
```

[external-todomvc]: http://todomvc.com/examples/react/#/
