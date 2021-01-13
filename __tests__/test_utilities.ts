// Found this on Stack Overflow
import { Readable } from "stream";
import * as memStreams from "memory-streams";

export interface OutputReader {
  readOutput(): string;
}

export function createInputFromString(input: string): NodeJS.ReadableStream {
  return Readable.from([input]);
}

export function createOutputCapture(): NodeJS.WritableStream & OutputReader {
  return new (class extends memStreams.WritableStream {
    readOutput(): string {
      return this.toString();
    }
  })();
}
