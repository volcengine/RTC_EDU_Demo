type Handler<T> = <K extends keyof T>(k: K) => void;

export function eachKeys<T extends Record<string, any>>(obj: T, handler: Handler<T>) {
  Object.keys(obj).forEach((key) => {
    handler(key);
  });
}
