// utils/hash.js
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error while hashing password:", error);
  
  }
};