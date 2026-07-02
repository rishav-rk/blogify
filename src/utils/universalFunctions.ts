import { Request, Response } from "express";

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(err);
      next(err);
    });
  };

const pick = (object: Record<string, any>, keys: string[]) => {
  return keys.reduce((obj: Record<string, any>, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export { catchAsync, pick };
