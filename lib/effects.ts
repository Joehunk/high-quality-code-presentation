import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { exceptionToError } from "./util";

export type CommandEffect<In, Out> = (arg: In) => Promise<Out>;

export type StreamingCommandEffect<In, TGen, TReturn = void, TNext = void> = (
  arg: In
) => AsyncGenerator<TGen, TReturn, TNext>;

export const pipeStreamToSink = <In, Out, U = unknown, V = unknown>(
  stream: StreamingCommandEffect<In, Out, U, void>,
  sink: CommandEffect<Out, V>
): CommandEffect<In, void> => {
  return async (arg) => {
    for await (const value of stream(arg)) {
      await sink(value);
    }
  };
};

export const pipeErrorToEffect = <TAny>(errorSink: CommandEffect<string, TAny>) => <In, Out>(
  effect: CommandEffect<In, Out>
): CommandEffect<In, Out | undefined> => {
  return async (arg) => {
    try {
      return await effect(arg);
    } catch (e) {
      if (e instanceof Error) {
        await errorSink(e.message);
      } else {
        await errorSink("Unknown error");
      }
      return undefined;
    }
  };
};

export const mapEffectOutput = <Out1, Out2>(func: (result: Out1) => Out2) => <In>(
  effect: CommandEffect<In, Out1>
): CommandEffect<In, Out2> => {
  return async (arg) => func(await effect(arg));
};

export const mapEffectInput = <In1, In2>(func: (input: In1) => In2) => <Out>(
  effect: CommandEffect<In2, Out>
): CommandEffect<In1, Out> => {
  return (arg) => effect(func(arg));
};

export const addNewline = mapEffectInput((line: string) => line + "\n");

/**
 * Convert a {@link CommandEffect} to an fp-ts {@link T.Task} by binding its input
 * argument.
 *
 * @param arg The input argument to the {@link CommandEffect}
 * @returns
 */
export const toTask = <In>(arg: In) => <Out>(effect: CommandEffect<In, Out>): T.Task<Out> => () => effect(arg);

/**
 * Convert a {@link CommandEffect} to an fp-ts {@link T.TaskEither} by binding its input
 * argument and marshalling any exception into the Error case of
 * the Either.
 *
 * @param arg The input argument to the {@link CommandEffect}
 * @returns
 */
export const toTaskEither = <In>(arg: In) => <Out>(effect: CommandEffect<In, Out>): TE.TaskEither<Error, Out> =>
  TE.tryCatch(() => effect(arg), exceptionToError);
