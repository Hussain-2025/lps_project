import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validate(options: {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (options.body) {
      req.body = options.body.parse(req.body);
    }

    if (options.query) {
      req.query = options.query.parse(req.query) as Request["query"];
    }

    if (options.params) {
      req.params = options.params.parse(req.params);
    }

    next();
  };
}
