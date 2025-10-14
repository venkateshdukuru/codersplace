import 'passport';
import { RequestHandler } from 'express';

declare module 'passport' {
  // Override the type of authenticate to always return an Express middleware
  function authenticate(
    strategy: string,
    options?: any
  ): RequestHandler;
}
