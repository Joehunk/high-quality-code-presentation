import { Readable } from "stream";
import * as memStreams from "memory-streams";

export interface OutputReader {
  readOutput(): string;
}

// We had to create a more general multi line version of the old function.
// In this case I chose to leave the old function and factor it to call the more
// general version. I could have instead went and changed all the old calls to the
// new version. It is a trade off. If there are few calls I would probably change.
// If there are a lot of calls I would leave the old version.
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
