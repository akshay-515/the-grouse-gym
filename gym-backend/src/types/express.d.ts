import "express";

declare global {
  namespace Express {
    interface UserPayload {
      userId: number;
      gymId: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};