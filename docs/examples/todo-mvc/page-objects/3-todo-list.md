# Page object: `TodoApp` > `TodoList`

![todo-list](../images/todo-list.png)

## Choosing a CSS selector

```html
<section class="todoapp"> <!-- TodoApp (relative root) -->
  <div> <!-- No page object (implementation detail) -->
    <section class="main"> <!-- No page object (implementation detail) -->
      <ul class="todo-list"> <!-- TodoList -->
```

## Implementing the page object

```js
class TodoList extends FlexiblePageObject {
  get selector() {
    return '.todo-list';
  }
}
```

## Integrating the page object

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
