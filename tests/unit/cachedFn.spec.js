/*
 * @Author: weicong
 * @Date: 2020-07-24 21:34:18
 * @LastEditTime: 2020-07-24 21:34:28
 * @LastEditors: weicong
 * @Description:
 */
import cachedFn from "@/utils/cachedFn";

const fn = () => {
  let i = 1000000;
  while (--i) {}
  return i;
};

const get = () => {
  return 123;
};

test("测试 cachedFn", () => {
  const f = cachedFn(fn);
  const g = cachedFn(get);
  expect(f()).toBe(0);
  expect(f()).toBe(0);
  expect(g()).toBe(123);
  expect(g()).toBe(123);
});
