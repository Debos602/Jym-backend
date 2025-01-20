import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utils/catcgAsync';
import { TDecodedToken } from '../modules/user/user.interface';

const auth = (requiredRole: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
        errorDetails: 'You must be an admin to perform this action.',
      });
    }

    // Extract the token by removing the "Bearer " prefix
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(
      token,
      config.jwt_access_token_secret as string,
      (err, decoded) => {

        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized access.',
            errorDetails: 'Invalid or expired token.',
          });
        }

        const decodedToken = decoded as TDecodedToken;

        // Check if the decoded role matches the required role
        if (decodedToken?.role !== requiredRole) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized access.',
            errorDetails: `You must be a(n) ${requiredRole} to perform this action.`,
          });
        }

        // Optionally attach user information to request
        req.user = { _id: decodedToken.userId, role: decodedToken.role };

        // Proceed to the next middleware or route handler
        next();
      },
    );
  });
};

export default auth;
