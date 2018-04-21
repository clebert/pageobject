import {WebComponent} from '@pageobject/web';
import {Todo} from './Todo';

export class TodoList extends WebComponent {
  public readonly selector: string = '.todo-list';

  public readonly todos = new Todo(this.adapter, this);
}
