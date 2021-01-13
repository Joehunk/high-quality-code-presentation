import { createOutput } from "../lib/output";
import { createOutputCapture } from "./test_utilities";

test("print result", () => {
  // Notice how we are able to reuse these test helpers in tests we didn't even predict
  // because they arose from a refactoring we had not planned.
  const writer = createOutputCapture();
  const underTest = createOutput({ output: writer });

  // Here we are still testing a side effect, but since a command line app involves
  // IO, at some point we MUST test side effects. The difference is that now our
  // effectful code is decoupled from our functional code.
  underTest.printResult({ output: "This is a test" });
  expect(writer.readOutput()).toBe("This is a test\n");
});

// And with this test we now have test coverage equal to before the refactoring,
// but it is architected a lot better.
test("custom prompt", () => {
  const writer = createOutputCapture();
  const prompt = "What's up?";
  const underTest = createOutput({ output: writer, prompt });

  underTest.prompt();
  expect(writer.readOutput().slice(0, prompt.length)).toBe(prompt);
});
