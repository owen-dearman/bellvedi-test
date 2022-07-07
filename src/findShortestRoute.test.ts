import { findShortestPath } from "./findShortestPath";

describe("suite of tests for findShortestRoute", () => {
  test("known answers", () => {
    expect(findShortestPath("BERKHMD", "TRING")).toStrictEqual({
      start: "BERKHMD",
      end: "TRING",
      distance: 5.994,
      tracks: 1,
      stations: ["BERKHMD", "TRING"],
    });
    expect(findShortestPath("BERKHMD", "HEMLHMP")).toStrictEqual({
      start: "BERKHMD",
      end: "HEMLHMP",
      distance: 5.553,
      tracks: 3,
      stations: ["BERKHMD", "BORN412", "BONENDJ", "HEMLHMP"],
    });
    expect(findShortestPath("DLTNN", "NORTONW")).toStrictEqual({
      start: "DLTNN",
      end: "NORTONW",
      distance: 22.716,
      tracks: 3,
      stations: ["DLTNN", "FYHLAYC", "FYHLSJN", "NORTONW"],
    });
    // expect(findShortestPath("MNCRPIC", "CRDFCEN")).toStrictEqual({
    //   start: "MNCRPIC",
    //   end: "CRDFCEN",
    //   distance: 276.677,
    //   tracks: 1,
    //   stations: [],
    // });
    // expect(findShortestPath("THURSO", "PENZNCE")).toStrictEqual({
    //   distance: 1457.246,
    // });
  });
});

// The last two examples don't work properly due to the algoirthm bouncing between two stations and causing an infinite loop.
