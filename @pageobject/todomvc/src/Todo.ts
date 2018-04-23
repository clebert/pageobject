import {WebComponent} from '@pageobject/web';
import {Label} from './Label';
import {Toggle} from './Toggle';

export class Todo extends WebComponent {
  public readonly selector: string = 'li';

  public readonly label = new Label(this.adapter, this);
  public readonly toggle = new Toggle(this.adapter, this);
}
