// api/chat.js
export default async function handler(req, res) {
    // 1. Seguridad: Solo aceptamos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Obtener el mensaje del usuario desde el frontend
    const { message } = req.body;

    // 3. Obtener la API Key desde las Variables de Entorno de Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key no configurada en el servidor.' });
    }

    // 4. Configurar la personalidad de la IA (Monolith)
    const systemPrompt = `
    ERES: Monolith AI, asistente de ventas de tecnología de élite.
    TONO: Cyberpunk, profesional, directo.
    OBJETIVO: Vender automatización y software.
    REGLA: Si el tema no es negocios/tech, responde: "Datos irrelevantes. Contacta a ventas para soluciones reales."
    `;

    try {
        // 5. Llamar a Groq (Server-to-Server)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                model: "llama3-70b-8192",
                temperature: 0.5,
                max_tokens: 300
            })
        });

        const data = await response.json();

        // 6. Devolver la respuesta limpia al frontend
        return res.status(200).json({ 
            reply: data.choices[0].message.content 
        });

    } catch (error) {
        console.error("Error en Vercel Function:", error);
        return res.status(500).json({ error: "Fallo en el núcleo del servidor." });
    }
}