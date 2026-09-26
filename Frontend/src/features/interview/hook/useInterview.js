import {  generateInterviewReport, getInterviewReportById, getAllInterviewReports,generateResumePdf,deleteInterviewReport} from "../services/interview.api.js"
import { useContext,useEffect,useState } from "react"
import { useParams } from "react-router"
import { InterviewContext } from "../interview.context.jsx"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [resumeStatus, setResumeStatus] = useState("idle")

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById({ interviewId })
            setReport(response.interviewReport)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getAllReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReports
    }

    const getResumePdf = async () => {
    setResumeStatus("generating")
    let response = null
    try {
        response = await generateResumePdf(interviewId)
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `resume_${interviewId}.pdf`)
        document.body.appendChild(link)
        link.click()
        setResumeStatus("ready")

    } catch (error) {
        setResumeStatus("idle")
        throw error
    } 
    return response
}

const deleteReport = async (interviewId) => {
    try {
        await deleteInterviewReport(interviewId)

        setReports((currentReports) =>
            currentReports.filter(
                (report) => report._id !== interviewId
            )
        )
    } catch (error) {
        throw error
    }
}


     useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }else{
            getAllReports()
        }
       },[interviewId])
     
    return { loading, report, reports, generateReport, getReportById, getAllReports,getResumePdf,resumeStatus,deleteReport }
 }


