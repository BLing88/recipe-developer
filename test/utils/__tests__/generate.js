import { buildArray } from "./generate";

describe("buildArray should construct an array of given length from function", () => {
  test("array of squared numbers", () => {
    const squares = buildArray(10, (_, index) => index * index);
    expect(squares).toHaveLength(10);
    expect(squares).toEqual([1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);
  });
});
