// utils/chatgpt.js
export async function fetchBookRecommendations(userInput) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Suggest 3 books for: ${userInput}` }],
                temperature: 0.7,
            }),
        });
      
        if (!response.ok) {
            throw new Error("Failed to fetch data from API");
        }
  
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No recommendations found.";
    } catch (error) {
        console.error("Error fetching book recommendations:", error);
        return "Error fetching recommendations.";
    }
}
