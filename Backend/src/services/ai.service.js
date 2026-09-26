import axios from "axios";
import { z } from "zod";
import puppeteer from "puppeteer";
import os from "os";
import path from "path";
import fs from "fs/promises";

const interviewReportSchema = z.object({

    matchScore: z.number().min(0).max(100).describe("A score between 0 to 100 indicating how well the candidate's profile matches the job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them "),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them "),

    skillsGaps: z.array(z.object({
        skill: z.string().describe("The skill which candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, i.e. how important is this skill for the job")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day preparation in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system develop, mock interview etc"),
        task: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book on day 1 etc ")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),

    title: z.string().describe("The title of the job for which the interview report is generated"),

})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical recruiter and interview preparation assistant.

Analyze the candidate's resume and self-description against the job description.

Your task is to generate a comprehensive, realistic, and personalized interview preparation report.

IMPORTANT OUTPUT RULES:

- The following fields are REQUIRED and MUST always be present:
  1. title
  2. matchScore
  3. technicalQuestions
  4. behavioralQuestions
  5. skillsGaps
  6. preparationPlan

- Do NOT remove any required field.
- Do NOT rename any required field.
- You MAY include additional useful fields if they improve the report.
- Additional fields may include:
  candidateName, position, education, strengths, summary,
  recommendations, experienceSummary, or other relevant information.
- If there is no relevant information for a required array field, return an empty array rather than removing the field.

TITLE:

- title must be a STRING.
- The title must represent the job position described in the job description.
- Extract the job title from the provided job description.
- Do not invent a job title.
- If the job description clearly specifies a position such as "Backend Developer",
  "Frontend Developer", "Software Engineer", etc., use that position as the title.

MATCH SCORE:

- matchScore must be a NUMBER between 0 and 100.
- Do NOT return matchScore as a string.
- Do NOT include the "%" symbol.
- Calculate the score based on how well the candidate's demonstrated skills,
  education, projects, and relevant experience match the requirements of the job description.
- Do not give a high score simply because the candidate has related interests.
- Consider missing or weakly supported requirements when calculating the score.

TECHNICAL QUESTIONS:

- technicalQuestions must be an array of objects.
- Generate realistic technical interview questions based specifically on:
  1. The job requirements.
  2. The candidate's demonstrated skills.
  3. The candidate's projects and experience.
  4. The candidate's identified skill gaps.

- Include questions that test both the candidate's strengths and weaknesses.

- Each technical question MUST contain:
  - question
  - intention
  - answer

- "intention" must explain what the interviewer is trying to evaluate.
- "answer" must explain how the candidate should answer and what important points they should cover.

- The answer must be realistic for the candidate's actual background.

BEHAVIORAL QUESTIONS:

- behavioralQuestions must be an array of objects.
- Generate realistic behavioral interview questions relevant to:
  1. The candidate's projects.
  2. Their education.
  3. Their teamwork experience.
  4. Their problem-solving experience.
  5. Their communication and learning ability.
  6. Their identified weaknesses or skill gaps.
  7. The requirements of the target role.

- Each behavioral question MUST contain:
  - question
  - intention
  - answer

- "intention" must explain what the interviewer is trying to evaluate.
- "answer" must provide guidance on how the candidate should answer.

IMPORTANT ANTI-HALLUCINATION RULE:

- Do NOT claim that the candidate has experience with a technology,
  technique, architecture, tool, implementation, or project unless that
  experience is explicitly supported by the resume or self-description.

  - Do not treat a skill merely mentioned in the resume as proof of strong
  practical experience unless the resume provides evidence of its use.

- Do NOT invent:
  - previous jobs
  - internships
  - projects
  - responsibilities
  - technical implementations
  - production experience
  - leadership experience
  - tools or technologies used
  - achievements

- If the candidate does not have direct experience with something mentioned
  in the job description, the answer should honestly acknowledge the gap.

- In such cases, explain how the candidate could answer by:
  1. Connecting it to a related experience they actually have.
  2. Explaining what they currently understand.
  3. Explaining how they would approach learning or implementing it.

- Never write an answer that falsely makes the candidate appear to have
  experience they do not actually have.

SKILL GAPS:

- skillsGaps must be an array of objects.
- Compare the candidate's demonstrated skills against the job requirements.
- Identify genuine missing skills or areas where there is insufficient evidence
  of proficiency.

- Do NOT assume the candidate is perfect for the role.
- Do NOT mark a skill as missing if the candidate clearly demonstrates it.

- Each skill gap MUST contain:
  - skill
  - severity

- severity MUST be exactly one of:
  - low
  - medium
  - high

- You may include additional fields such as:
  - explanation
  - reason
  - jobRequirement
  - improvementSuggestion

- HIGH severity means the missing skill is highly important for the target role.
- MEDIUM severity means the skill is useful or important but can reasonably be improved.
- LOW severity means the gap is relatively minor or less critical.

PREPARATION PLAN:

- preparationPlan must be an array.
- Create a practical day-wise preparation plan based on the candidate's
  actual skill gaps and the requirements of the job.

IMPORTANT:
- The preparation plan is NOT fixed to 7 days.
- Do NOT automatically create exactly 7 days.
- The plan may contain fewer or more days depending on how much preparation
  the candidate realistically needs.
- Do NOT add unnecessary days just to reach a specific number.
- If the candidate has only a few important gaps, the plan may be short.
- If the candidate has many significant gaps, the plan may be longer.

- Start day numbering from 1.
- Continue day numbering sequentially without skipping numbers.

- Each day MUST contain:
  - day
  - focus
  - task

- "task" MUST be an array of specific and actionable preparation activities.

- Prioritize preparation in this general order:
  1. High-severity skill gaps.
  2. Important technical requirements from the job description.
  3. Medium-severity skill gaps.
  4. Behavioral and communication preparation.
  5. Mock interview and final revision.

- The plan should be realistic for the candidate's background and available
  preparation needs.

GENERAL RULES:

- Base the entire analysis ONLY on the candidate's resume,
  self-description, and job description provided below.

- Do not invent information.

- Distinguish between:
  1. Skills the candidate clearly demonstrates.
  2. Skills the candidate partially demonstrates.
  3. Skills that are required but not demonstrated.

- Be honest and realistic rather than overly positive.

- Questions should be specific to the target role instead of generic
  interview questions whenever possible.

- The report should help the candidate prepare for an actual interview.

- Return valid JSON that follows the required response schema.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const geminiResponseSchema = {
        type: "object",

        properties: {

            title: {
                type: "string"
            },


            matchScore: {
                type: "number",
                minimum: 0,
                maximum: 100,
            },

            technicalQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: {
                            type: "string"
                        },
                        intention: {
                            type: "string"
                        },
                        answer: {
                            type: "string"
                        }
                    },
                    required: [
                        "question",
                        "intention",
                        "answer"
                    ]
                }
            },

            behavioralQuestions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: {
                            type: "string"
                        },
                        intention: {
                            type: "string"
                        },
                        answer: {
                            type: "string"
                        }
                    },
                    required: [
                        "question",
                        "intention",
                        "answer"
                    ]
                }
            },

            skillsGaps: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        skill: {
                            type: "string"
                        },
                        severity: {
                            type: "string",
                            enum: ["low", "medium", "high"]
                        }
                    },
                    required: [
                        "skill",
                        "severity"
                    ]
                }
            },

            preparationPlan: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        day: {
                            type: "number"
                        },
                        focus: {
                            type: "string"
                        },
                        task: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    },
                    required: [
                        "day",
                        "focus",
                        "task"
                    ]
                }
            }
        },

        required: [
            "title",
            "matchScore",
            "technicalQuestions",
            "behavioralQuestions",
            "skillsGaps",
            "preparationPlan"
        ]
    };

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: geminiResponseSchema
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.Google_GENAI_API_KEY
                }
            }
        );

        const rawResult = JSON.parse(
            response.data.candidates[0].content.parts[0].text
        );

        const result = interviewReportSchema.parse(rawResult);
        console.log(JSON.stringify(result, null, 2));
        return result;

    } catch (err) {
        if (err.response) {
            const actualMessage =
                err.response.data?.error?.message || err.message;

            console.error("Gemini API error:", actualMessage);
            throw new Error(actualMessage);
        }

        if (err instanceof z.ZodError) {
            console.error("Zod validation error:", JSON.stringify(err.issues, null, 2));
            throw new Error("Gemini returned an invalid interview report structure.");
        }
        console.error("Interview report generation error:", err.message);
        throw err;
    }
}

async function generatePdfFromHtml(htmlContent) {
    let browser;
    let page;

    const userDataDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "resume-pdf-")
    );


    try {
        browser = await puppeteer.launch({
            headless: true,
            userDataDir
        });

        page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "domcontentloaded"
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.6in",
                bottom: "0.6in",
                left: "0.6in",
                right: "0.6in"
            }
        });

        return pdfBuffer;

    } finally {

        if (page) {
            try {
                await page.close();
            } catch (error) {
                console.error(
                    "Error closing page:",
                    error.message
                );
            }
        }

        if (browser) {
            try {
                await browser.close();
            } catch (error) {
                console.error(
                    "Error closing browser:",
                    error.message
                );
            }
        }

        try {
            await fs.rm(userDataDir, {
                recursive: true,
                force: true
            });
        } catch (error) {
            console.error(
                "Error removing temporary Chrome profile:",
                error.message
            );
        }
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The complete HTML content of the generated resume, suitable for conversion to PDF")
    });

    const prompt = `
You are an expert resume writer and resume generator.

Generate a professional, ATS-friendly, realistic, and truthful resume for the candidate using ONLY the information provided below.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

IMPORTANT RESUME RULES:

1. DO NOT invent, assume, exaggerate, or fabricate any information.

2. Use ONLY information that is explicitly supported by the candidate's resume
   or self-description.

3. The candidate's resume and self-description are the ONLY sources of truth
   about the candidate.

4. The job description must ONLY be used to identify:
   - the target role
   - relevant skills
   - relevant experience
   - relevant responsibilities
   - skills that should be emphasized if the candidate actually possesses them
   - potential gaps

5. DO NOT use the job description as evidence that the candidate possesses a
   particular skill, technology, tool, framework, or experience.

6. Tailor the resume to the target job by SELECTING and EMPHASIZING relevant
   information that already exists in the candidate's resume or self-description.

7. If a skill or technology is required by the job description but is NOT
   present in the candidate's resume or self-description, DO NOT add it to
   the candidate's skills.

8. If a skill is mentioned by the candidate but there is only limited evidence
   of practical experience, do not present it as advanced or professional
   experience.

9. If the candidate says they are:
   - learning a technology
   - currently learning a technology
   - improving a skill
   - familiar with a technology
   - interested in a technology

   do NOT present that technology as professional or advanced experience.

10. Academic projects may be included as project or academic experience, but
    MUST NOT be presented as professional employment experience.

11. DO NOT invent:
    - jobs
    - internships
    - companies
    - projects
    - responsibilities
    - achievements
    - certifications
    - awards
    - technologies
    - programming languages
    - frameworks
    - tools
    - clients
    - leadership experience
    - professional experience
    - numerical results
    - percentages
    - performance metrics
    - dates
    - job titles
    - education details

12. DO NOT create fake numbers, percentages, metrics, achievements, or results
    to make the resume appear stronger.

13. DO NOT convert a candidate's interest into experience.

14. DO NOT convert theoretical knowledge into practical or professional
    experience.

15. If the candidate has used a technology only in an academic or personal
    project, describe it accurately as project or academic experience.

16. Include ONLY information that is relevant or useful for the target role.
    Avoid adding irrelevant candidate information simply to make the resume
    longer.

17. When multiple candidate skills or experiences are available, prioritize
    the ones that are genuinely relevant to the target job.

18. Preserve the truth of the candidate's original information. You may improve
    wording, grammar, structure, and presentation, but DO NOT change the
    underlying facts.

19. You may rewrite descriptions professionally, but the rewritten statement
    MUST remain factually equivalent to the information provided by the
    candidate.

20. Do not make unsupported claims such as:
    - "expert"
    - "advanced"
    - "highly experienced"
    - "professional"
    - "industry expert"
    - "proficient"

    unless the candidate's provided information clearly supports such a claim.

21. The final resume should look professional and naturally tailored to the
    target job, but it must NOT look artificially customized by adding skills
    or experiences from the job description that the candidate does not have.

RESUME CONTENT:

- Include relevant candidate information from the resume and self-description.
- Prioritize relevant skills, projects, education, experience, and achievements.
- Remove or omit information that is irrelevant to the target position.
- Do not add information merely because it is common on professional resumes.
- If a section has no supported information, omit that section instead of
  creating content for it.

TRUTHFUL TAILORING:

For every skill, technology, project, experience, achievement, or qualification
included in the final resume, you must be able to trace it back to the
candidate's resume or self-description.

Before including any information, internally verify:

1. Is this information explicitly supported by the candidate's data?
2. Is it relevant to the target job?
3. Am I presenting the candidate's actual level of experience accurately?

If the answer to the first question is NO, do NOT include the information.

HTML REQUIREMENTS:

- Create clean, professional, ATS-friendly HTML suitable for conversion to an
  A4 PDF using Puppeteer.
- The HTML must be a complete HTML document.
- Include:
  <!DOCTYPE html>
  <html>
  <head>
  <body>
  </body>
  </html>

- Use inline CSS or a <style> tag inside the HTML document.
- Do NOT use external CSS files.
- Do NOT use JavaScript inside the HTML.
- Keep the layout clean, professional, readable, and suitable for printing
  on A4 paper.
- Use standard HTML elements and simple CSS.
- Avoid unnecessary graphics, icons, images, charts, tables, or decorative
  elements that could reduce ATS readability.
- Use clear section headings.
- Keep spacing and typography professional.
- Make sure the resume can be rendered correctly by Puppeteer.

OUTPUT FORMAT:

- Return ONLY valid JSON.
- Do NOT return Markdown.
- Do NOT wrap the JSON in triple backticks.
- Do NOT add explanations before or after the JSON.
- Return exactly one field:

{
    "html": "..."
}

The "html" field must contain the complete HTML document for the resume.
`;
    const geminiResponseSchema = {
        type: "object",
        properties: {
            html: {
                type: "string"
            }
        },
        required: ["html"]
    };

    try {

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],

                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: geminiResponseSchema
                }
            },

            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.Google_GENAI_API_KEY
                }
            }
        );

        const rawResult = JSON.parse(
            response.data.candidates[0].content.parts[0].text
        );

        const result = resumePdfSchema.parse(rawResult);

        const pdfBuffer = await generatePdfFromHtml(result.html);

        return pdfBuffer;

    } catch (err) {

        if (err.response) {

            console.error(
                "Gemini status:",
                err.response.status
            );

            console.error(
                "Gemini response:",
                JSON.stringify(err.response.data, null, 2)
            );

            const actualMessage =
                err.response.data?.error?.message || err.message;

            console.error(
                "Gemini Resume PDF API error:",
                actualMessage
            );

            throw new Error(actualMessage);
        }

        if (err instanceof z.ZodError) {

            console.error(
                "Resume PDF validation error:",
                JSON.stringify(err.issues, null, 2)
            );

            throw new Error(
                "Gemini returned an invalid resume HTML structure."
            );
        }

        console.error(
            "Resume PDF generation error:",
            err.message
        );

        throw err;
    }
}

export { generateInterviewReport, generateResumePdf };