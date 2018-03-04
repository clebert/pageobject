# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- **TodoApp**
- TodoApp > [NewTodo](./page-objects/2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./page-objects/3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./page-objects/4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./page-objects/5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > [Toggle](./page-objects/6-toggle.md#page-object-toggle)

## Page object: TodoApp

![todo-app](../images/todo-app.png)

### Choosing a CSS selector

```html
<html> <!-- No page object (implementation detail) -->
  <body> <!-- No page object (implementation detail) -->
    <section class="todoapp"> <!-- TodoApp -->
```

### Implementing the page object

```js
class TodoApp extends FlexiblePageObject {
  get selector() {
    return '.todoapp';
  }
}
```

[external-todomvc]: http://todomvc.com/examples/react/#/
