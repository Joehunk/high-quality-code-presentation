import { pipe } from "fp-ts/function";
import { Either, Left, Right } from "funfix-core";
import { HasFileSystem, HasOutput } from "../cli_system";
import { Result, SingleCommandProcessor } from "./command_model";

type MaybePromise<T> = T | Promise<T>;

function validateNonEmptyString<Error>(error: Error): (value: string) => Either<Error, string> {
  return (value: string) => {
    if (!value) {
      return Left(error);
    }

    return Right(value);
  };
}

function mapSuccess<In, Out, Err>(func: (arg0: In) => Out): (arg0: Either<Err, In>) => Either<Err, Out> {
  return (value: Either<Err, In>) => {
    return value.map(func);
  };
}

function asyncForEach<In, Err>(
  func: (arg0: In) => MaybePromise<void>
): (arg0: Either<Err, AsyncGenerator<In, unknown, unknown>>) => Promise<Either<Err, void>> {
  return async (input: Either<Err, AsyncGenerator<In, unknown, unknown>>) => {
    if (input.isRight()) {
      for await (const value of input.value) {
        func(value);
      }
    }

    return input.map((_) => {
      return;
    });
  };
}

function unwrapPromise<In, Out>(func: (arg0: In) => Out): (arg0: Promise<In>) => Promise<Out> {
  return (arg0: Promise<In>) => {
    return arg0.then(func);
  };
}

function success<In, Out, Err>(result: (arg0: In) => Out): (arg0: Either<Err, In>) => Either<Err, Out> {
  return (arg0: Either<Err, In>) => {
    return arg0.map(result);
  };
}

export const directoryProcessor: SingleCommandProcessor<HasOutput & HasFileSystem> = {
  command: "ls",
  async process([directoryName]: [string], dependencies: HasOutput & HasFileSystem): Promise<Result> {
    return pipe(
      directoryName,
      validateNonEmptyString(Result.continue("Must supply one argument (directory to list)")),
      mapSuccess(dependencies.fileSystem.listFilesInDirectory),
      asyncForEach(dependencies.output.writeLine),
      unwrapPromise(success((_) => Result.continue()))
    ).then((x) => x.value);
  },
};
