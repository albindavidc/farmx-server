export interface IQueryHander<TQuery, TResult> {
  execute(query: TQuery): Promise<TResult>;
}
