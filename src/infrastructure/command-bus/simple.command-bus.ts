import {
  CommandBus,
  CommandHandler,
} from "../../application/interfaces/command-bus.interface";

export class SimpleCommandBus implements CommandBus {
  private handlers: Map<string, CommandHandler<any>> =
    new Map();

  registerHandler(
    commandName: string,
    handler: CommandHandler<any>
  ): void {
    if (this.handlers.has(commandName)) {
      throw new Error(
        `Handler already registered for command: ${commandName}`
      );
    }
    this.handlers.set(commandName, handler);
  }

  async execute<TResult>(command: any): Promise<TResult> {
    const commandName = command.constructor.name;
    const handler = this.handlers.get(commandName);

    if (!handler) {
      throw new Error(
        `No handler registered for command: ${commandName}`
      );
    }

    return handler.execute(command) as Promise<TResult>;
  }
}
