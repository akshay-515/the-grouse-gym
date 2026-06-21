import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // const decoded = jwt.verify(token, JWT_SECRET);
    // (req as any).user = decoded;
    // next();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: number;
      gymId: number;
    };

    req.user = {
      userId: decoded.userId,
      gymId: decoded.gymId
    };

    console.log(req.user);

next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
