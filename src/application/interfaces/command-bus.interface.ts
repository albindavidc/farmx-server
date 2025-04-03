// export interface CommandBus {
//   execute<T>(command: T): Promise<any>;
// }

export interface CommandHandler<TCommand> {
  execute(command: TCommand): Promise<any>;
}

export interface CommandBus {
  registerHandler(
    commandName: string,
    handler: CommandHandler<any>
  ): void;
  execute<T>(command: T): Promise<any>;
}
