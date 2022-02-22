import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { TaskEither } from "fp-ts/TaskEither";
import { Result } from "./command_model";

const fromPromise = <Args, R>(p: (...a: readonly Args[]) => Promise<R>) => TE.tryCatchK(p, errorToResult);

const fail = (result?: Result) => TE.throwError(() => result || Result.continue());
const success = (result?: Result) => TE.map(() => result || Result.continue());
const custom = <L1, R1, L2, R2>(func: (arg0: TaskEither<L1, R1>) => TaskEither<L2, R2>) => func;

function asyncForEach<In, Err>(
  func: (arg0: In) => TaskEither<Err, void>
): (arg0: AsyncGenerator<In, unknown, unknown>) => TaskEither<Result, void> {
  return (arg0) => {
    const promiseFunc = async () => {
      for await (const value of arg0) {
        const result = await func(value)();

        if (result._tag === "Left") {
          throw result.left;
        }
      }
    };

    return TE.tryCatch(promiseFunc, errorToResult);
  };
}

function errorToResult(reason: unknown): Result {
  return Result.continue(`Command returned an error:\n${reason}`);
}

export function run<L, R>(task: TaskEither<L, R>): Promise<L | R> {
  return TE.foldW(T.of, T.of)(task)();
}

export const Stage = {
  ...TE,
  fail,
  success,
  custom,
  error: TE.left,
};

export const Adapt = {
  asyncForEach,
  fromPromise,
};
