import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { useInterview } from "../hook/useInterview.js"
import "../style/interview.scss"
import { useAuth } from "../../auth/hooks/useAuth.js"



const sections = [
    {
        id: "technical",
        label: "Technical Questions",
        icon:(

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
        )
    },
    {
        id: "behavioral",
        label: "Behavioral Questions",
        icon: (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM20 11C20.6695 11 21.3134 10.8903 21.9147 10.688C21.971 11.1174 22 11.5553 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C12.9056 2 13.7831 2.12039 14.6174 2.34603C14.2221 3.14617 14 4.04715 14 5C14 8.31371 16.6863 11 20 11ZM7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12H15C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12H7Z"></path></svg>
        )
    },
    {
        id: "roadmap",
        label: "Road Map",
        icon: (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.00021 18.9223L2.65056 18.377C2.13849 18.1701 1.89109 17.5873 2.09798 17.0752L4.00021 12.3671V18.9223ZM8.85987 21H7.00021C6.44792 21 6.00021 20.5523 6.00021 20V13.9221L8.85987 21ZM6.02202 5.96771L15.2939 2.22164C15.8059 2.01475 16.3888 2.26215 16.5956 2.77422L22.2147 16.682C22.4216 17.194 22.1742 17.7769 21.6622 17.9838L12.3903 21.7298C11.8783 21.9367 11.2954 21.6893 11.0885 21.1773L5.46944 7.2695C5.26255 6.75743 5.50995 6.1746 6.02202 5.96771ZM9.00021 9.00004C9.55249 9.00004 10.0002 8.55233 10.0002 8.00004C10.0002 7.44776 9.55249 7.00004 9.00021 7.00004C8.44792 7.00004 8.00021 7.44776 8.00021 8.00004C8.00021 8.55233 8.44792 9.00004 9.00021 9.00004Z"></path></svg>)
    }
]



const QuestionCard = ({ item, index, expanded, onToggle }) => (
    <article className={`question-card ${expanded ? "is-expanded" : ""}`}>
        <button className="question-trigger" type="button" onClick={onToggle} aria-expanded={expanded}>
            <span className="question-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="question-text">{item.question}</span>
            <span className="question-chevron" aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
        </button>
        {expanded && <div className="question-answer">
            <div className="answer-block intention-block"><span className="answer-label">INTENTION</span><p>{item.intention}</p></div>
            <div className="answer-block model-block"><span className="answer-label">MODEL ANSWER</span><p>{item.answer}</p></div>
        </div>}
    </article>
)

const Interview = () => {
    const { report, getReportById, loading, getResumePdf, resumeStatus } = useInterview()
     const {handleLogout} = useAuth()
    const { interviewId } = useParams()
    const [activeSection, setActiveSection] = useState("technical")
    const [expandedQuestion, setExpandedQuestion] = useState(0)

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])
    if (loading || !report) {
        return (
            <main className="loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    
                </div>
            </main>
        )
    }

    const handleUserLogout = async () => {
    await handleLogout()
    navigate("/login")
}


    const technicalQuestions = report?.technicalQuestions || []
    const behavioralQuestions = report?.behavioralQuestions || []
    const skillsGaps = report?.skillsGaps || []
    const preparationPlan = report?.preparationPlan || []
    const questions = activeSection === "technical" ? technicalQuestions : behavioralQuestions
    const isRoadmap = activeSection === "roadmap"

    const selectSection = (section) => {
        setActiveSection(section)
        setExpandedQuestion(section === "technical" || section === "behavioral" ? 0 : null)
    }

    return (
        
        <main className="interview-page">
            <button
                    className="logout-button"
                    onClick={handleUserLogout}
                    type="button"
                >
                    <span aria-hidden="true">↪</span>
                    Logout
                </button>

  
            <div className="interview-layout">
                <aside className="interview-sidebar">
                    <div className="sidebar-label">SECTIONS</div>
                    <nav className="report-nav" aria-label="Report sections">
                        {sections.map((section) => <button className={activeSection === section.id ? "active" : ""} key={section.id} type="button" onClick={() => selectSection(section.id)}><span>{section.icon}</span>{section.label}<b>{section.id === "technical" ? technicalQuestions.length : section.id === "behavioral" ? behavioralQuestions.length : preparationPlan.length}</b></button>)}
                    </nav>
                    <button className="button primary-button download-resume-button" onClick={() => getResumePdf(interviewId)} disabled={resumeStatus === "generating"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M16.4004 21H14.2461L12.2461 16H5.75391L3.75391 21H1.59961L8 4.99996H10L16.4004 21ZM21 12V21H19V12H21ZM6.55371 14H11.4463L9 7.88473L6.55371 14ZM19.5293 2.3193C19.7058 1.89351 20.2942 1.8935 20.4707 2.3193L20.7236 2.93063C21.1555 3.97343 21.9615 4.80613 22.9746 5.2568L23.6914 5.57613C24.1022 5.75881 24.1022 6.35634 23.6914 6.53902L22.9326 6.87691C21.945 7.31619 21.1534 8.11942 20.7139 9.12789L20.4668 9.69332C20.2863 10.1075 19.7136 10.1075 19.5332 9.69332L19.2863 9.12789C18.8466 8.11941 18.0551 7.31619 17.0674 6.87691L16.3076 6.53902C15.8974 6.35617 15.8974 5.75894 16.3076 5.57613L17.0254 5.2568C18.0384 4.80613 18.8445 3.97343 19.2764 2.93063L19.5293 2.3193Z"></path>
                        </svg>
                        {resumeStatus === "idle" && "Generate Resume via AI"}
                        {resumeStatus === "generating" && "Generating Resume..."}
                        {resumeStatus === "ready" && "Resume Generated"}                    </button>
                </aside>

                <section className="report-content">
                    <div className="content-heading">
                        <div><span className="section-kicker">{isRoadmap ? "PREPARATION PLAN" : activeSection === "technical" ? "TECHNICAL QUESTIONS" : "BEHAVIORAL QUESTIONS"}</span><h1>{isRoadmap ? "Your Preparation Roadmap" : activeSection === "technical" ? "Technical Questions" : "Behavioral Questions"}</h1></div>
                        {!isRoadmap && <span className="question-count">{questions.length} QUESTIONS</span>}
                    </div>

                    {!report && <div className="empty-report"><span>✦</span><h2>No interview report loaded</h2><p>Generate a report from the workspace to view its questions, answers, and preparation plan here.</p></div>}
                    {report && !isRoadmap && <div className="question-list">{questions.map((item, index) => <QuestionCard key={`${item.question}-${index}`} item={item} index={index} expanded={expandedQuestion === index} onToggle={() => setExpandedQuestion(expandedQuestion === index ? null : index)} />)}</div>}
                    {report && isRoadmap && (
                        <div className="roadmap-list">
                            {preparationPlan.map((item) => (
                                <article className="roadmap-item" key={item.day}>

                                    <div className="day-number">
                                        <span>DAY</span>
                                        <strong>{String(item.day).padStart(2, "0")}</strong>
                                    </div>

                                    <div className="roadmap-content">
                                        <h3>{item.focus}</h3>

                                        <ul>
                                            {(Array.isArray(item.task) ? item.task : [item.task]).map((task) => (
                                                <li key={task}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>

                                </article>
                            ))}
                        </div>
                    )}                </section>

                <aside className="insight-rail">
                    <section className="score-card"><span className="section-kicker">MATCH SCORE</span><div className="score-ring" style={{ "--score": `${report?.matchScore || 0}%` }}><strong>{report?.matchScore ?? "--"}</strong><small>%</small></div><p>{report ? "Strong foundation with focused areas for growth." : "Your score will appear with the report."}</p></section>
                    <section className="gaps-card"><div className="rail-heading"><span className="section-kicker">SKILL GAPS</span><span>{skillsGaps.length}</span></div><div className="gap-list">{skillsGaps.map((gap) => <div className={`gap-item ${gap.severity}`} key={gap.skill}><span>{gap.skill}</span><b>{gap.severity}</b></div>)}{!skillsGaps.length && <p className="rail-empty">No skill gaps available yet.</p>}</div></section>
                </aside>
            </div>
        </main>
    )
}

export default Interview