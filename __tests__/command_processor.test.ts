import { createCommandProcessor } from "../lib/command_processor";

test("echo command", async () => {
  const underTest = createCommandProcessor();

  const result = await underTest.processCommand("echo hello");
  expect(result).toMatchObject({
    output: "hello",
    shouldExit: false,
  });
});

test("exit command", async () => {
  const underTest = createCommandProcessor();

  const result = await underTest.processCommand("exit");
  expect(result).toMatchObject({
    output: "Exiting.",
    shouldExit: true,
  });
});
