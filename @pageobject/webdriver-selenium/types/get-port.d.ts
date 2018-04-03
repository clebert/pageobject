declare module 'get-port' {
  interface Options {
    readonly port?: number;
  }

  function getPort(options?: Options): Promise<number>;

  export = getPort;
}
