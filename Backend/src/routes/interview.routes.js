import express from "express"
import authUser from "../middlewares/auth.middleware.js"
import {generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController,generateResumePdfController,deleteInterviewReportController} from "../controllers/interview.controller.js"
import upload from "../middlewares/file.middleware.js"

const interviewRouter=express.Router();

/**
 * @route POST /api/interview
 * @description Generate new interview report on the basis of user self desciption, resume pdf and job description
 * @access Private
 */
interviewRouter.post("/",authUser,upload.single("resume"),generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access Private
 */
interviewRouter.get("/report/:interviewId",authUser,getInterviewReportByIdController)

/**
 * @route GET /api/interview
 * @description get all interview reports of logged in user.
 * @access Private
 */
interviewRouter.get("/",authUser,getAllInterviewReportsController)


/**
 * @route  POST /api/interview/resume/pdf
 * @description Generate resume PDF based on user self description, resume and job description
 * @access Private
 */
interviewRouter.post("/resume/pdf/:interviewReportId",authUser,generateResumePdfController)  

/**
 * @route Delete /api/interview/report/:interviewId
 * @description Delete interview report by interviewId
 * @access Private
 */
interviewRouter.delete("/report/:interviewId",authUser,deleteInterviewReportController)
 

export default interviewRouter