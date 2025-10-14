import { RequestHandler, Request, Response, NextFunction } from "express";
import { AuthRequest, AuthRequestHandler } from "../types";

export default function asyncHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: AuthRequestHandler<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    Promise.resolve(
      fn(req as AuthRequest & Request<P, ResBody, ReqBody, ReqQuery>, res, next)
    ).catch(next);
  };
}