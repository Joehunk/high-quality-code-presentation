import { CommandEffect } from "../effects";

export interface Result {
  output: string;
  shouldExit: boolean;
}

export type PureCommand = (args: ReadonlyArray<string>) => Result;

export type NoEffects = {};

export type EffectfulCommand<E = NoEffects> = (effects: E) => CommandEffect<ReadonlyArray<string>, Result>;

export const Command = {
  pure: (command: PureCommand): EffectfulCommand => () => async (args) => command(args),
  effectful: <E>(command: EffectfulCommand<E>) => command,
};

// I ended up not needing this, but I am keeping it because it took me forever to figure out.
export type EffectType<Registry> = Registry extends Record<string, EffectfulCommand<infer E>> ? E : never;

export type RegistryWithEffects<E> = Record<string, EffectfulCommand<E>>;

export const Result = {
  continue(output?: string): Result {
    return {
      shouldExit: false,
      output: output || "",
    };
  },
  exit(output?: string): Result {
    return {
      shouldExit: true,
      output: output || "Exiting.",
    };
  },
};
