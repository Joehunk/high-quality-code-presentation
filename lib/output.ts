import { createOutputCapture } from "../__tests__/test_utilities";

export interface Output {
  writeOutput(output: string): void;
}

export function createOutput(outputStream: NodeJS.WritableStream): Output {
  return {
    writeOutput(output: string): void {
      outputStream.write(output);
    },
  };
}
