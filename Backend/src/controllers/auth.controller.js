import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import tokenBlacklistModel from "../models/blacklist.model.js";

/**
 * @name registerUserController
 * @description Register a new user.
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required. Kindly fill in all information."
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {

        if (isUserAlreadyExists.email === email) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        if (isUserAlreadyExists.username === username) {
            return res.status(400).json({
                message: "Username already taken."
            });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user, exprecs email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token",token)

    res.status(200).json({
        message: "User loggedIn successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description clear token from user and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {

    const token=req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access Private
 */
async function getMeController(req, res) {

    const user=await userModel.findById(req.user.id)

    res.status(200).json({
   message :"User details fetched successfully",
       user:{
              id:user._id,
              username:user.username,
              email:user.email
       }
    })
}

export { registerUserController,
    loginUserController,
    logoutUserController,
    getMeController };