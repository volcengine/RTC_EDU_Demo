/**
 * 获取固定比例的元素宽高
 * @param width
 * @param height
 * @param rate 宽 / 高
 *
 */

const getBoardSize = (
  width: number,
  height: number,
  rate: number = 4 / 3
): {
  width: number;
  height: number;
} => {
  let h = height;
  let w = h * rate;

  if (w > width) {
    w = width;
    h = w / rate;
  }

  return {
    width: w,
    height: h,
  };
};

export default getBoardSize;
