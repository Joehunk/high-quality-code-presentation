export interface OutputReader {
  readOutput(): string;
}

// Notice that I wrote these test utilities before I had any idea how to implement them.
// Part of this is experience: I figure most modern runtimes can easily do things like
// create input streams from strings because I have seen it so much.
export function createInputFromString(input: string): NodeJS.ReadableStream {}

export function createOutputCapture(): NodeJS.WritableStream & OutputReader {}
