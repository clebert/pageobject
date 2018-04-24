import {WebComponent} from '@pageobject/web';
import {NewTodoInput} from './NewTodoInput';
import {TodoList} from './TodoList';

export class TodoMVC extends WebComponent {
  public readonly selector: string = '.todoapp';

  public readonly newTodoInput = new NewTodoInput(this.adapter, this);
  public readonly todoList = new TodoList(this.adapter, this);
}
