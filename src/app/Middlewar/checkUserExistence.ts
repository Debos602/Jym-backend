import { Request, Response, NextFunction } from 'express';
import UserModel from '../modules/user/user.model';
// Assuming UserModel is correctly imported

// Middleware to check if a user already exists based on email
const checkUserExistence = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'User already exists with this email',
            });
        }

        // If no user found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while checking user existence.',
        });
    }
};

export default checkUserExistence;
