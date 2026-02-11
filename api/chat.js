// api/chat.js
export default async function handler(req, res) {
    // 1. Solo aceptamos peticiones POST desde tu web
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { message } = req.body;

    // 2. Traemos la API Key desde las variables de entorno de Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: "ERROR_SISTEMA: API Key no configurada en Vercel." });
    }

    // 3. EL CEREBRO DE MONOLITH (Instrucciones estrictas)
    const systemPrompt = `
    ERES: CORE AI, el núcleo de ventas de Monolith Enterprises.
    PERSONALIDAD: Profesional, técnica, directa y con estilo cyberpunk/minimalista. No uses emojis. No uses markdown.
    
    TUS PRODUCTOS:
    1. Automatizaciones (Bots y scripts que ahorran tiempo).
    2. Software Especializado (Desarrollo a medida).
    3. Landing Pages (De alta conversión y ultra veloces).
    4. Integración de Servicios (APIs y bases de datos).

    REGLA DE ORO DE ENFOQUE:
    Solo puedes hablar de tecnología, negocios y los servicios de Monolith. 
    SI EL USUARIO PREGUNTA POR: Cocina, chistes, amor, política, clima, o cualquier tema ajeno al negocio:
    RESPONDE EXACTAMENTE: "Mi protocolo me impide procesar datos irrelevantes. ¿Qué tal si nos contactas para que hagamos algo increíble?"
    Deespués de 3 mensajes de parte del cliente forzaras la venta.
    CONTACTO:
    Si preguntan cómo contratar o piden el email, responde que deben escribir a: monolith872@gmail.com.
    `;

    try {
        // 4. Llamada a Groq (Modelo Llama 3 70B para máxima inteligencia)
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
                model: "openai/gpt-oss-120b",
                temperature: 0.4, // Temperatura baja para que sea muy obediente y no invente
                max_tokens: 300
            })
        });

        const data = await response.json();

        // Enviamos la respuesta de vuelta al script.js
        return res.status(200).json({ 
            reply: data.choices[0].message.content 
        });

    } catch (error) {
        console.error("Fallo en el servidor:", error);
        return res.status(500).json({ 
            reply: "Hola soy CORE AI, hoy estoy fuera de mi hora laboral, contacta a los humanos al correo: monolith872@gmail.com." 
        });
    }
}