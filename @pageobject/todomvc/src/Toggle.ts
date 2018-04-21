import {Effect} from '@pageobject/base';
import {WebComponent} from '@pageobject/web';

export class Toggle extends WebComponent {
  public readonly selector: string = '.toggle';

  public isChecked(): Effect<boolean> {
    return async () =>
      (await this.findUniqueNode()).execute(
        (element: HTMLInputElement) => element.checked
      );
  }
}
