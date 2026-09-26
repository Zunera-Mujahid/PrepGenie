import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const model = "gemini-3.5-flash-lite";

try {
    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            contents: [
                {
                    parts: [
                        {
                            text: "Say hello in one sentence."
                        }
                    ]
                }
            ]
        },
        {
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.Google_GENAI_API_KEY
            }
        }
    );

    console.log("SUCCESS");
    console.log(
        response.data.candidates[0].content.parts[0].text
    );

} catch (err) {

    console.log("STATUS:", err.response?.status);

    console.log(
        "ERROR:",
        JSON.stringify(
            err.response?.data || err.message,
            null,
            2
        )
    );
}