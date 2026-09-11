const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-flash-lite-latest"; // verify exact model string in Google AI Studio docs

export async function askFreenanceAI(prompt: string, context: string): Promise<string> {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: `${context}\n\nUser question: ${prompt}` }],
                    },
                ],
            }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API error: ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response.";
}