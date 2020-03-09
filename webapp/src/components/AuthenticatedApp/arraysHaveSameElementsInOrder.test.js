import { arraysHaveSameElementsInOrder } from "./AuthenticatedApp";
import cases from "jest-in-case";

const casify = objs =>
  objs.map(obj => ({
    name: `[${obj.arr1}] and [${obj.arr2}]`,
    arr1: obj.arr1,
    arr2: obj.arr2,
  }));

describe("arraysHaveSameElementsInOrder", () => {
  cases(
    "returns true if arrays have same elements in order",
    args => {
      expect(arraysHaveSameElementsInOrder(args.arr1, args.arr1)).toBe(true);
    },
    casify([
      { arr1: ["a", "b", "c"], arr2: ["a", "b", "c"] },
      {
        arr1: [1, "b", "c", 45],
        arr2: [1, "b", "c", 45],
      },
    ])
  );
  cases(
    "returns false if arrays have same elements but in different order",
    args => {
      expect(arraysHaveSameElementsInOrder(args.arr1, args.arr2)).toBe(false);
    },
    casify([
      {
        arr1: ["a", "b", "c"],
        arr2: ["b", "c", "a"],
      },
      {
        arr1: [1, "b", "c", 45],
        arr2: ["b", 1, 45, "c"],
      },
    ])
  );

  cases(
    "returns false if arrays have different elements but same length",
    args => {
      expect(arraysHaveSameElementsInOrder(args.arr1, args.arr2)).toBe(false);
    },
    casify([
      {
        arr1: ["d", "a", "c"],
        arr2: ["b", "c", "a"],
      },
      {
        arr1: [2, "c", "f", 45],
        arr2: ["b", 1, 45, "c"],
      },
    ])
  );

  cases(
    "returns false if arrays have different lengths",
    args => {
      expect(arraysHaveSameElementsInOrder(args.arr1, args.arr2)).toBe(false);
    },
    casify([
      {
        arr1: ["a", "a", "c", "p"],
        arr2: ["b", "c", "a"],
      },
      {
        arr1: [2, "c", "f", 45],
        arr2: ["b", 1, 45, "c", "d"],
      },
    ])
  );
});
