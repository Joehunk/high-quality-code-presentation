import { createCommandOutput, createOutput } from "../lib/output";
import { createOutputCapture } from "./test_utilities";

test("print result", async () => {
  const writer = createOutputCapture();
  const output = createOutput({ outputStream: writer });
  const underTest = createCommandOutput({ output });

  await underTest.printResult({ output: "This is a test" });
  expect(writer.readOutput()).toBe("This is a test\n");
});

test("custom prompt", async () => {
  const writer = createOutputCapture();
  const prompt = "What's up?";
  const output = createOutput({ outputStream: writer });
  const underTest = createCommandOutput({ output, prompt });

  await underTest.prompt();
  expect(writer.readOutput().slice(0, prompt.length)).toBe(prompt);
});
