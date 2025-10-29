import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userID: string;
      role?: string;
      [key: string]: any;
    };
  }
}
