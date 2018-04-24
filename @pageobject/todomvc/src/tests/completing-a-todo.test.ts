import {Predicate} from '@pageobject/base';
import {jestTest} from './jestTest';

const {is} = Predicate;

jestTest('Completing a todo', (test, app) => {
  test.perform(app.page.goto('http://todomvc.com/examples/react/#/'), 30);

  test
    .assert(app.newTodoInput.hasFocus(), is(true), 'newTodoInput has focus')
    .perform(app.keyboard.type('My todo'))
    .perform(app.keyboard.press('Enter'));

  const todo = app.todoList.todos.first();

  test
    .assert(todo.toggle.isChecked(), is(false), 'toggle is not checked')
    .perform(todo.toggle.click())
    .assert(todo.toggle.isChecked(), is(true), 'toggle is checked');
});
