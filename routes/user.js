import { Router } from "express";
const router = Router();
import protect from "../middlewares/authMiddleware.js";
import userController from "../controllers/user.js";
import {
  register_user_validator,
  login_user_validator,
  update_user_validator,
} from "../middlewares/validator.js";
import { validationHandler } from "../helpers/validation.js";
import upload from "../utils/fileUpload.js";

// ============= Register User =============
router.post(
  "/register",
  validationHandler(register_user_validator),
  userController.registerUser
);

// ============= log In =============
router.post(
  "/login",
  validationHandler(login_user_validator),
  userController.loginUser
);

// ============= Login Status =============
router.get("/login-status", userController.loginStatus);

// ============= Get User =============
router.get("/", protect, userController.getUser);

// ============= Update User =============
router.patch(
  "/update-user",
  protect,
  upload.array("photo", 1),
  validationHandler(update_user_validator),
  userController.updateUser
);

// ============= Get User By Id =============
router.get("/search/:id", protect, userController.getUserById);

// ============= Get Users By Name =============
router.post("/search/name", protect, userController.getUsersByName);

// ============= Activate User =============
router.get("/login/:token/:id", userController.activateUser);

// ============= Get All Users =============
router.get("/all" , protect, userController.getAllUsers);

// ============= Delete User Account =============
router.delete("/delete/:id", protect, userController.deleteUser);

const userRouters = router;
export default userRouters;
