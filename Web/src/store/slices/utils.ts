type Handler<T> = <K extends keyof T>(k: K) => void;

// todo 修改redux state不生效 待看下redux源码
export function eachKeys<T extends Record<string, any>>(obj: T, handler: Handler<T>) {
  Object.keys(obj).forEach((key) => {
    handler(key);
  });
}
