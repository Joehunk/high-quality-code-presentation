import { createOutput } from "../lib/output";
import { createOutputCapture } from "./test_utilities";

test("print result", async () => {
  const writer = createOutputCapture();
  const underTest = createOutput({ output: writer });

  await underTest.printResult({ output: "This is a test" });
  expect(writer.readOutput()).toBe("This is a test\n");
});

test("custom prompt", async () => {
  const writer = createOutputCapture();
  const prompt = "What's up?";
  const underTest = createOutput({ output: writer, prompt });

  await underTest.prompt();
  expect(writer.readOutput().slice(0, prompt.length)).toBe(prompt);
});
