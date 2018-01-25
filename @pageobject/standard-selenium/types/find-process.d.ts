declare module 'find-process' {
  interface Process {
    readonly name: string;
    readonly pid: string;
  }

  function find(type: 'name', value: RegExp): Promise<Process[]>;

  export = find;
}
