// controller/authController.js
import { hashPassword } from "../utils/utils.js"; // Correct path
import User from "../models/SigninModel.js"; // Adjust import if your model is named differently

export const signInController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashpass = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashpass,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while signing in a user...",
      error: error.message,
    });
  }
};
