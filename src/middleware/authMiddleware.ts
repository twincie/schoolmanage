import { Request, Response, NextFunction } from "express";
import { extractRoleFromToken } from "../utils/jwtUtils";

export const roleCheckMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return
    }

    // Extract role from the token
    const role = extractRoleFromToken(token);
    if (!role) {
      res.status(401).json({ message: "Invalid or expired token." });
      return
    }

    // Check if the user's role is allowed
    if (!allowedRoles.includes(role)) {
      res.status(403).json({ message: "Access denied. You do not have permission to access this resource." });
      return
    }

    // Proceed to the next middleware or controller
    next();
  };
};