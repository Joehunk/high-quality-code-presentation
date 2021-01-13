import { createCommandProcessor } from "../lib/command_processor";

// Look a nice functional non-side-effecting test.
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
    // Ahh this is nice. I was feeling bad about the special case code in the
    // main function that printed "Exiting." and this lets me get rid of it.
    output: "Exiting.",
    shouldExit: true,
  });
});
