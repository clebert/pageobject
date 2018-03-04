# Page object: `TodoApp`

![todo-app](../images/todo-app.png)

## Choosing a CSS selector

```html
<html> <!-- No page object (implementation detail) -->
  <body> <!-- No page object (implementation detail) -->
    <section class="todoapp"> <!-- TodoApp -->
```

## Implementing the page object

```js
class TodoApp extends FlexiblePageObject {
  get selector() {
    return '.todoapp';
  }
}
```
