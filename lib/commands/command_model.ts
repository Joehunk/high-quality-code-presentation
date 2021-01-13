export interface Result {
  output: string;
  shouldExit: boolean;
}

export interface SingleCommandProcessor {
  command: string;
  process(args: string[]): Result;
}
