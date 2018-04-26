import {Predicate} from '@pageobject/base';
import {jestTest} from './jestTest';

const {is} = Predicate;

jestTest('Completing a todo', (test, app) => {
  test.perform(app.page.goto('http://todomvc.com/examples/react/#/'));

  test
    .assert(app.newTodoInput.hasFocus(), is(true), 'newTodoInput.focus')
    .perform(app.keyboard.type('My todo'))
    .perform(app.keyboard.press('Enter'));

  const todo = app.todoList.todos.first();

  test
    .assert(todo.toggle.isChecked(), is(false), 'toggle.checked')
    .perform(todo.toggle.click())
    .assert(todo.toggle.isChecked(), is(true), 'toggle.checked');
});
