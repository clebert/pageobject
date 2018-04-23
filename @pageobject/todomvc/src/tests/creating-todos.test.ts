import {Predicate} from '@pageobject/base';
import {TodoMVC} from '..';

const {is} = Predicate;

TodoMVC.jest('Creating todos', (test, app) => {
  test.perform(app.page.goto('http://todomvc.com/examples/react/#/'), 30);

  test
    .assert(app.newTodoInput.hasFocus(), is(true))
    .perform(app.keyboard.type('My first todo'))
    .perform(app.keyboard.press('Enter'))

    .assert(app.newTodoInput.hasFocus(), is(true))
    .perform(app.keyboard.type('My second todo'))
    .perform(app.keyboard.press('Enter'))

    .assert(app.todoList.todos.first().label.getText(), is('My first todo'))
    .assert(app.todoList.todos.last().label.getText(), is('My second todo'));
});
