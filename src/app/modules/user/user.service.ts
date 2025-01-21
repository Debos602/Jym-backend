import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { TUser } from "./user.interface";
import config from "../../config";
import UserModel from "./user.model";

// Admin Sign-Up Function
const admingSignUpInDB = async (user: TUser) => {
  if (!user.password) {
    throw new Error("Password is required");
  }

  // Hash the password
  const hashedPassword = await hash(user.password, 10);

  // Create the user in the database
  const createdUser = await UserModel.create({ ...user, password: hashedPassword });

  // Fetch the created user while excluding the password field
  const result = await UserModel.findById(createdUser._id).lean();

  // Create JWT payload
  const jwtPayload = {
    userId: createdUser._id,
    role: user.role,
  };

  // Sign the JWT token
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token_secret as string, {
    expiresIn: "365d",
  });

  return { result, accessToken }; // Return the user without the password and the token
};

// Sign-In Function
const signIn = async (email: string, password: string) => {
  // Fetch user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Ensure password is defined
  if (!password || !user.password) {
    throw new Error('Password is required');
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  // Sign access token
  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_token_secret as string,
    { expiresIn: "365d" }, // Correct usage of options
  );

  // Sign refresh token
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: "365d" }, // Correct usage of options
  );

  return { user, accessToken, refreshToken };
};

// Refresh Token Function
const refreshToken = async (token: string) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as jwt.JwtPayload;

    const { userId } = decoded;

    // Find the user associated with the token
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new access token
    const jwtPayload = {
      userId: user._id,
      role: user.role,
    };

    const accessToken = jwt.sign(
      jwtPayload,
      config.jwt_access_token_secret as string,
      { expiresIn: "365d" }, // Set token expiry
    );

    // Return the new access token
    return { accessToken };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Create Trainer Function
const createTrainerInDb = async (user: TUser) => {
  if (!user.password) {
    throw new Error("Password is required");
  }

  // Hash the password
  const hashedPassword = await hash(user.password, 10);

  // Create the user in the database
  const createdUser = await UserModel.create({ ...user, password: hashedPassword });

  // Fetch the created user while excluding the password field
  const result = await UserModel.findById(createdUser._id).select("-password").lean();

  // Create JWT payload
  const jwtPayload = {
    userId: createdUser._id,
    role: user.role,
  };

  // Sign the JWT token
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  return { result, accessToken };
};

// Get All Trainers Function
const getAllTrainers = async () => {
  const result = await UserModel.find({ role: "trainer" });
  return result;
};

// Update Trainer Function
const updateTrainer = async (_id: string, updateData: Partial<TUser>) => {
  // Find the trainer by ID and update it with the new data
  const result = await UserModel.findByIdAndUpdate(_id, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied to updated fields
  });

  // If no trainer is found with the given ID
  if (!result) {
    throw new Error("Trainer not found");
  }

  return result;
};

// Delete Trainer Function
const deleteTrainerfromDb = async (_id: string) => {
  const result = await UserModel.findByIdAndDelete(_id);
  return result;
};

// Export User Services
export const UserServices = {
  admingSignUpInDB,
  createTrainerInDb,
  signIn,
  deleteTrainerfromDb,
  getAllTrainers,
  updateTrainer,
  refreshToken
};