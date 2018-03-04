# Example: TodoMVC

In this example we write a test case for the [TodoMVC][external-todomvc] application.

![page](./images/page.png)

## Page objects

- [TodoApp](./page-objects/1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./page-objects/2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./page-objects/3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./page-objects/4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./page-objects/5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > [Toggle](./page-objects/6-toggle.md#page-object-toggle)

## Test case

```js
function describe(testCase, todoApp) {
  const todo1 = todoApp.todoList.todos.nth(1);
  const todo2 = todoApp.todoList.todos.nth(2);

  testCase
    .perform(todoApp.navigateTo('http://todomvc.com/examples/react/#/'), 30)

    .assert(todoApp.newTodo.hasFocus())

    .perform(todoApp.newTodo.type('foo'))
    .perform(todoApp.newTodo.sendKey(FlexibleKey.ENTER))
    .assert(todo1.label.getRenderedText(equals('foo')))

    .perform(todoApp.newTodo.type('bar'))
    .perform(todoApp.newTodo.sendKey(FlexibleKey.ENTER))
    .assert(todo2.label.getRenderedText(equals('bar')))

    .assert(todo2.toggle.isSelected(equals(false)))
    .perform(todo2.toggle.click())
    .assert(todo2.toggle.isSelected());
}
```

[external-todomvc]: http://todomvc.com/examples/react/#/
