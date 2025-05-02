import express from "express";
import { signInController } from "../controllers/signInController.js";

// import { adminLogin } from "../controllers/AdminLogincontroller.js";

// ROUTER INSTANCE
const router = express.Router();

// API ROUTES
// SignIn
// http://localhost:1814/api/v2/Quizdb/signin
// LogIn
//http://localhost:1814/api/v2/Quizdb/admin/login
router.post("/signin", signInController);




console.log("Registered POST /Signin route");

export default router;