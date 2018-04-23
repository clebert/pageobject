import {Predicate} from '@pageobject/base';
import {TodoMVC} from '..';

const {is} = Predicate;

TodoMVC.jest('Completing a todo', (test, app) => {
  test.perform(app.page.goto('http://todomvc.com/examples/react/#/'), 30);

  test
    .assert(app.newTodoInput.hasFocus(), is(true))
    .perform(app.keyboard.type('My todo'))
    .perform(app.keyboard.press('Enter'));

  const todo = app.todoList.todos.first();

  test
    .assert(todo.toggle.isChecked(), is(false))
    .perform(todo.toggle.click())
    .assert(todo.toggle.isChecked(), is(true));
});
