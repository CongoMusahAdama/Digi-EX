import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";      //yet to be created
import { protect } from "../middlewares/authMiddleware.js"; //yet to be created
const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getMe);


export default router;