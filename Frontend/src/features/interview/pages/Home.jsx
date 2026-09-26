import React, { useState, useRef } from "react"
import { useNavigate } from "react-router"
import "../style/home.scss"
import { useInterview } from "../hook/useInterview.js"
import { useAuth } from "../../auth/hooks/useAuth.js"

const Home = () => {

    const { loading, generateReport, reports, deleteReport } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [showHistory, setShowHistory] = useState(false)
    const [resumeFile, setResumeFile] = useState(null)
    const [formError, setFormError] = useState("")

    const resumeInputRef = useRef()
    const navigate = useNavigate()
    const { handleLogout } = useAuth()

    const handleDeleteReport = async (e, reportId) => {
        e.stopPropagation()

        const confirmed = window.confirm(
            "Do you really want to delete this interview report?"
        )

        if (!confirmed) {
            return
        }

        try {
            await deleteReport(reportId)
        } catch (error) {
            console.error("Failed to delete report:", error)
        }
    }

    const handleUserLogout = async () => {
        await handleLogout()
        navigate("/login")
    }
    const handleGenerateReport = async () => {
        setFormError("")
        if (!jobDescription.trim()) {
            setFormError("Job Description is required.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setFormError("Please provide either your Resume or Self Description or both.")
            return
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            navigate(`/interview/${data._id}`)

        } catch (error) {
            setFormError(
                error.response?.data?.message ||
                "Something went wrong while generating your interview report."
            )
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                </div>
            </main>
        )
    }

    return (
        <div>
            <main className="home">

                <button
                    className="logout-button"
                    onClick={handleUserLogout}
                    type="button"
                >
                    <span aria-hidden="true">↪</span>
                    Logout
                </button>
                {/* Toggle button for showing/hiding recent history of interview reports */}
                <button
                    className="history-toggle"
                    onClick={() => setShowHistory(!showHistory)}
                    aria-label="Toggle history"
                >
                    ☰
                </button>


                {showHistory && (reports.length > 0 && (
                    <section className="recent-history">
                        <h2>My Recent Interview Plans</h2>

                        <ul className="reports-list">
                            {reports.map(report => (
                                <li
                                    key={report._id}
                                    className="report-item"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="report-title-row">
                                    <h3>{report.title || "Untitled Report"}</h3>
                                    <button
                                        type="button"
                                        className="delete-report-button"
                                        aria-label={`Delete ${report.title || "interview report"}`}
                                        onClick={(e) => handleDeleteReport(e, report._id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path></svg>
                                    </button>
                                    </div>
                                    <p className="report-meta">
                                        Generated on {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className={`match-score ${report.matchScore >= 80 ? 'high' : report.matchScore >= 50 ? 'medium' : 'low'}`}>
                                        Match Score: {report.matchScore}%
                                    </p>


                                </li>
                            ))}

                        </ul>
                    </section>
                ))}


                <section className="workspace" aria-labelledby="page-title">
                    <div className="intro">
                        <span className="eyebrow"><span aria-hidden="true">✦</span> AI-POWERED INTERVIEW ANALYSIS</span>
                        <span className="breadcrumb">Workspace / Interview Analysis system</span>
                        <h1 id="page-title">Generate Your Interview Preparation Report</h1>
                        <p>Provide the job description, your resume, and additional context. InterviewAI will analyze your profile <br className="desktop-break" />and generate personalized technical and behavioral interview questions, identify skill gaps,<br className="desktop-break" /> and create a tailored preparation plan </p>
                    </div>

                    <div className="interview-input-group">
                        <div className="panel job-panel">
                            <div className="panel-heading">
                                <span className="panel-icon" aria-hidden="true">▣</span>
                                <div>
                                    <label htmlFor="jobDescription">Job Description</label>
                                </div>
                            </div>
                            <textarea
                                onChange={(e) => setJobDescription(e.target.value)}
                                name="jobDescription" id="jobDescription" placeholder="Paste the complete job description here..."></textarea>
                            <p className="panel-hint"><span aria-hidden="true">⌖</span> Pro-tip: Include required skills, experience, responsibilities, and tech stack for more relevant questions.</p>
                        </div>

                        <div className="right">
                            <div className="panel resume-panel">
                                <div className="panel-heading">
                                    <span className="panel-icon purple" aria-hidden="true">▣</span>
                                    <div>
                                        <label htmlFor="resume">Upload Your Resume</label>
                                    </div>
                                    <small className="file-type">PDF only</small>
                                </div>
                                <label className="file-label" htmlFor="resume">
                                    {resumeFile ? (
                                        <div className="selected-file">
                                            <div className="file-icon" aria-hidden="true">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM14 3.5L18.5 8H15C14.45 8 14 7.55 14 7V3.5ZM6 20V4H13V8C13 9.1 13.9 10 15 10H18V20H6ZM8 13H16V14.5H8V13ZM8 16H16V17.5H8V16Z" />
                                                </svg>
                                            </div>

                                            <div className="selected-file-info">
                                                <strong>{resumeFile.name}</strong>
                                                <span>PDF • {(resumeFile.size / 1024).toFixed(1)} KB</span>
                                            </div>

                                            <span className="file-selected">✓</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="upload-icon" aria-hidden="true">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M12 3L5 10H9V16H15V10H19L12 3ZM5 19H19V21H5V19Z" />
                                                </svg>
                                            </span>

                                            <strong>
                                                Drag &amp; drop PDF resume or <u>browse</u>
                                            </strong>

                                            <span className="upload-hint">
                                                Maximum file size supported
                                            </span>
                                        </>
                                    )}
                                </label>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    accept=".pdf"
                                    onChange={(e) => setResumeFile(e.target.files[0] || null)}
                                />
                            </div>

                            <div className="panel self-panel">
                                <div className="panel-heading">
                                    <span className="panel-icon cyan" aria-hidden="true">▤</span>
                                    <div>
                                        <label htmlFor="selfDescription">Self Description &amp; Context</label>

                                    </div>
                                </div>
                                <textarea
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    name="selfDescription" id="selfDescription" placeholder="Tell us about yourself, your experience level, key achievements not covered in your resume, or specific areas you want to focus on..."></textarea>
                            </div>
                        </div>
                    </div>
                    {formError && (
                        <p className="form-error">
                            <span aria-hidden="true">⚠</span>
                            {formError}
                        </p>
                    )}

                    <button
                        onClick={handleGenerateReport}
                        className="button primary-button" type="button"><span aria-hidden="true">✦</span> Generate Interview Report</button>
                    <p className="report-note"><span aria-hidden="true">◌</span> Your personalized report will be ready in under a minute.</p>
                </section>


            </main>

        </div>

    )
}

export default Home;