import { createOutput } from "../lib/output";
import { createOutputCapture } from "./test_utilities";

test("print result", async () => {
  const writer = createOutputCapture();
  const underTest = createOutput({ outputStream: writer });

  await underTest.write("Hello World!\n");
  expect(writer.readOutput()).toBe("Hello World!\n");
});
