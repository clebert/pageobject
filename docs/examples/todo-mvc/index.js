const {FlexiblePageObject, FlexibleKey} = require('@pageobject/flexible');
const {PuppeteerAdapter} = require('@pageobject/flexible-puppeteer');
const {TestCase, equals} = require('@pageobject/reliable');

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

class NewTodo extends FlexiblePageObject {
  get selector() {
    return '.new-todo';
  }
}

class TodoList extends FlexiblePageObject {
  get selector() {
    return '.todo-list';
  }

  get todos() {
    return this.select(Todo);
  }
}

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

class Label extends FlexiblePageObject {
  get selector() {
    return 'label';
  }
}

class Toggle extends FlexiblePageObject {
  get selector() {
    return '.toggle';
  }

  isSelected(operator = equals(true)) {
    return this.getProperty('checked', operator);
  }
}

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

(async () => {
  const testCase = new TestCase(3);
  const todoApp = new TodoApp(await PuppeteerAdapter.create());

  try {
    describe(testCase, todoApp);

    await testCase.run();

    console.log('OK');
  } finally {
    await todoApp.adapter.browser.close();
  }
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
