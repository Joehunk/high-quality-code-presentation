import { asyncIterableToGenerator } from "../lib/file_system";

test("async iterable to generator", async () => {
  const expected = [1, 2, 3, 4];
  const asyncIterable = Promise.resolve(expected);
  const asAsnycGenerator = asyncIterableToGenerator(() => asyncIterable);

  const actual = [];

  for await (const value of asAsnycGenerator()) {
    actual.push(value);
  }

  expect(actual).toMatchObject(expected);
});
