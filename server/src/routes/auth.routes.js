import { Router } from "express";
import { registerUserController, loginUserController, refreshAccessTokenController, getUserProfileController, logoutUserController  } from "../controllers/auth.controller.js";
import { registerUserValidator,loginUserValidator  } from "../validations/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register',registerUserValidator, registerUserController)
authRouter.post('/login',loginUserValidator,loginUserController)
authRouter.post('/refresh-token',refreshAccessTokenController)
authRouter.post('/logout', authenticate, logoutUserController)
authRouter.get('/me', authenticate, getUserProfileController)

export default authRouter