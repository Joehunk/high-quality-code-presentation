import * as fs from "fs";
import * as util from "util";
import * as F from "fp-ts/function";
import { boolean } from "fp-ts";

export interface FileSystem {
  listFilesInDirectory(directory: string): AsyncGenerator<string, void, unknown>;
  fileExists(file: string): Promise<boolean>;
  isDirectory(file: string): Promise<boolean>;
}

type ReturnsPromiseOfIterable<In extends unknown[], Out> = (...input: In) => Promise<Iterable<Out>>;
type ReturnsAsyncGenerator<In extends unknown[], Out> = (...input: In) => AsyncGenerator<Out, void, unknown>;

// This shows how you can make a method generic in a higher-order function that takes arbitrary arguments.
export function asyncIterableToGenerator<I extends unknown[], O>(
  promiseIterable: ReturnsPromiseOfIterable<I, O>
): ReturnsAsyncGenerator<I, O> {
  async function* ret(...input: I): AsyncGenerator<O, void, unknown> {
    for (const result of await promiseIterable(...input)) {
      yield result;
    }
  }
  return ret;
}

export function createFileSystem(): FileSystem {
  return {
    listFilesInDirectory: asyncIterableToGenerator<[string], string>(util.promisify(fs.readdir)),
    fileExists: (file) =>
      util
        .promisify(fs.stat)(file)
        .then(() => true)
        .catch(() => false),
    isDirectory: (file) =>
      util
        .promisify(fs.stat)(file)
        .then((stat) => stat.isDirectory())
        .catch(() => false),
  };
}
