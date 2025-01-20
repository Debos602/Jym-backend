
// Sign-Up Function
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { TUser } from "./user.interface";
import config from "../../config";
import UserModel from "./user.model";

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
    expiresIn: config.jwt_access_expires_in,
  });



  return { result, accessToken }; // Return the user without the password and the token
};

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
    { expiresIn: config.jwt_access_expires_in }, // Correct usage of options
  );

  // Sign refresh token
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in }, // Correct usage of options
  );

  return { user, accessToken, refreshToken };
};


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

const getAllTrainers = async () => {
  const result = await UserModel.find({ role: "trainer" });
  return result;
};

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


const deleteTrainerfromDb = async (_id: string) => {
  const result = await UserModel.findByIdAndDelete(_id);
  return result;
};



// Sign-In Function

export const UserServices = {
  admingSignUpInDB,
  createTrainerInDb,
  signIn,
  deleteTrainerfromDb,
  getAllTrainers,
  updateTrainer
};  
