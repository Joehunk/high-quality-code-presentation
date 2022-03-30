import * as fs from "fs";
import * as util from "util";
import { StreamingCommandEffect } from "./effects";

export interface FileSystem {
  listDirectory: StreamingCommandEffect<string, string>;
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

/*

Testing out an approach in this file, inspired by "mocking is a code smell":
https://medium.com/javascript-scene/mocking-is-a-code-smell-944a70c90a6a

The idea is to write software based on units that are individually unit-testable, then compose them
using code that is not unit-testable (i.e. not testable without testing the composed units or by
mocking them). But, that's okay because all the composed bits are tested,
and the composition logic itself is trivial -- or is itself unit tested, although in this case
I am using simple functional composition which is a language feature.

Note: I have not written unit tests for asyncIterableToGenerator() but it is unit testable
by virtue of being a pure function.

In this case, I wanted to be able to adapt the NodeJS readdir function, which is callback-based,
into my abstraction for listFilesInDirectory based on an async generator. So, I made reusable,
unit-testable functionality that adapts a function returning a Promise<Iterable<T>> (as readdir does)
into an async generator, then composed that with fs.readdir and util.promisify (both of which are
provided by Node and do not need to be tested by me).

*/

export function createFileSystem(): FileSystem {
  return {
    listDirectory: asyncIterableToGenerator<[string], string>(util.promisify(fs.readdir)),
  };
}
