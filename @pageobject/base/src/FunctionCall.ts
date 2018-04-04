import {inspect} from 'util';

export interface Describable {
  readonly description: string;
}

export type Executable<TResult> = () => Promise<TResult>;

// tslint:disable-next-line no-any
export function serialize(value: any): string {
  return inspect(value, false, null);
}

export class FunctionCall<TResult> implements Describable {
  public readonly context: Describable;
  public readonly description: string;
  public readonly executable: Executable<TResult>;

  public constructor(
    context: Describable,
    name: string,
    args: IArguments | any[], // tslint:disable-line no-any
    executable: Executable<TResult>
  ) {
    this.context = context;
    this.description = `${name}(${[...args].map(serialize).join(', ')})`;
    this.executable = executable;
  }
}
