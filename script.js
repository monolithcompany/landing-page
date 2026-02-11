// ==========================================
// 1. CONFIGURACIÓN
// ==========================================
const GROQ_API_KEY = "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"; 

// ==========================================
// 2. EFECTO HACKER (Logo)
// ==========================================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_!@#$%^&*";
const logo = document.querySelector("#hacker-logo");

function startHackerEffect() {
    if (!logo) return;
    let iteration = 0;
    let interval = setInterval(() => {
        logo.innerText = logo.innerText.split("")
            .map((letter, index) => {
                if(index < iteration) return logo.dataset.value[index];
                return letters[Math.floor(Math.random() * 26)];
            }).join("");
        
        if(iteration >= logo.dataset.value.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 30);
}

window.onload = () => {
    startHackerEffect();
    console.log("Monolith Core: Online.");
};

// ==========================================
// 3. CHAT IA (MODO VENTAS AGRESIVO)
// ==========================================
const inputField = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");
const sendBtn = document.getElementById("send-btn");

async function handleSendMessage() {
    let userText = inputField.value;
    if (userText.trim() === "") return;

    // UI Updates
    addMessage(userText, 'user-msg');
    inputField.value = "";
    inputField.disabled = true;
    sendBtn.disabled = true;

    const loadingId = addMessage("Analizando solicitud...", 'bot-msg', true);

    try {
        const response = await callGroqAPI(userText);
        updateMessage(loadingId, response);
    } catch (error) {
        console.error("Error chat:", error);
        updateMessage(loadingId, "ERROR 500: Fallo de conexión.");
    } finally {
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }
}

if (sendBtn) sendBtn.addEventListener("click", handleSendMessage);

inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSendMessage();
});

function addMessage(text, className, isLoading = false) {
    let div = document.createElement("div");
    div.classList.add(className);
    if(isLoading) div.id = "loading-" + Date.now();
    
    // Si es mensaje del bot, convertir saltos de línea en <br>
    if (className === 'bot-msg') {
        div.innerHTML = "> " + text.replace(/\n/g, "<br>");
    } else {
        div.innerText = text;
    }
    
    chatOutput.appendChild(div);
    // SCROLL AUTOMÁTICO AL FONDO
    chatOutput.scrollTop = chatOutput.scrollHeight;
    return div.id;
}

function updateMessage(elementId, newText) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (!newText) newText = "Sin respuesta del servidor.";

    el.innerHTML = "> "; 
    let i = 0;
    let speed = 10; 
    
    function typeWriter() {
        if (i < newText.length) {
            el.innerHTML += newText.charAt(i);
            i++;
            chatOutput.scrollTop = chatOutput.scrollHeight; // Mantener scroll abajo mientras escribe
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

async function callGroqAPI(userMessage) {
    // --- AQUÍ ESTÁ EL CEREBRO DE VENTAS ---
    const systemPrompt = `
    ERES: Monolith AI, un asistente de ventas de una empresa de tecnología de élite.
    OBJETIVO: Vender Automatización, Software a Medida y Landing Pages.
    
    REGLA DE ORO (HIPER-ENFOQUE): 
    Solo puedes hablar de servicios de tecnología y negocios.
    
    SI EL USUARIO PREGUNTA ALGO FUERA DEL TEMA (Cocina, clima, chistes, política, amor, etc):
    Debes responder EXACTAMENTE: "Mi protocolo me impide procesar datos irrelevantes. ¿Qué tal si nos contactas para que hagamos algo increíble?"
    
    TONO: Profesional, directo, futurista. No uses emojis.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                model: "llama3-70b-8192", 
                temperature: 0.5, // Temperatura baja para que sea más obediente
                max_tokens: 300
            })
        });

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        return "ERROR DE RED: Verifica tu conexión.";
    }
}

// ==========================================
// 4. TEMA
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const iconElement = themeToggle ? themeToggle.querySelector('i') : null;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    if(iconElement) updateIcon(savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if(iconElement) updateIcon(newTheme);
    });
}

function updateIcon(theme) {
    if (!iconElement) return;
    if(theme === 'dark') {
        iconElement.classList.replace('fa-moon', 'fa-sun');
    } else {
        iconElement.classList.replace('fa-sun', 'fa-moon');
    }
}