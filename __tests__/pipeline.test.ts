import { pipe } from "fp-ts/function";
import { Result } from "../lib/commands/command_model";
import { Adapt, run, Stage } from "../lib/commands/pipeline";

test("async for each", async () => {
  async function* asyncGenerateOneToTen(): AsyncGenerator<number, void, unknown> {
    for (let i = 1; i <= 10; i++) {
      yield i;
    }
  }

  const collectedResults: number[] = [];
  const expectedResults = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const addResultToCollection = (r: number) =>
    Stage.fromTask(async () => {
      collectedResults.push(r);
    });

  const pipeline = pipe(Stage.of(asyncGenerateOneToTen()), Stage.chain(Adapt.asyncForEach(addResultToCollection)));

  await run(pipeline);
  expect(collectedResults).toMatchObject(expectedResults);
});

test("from promise", async () => {
  const underTest = Adapt.fromPromise(() => Promise.resolve(true));
  const result = await run(underTest());

  expect(result).toBe(true);
});

test("from promise with fail", async () => {
  const underTest = Adapt.fromPromise(() => Promise.reject("nope"));
  const result = await run(underTest());

  expect(result.output).toMatch(/nope/);
  expect(result.shouldExit).toBe(false);
});
