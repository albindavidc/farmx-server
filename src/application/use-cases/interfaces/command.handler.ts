export interface CommandHandler<TCommand, TResult> {
  execute(command: TCommand): Promise<TResult>;
}

export interface QueryHandler<TQuery, TResult> {
  execute(query: TQuery): Promise<TResult>;
}
