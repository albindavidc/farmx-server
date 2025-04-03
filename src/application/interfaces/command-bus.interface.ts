export interface CommandBus {
  execute<T>(command: T): Promise<any>;
}
