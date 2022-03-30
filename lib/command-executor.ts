import { RegistryWithEffects, Result } from "./commands/types";

export const executeCommand = <Eff>(
  registry: RegistryWithEffects<Eff>,
  effects: Eff,
  command: string,
  args: ReadonlyArray<string>
): Promise<Result> => {
  const handler = registry[command];

  if (handler) {
    return handler(effects)(args);
  } else {
    return Promise.resolve(Result.continue(`Unrecognized command: ${command}`));
  }
};
