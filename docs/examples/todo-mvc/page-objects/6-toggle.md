# Example: TodoMVC

In this example we write a [test case](../index.md#test-case) for the [TodoMVC][external-todomvc] application.

## Page objects

- [TodoApp](./1-todo-app.md#page-object-todoapp)
- TodoApp > [NewTodo](./2-new-todo.md#page-object-newtodo)
- TodoApp > [TodoList](./3-todo-list.md#page-object-todolist)
- TodoApp > TodoList > [Todo](./4-todo.md#page-object-todo)[ ]
- TodoApp > TodoList > Todo[ ] > [Label](./5-label.md#page-object-label)
- TodoApp > TodoList > Todo[ ] > **Toggle**

## Page object: Toggle

![toggle](../images/toggle.png)

### Choosing a CSS selector

```html
<li> <!-- Relative root (Todo) -->
  <div class="view">
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
