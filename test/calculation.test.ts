import { calculationByCategory, calculateGPM, calculateNPM, calculateAssets, calculateLiabilities, calculateWCR } from "../util/calculation";
import { data1 } from "./data1";
import { data2 } from "./data2";
import { data3 } from "./data3";

test("testcase1", () => {
  expect(calculationByCategory(data1, "revenue")).toBe(32755);
});

test("testcase2", () => {
  expect(calculationByCategory(data1, "expense")).toBe(567);
});

test("testcase3", () => {
    expect(calculateGPM(data2, 150000)).toBe(22)
})

test("testcase4", () => {
    expect(calculateNPM(23188, 1231)).toBe(95)
})

test("testcase5", () => {
    expect(calculateAssets(data3)).toBe(27383)
})

test("testcase6", () => {
    expect(calculateLiabilities(data3)).toBe(1120)
})

test("testcase7", () => {
    expect(calculateWCR(111, 234)).toBe(47)
})
