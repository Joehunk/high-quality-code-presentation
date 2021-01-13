import { Readable } from "stream";
import * as memStreams from "memory-streams";

export interface OutputReader {
  readOutput(): string;
}

export function createInputFromLines(...lines: string[]): NodeJS.ReadableStream {
  return Readable.from(lines.map((x) => x + "\n"));
}

export function createInputFromString(input: string): NodeJS.ReadableStream {
  return createInputFromLines(input);
}

export function createOutputCapture(): NodeJS.WritableStream & OutputReader {
  return new (class extends memStreams.WritableStream {
    readOutput(): string {
      return this.toString();
    }
  })();
}
