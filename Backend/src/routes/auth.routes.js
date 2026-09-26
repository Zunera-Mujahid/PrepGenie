import express from "express"
import {registerUserController,loginUserController,logoutUserController,getMeController} from "../controllers/auth.controller.js"
import authUser from "../middlewares/auth.middleware.js"

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * 
 */
authRouter.post("/register",registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 * 
 */
authRouter.post("/login",loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in blacklist
 * @access Public
 * 
 */
authRouter.get("/logout",logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current user loggen in user details
 * @access Private
 * 
 */
authRouter.get("/get-me",authUser,getMeController)



export default authRouter;