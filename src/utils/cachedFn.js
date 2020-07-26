/*
 * @Author: weicong
 * @Date: 2020-07-24 21:34:37
 * @LastEditTime: 2020-07-24 21:34:50
 * @LastEditors: weicong
 * @Description:
 */

export default fn => {
  const cacheMap = new Map();
  return () => {
    let hit = cacheMap.get(fn);
    if (!hit) {
      const data = fn();
      cacheMap.set(fn, data);
      return data;
    }
    return hit;
  };
};
