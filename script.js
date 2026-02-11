// ==========================================
// 1. CONFIGURACIÓN
// ==========================================
// ¡YA NO NECESITAS LA API KEY AQUÍ! 
// La seguridad la maneja Vercel en el backend.

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
    console.log("Monolith Core: Online & Secure via Vercel.");
};

// ==========================================
// 3. CHAT IA (CONECTADO A VERCEL SERVERLESS)
// ==========================================
const inputField = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");
const sendBtn = document.getElementById("send-btn");

async function handleSendMessage() {
    let userText = inputField.value;
    if (userText.trim() === "") return;

    // UI: Mostrar mensaje y bloquear controles
    addMessage(userText, 'user-msg');
    inputField.value = "";
    inputField.disabled = true;
    sendBtn.disabled = true;

    // UI: Mostrar "Pensando..."
    const loadingId = addMessage("Conectando con servidor seguro...", 'bot-msg', true);

    try {
        // LLAMADA AL BACKEND DE VERCEL (Seguro)
        const responseText = await callBackendAPI(userText);
        
        // UI: Mostrar respuesta real
        updateMessage(loadingId, responseText);
    } catch (error) {
        console.error("Error chat:", error);
        updateMessage(loadingId, "ERROR 500: Fallo de conexión con Vercel.");
    } finally {
        // UI: Desbloquear todo
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }
}

// Eventos de envío
if (sendBtn) sendBtn.addEventListener("click", handleSendMessage);
inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSendMessage();
});

// --- FUNCIONES DE UI ---

function addMessage(text, className, isLoading = false) {
    let div = document.createElement("div");
    div.classList.add(className);
    if(isLoading) div.id = "loading-" + Date.now();
    
    // Si es bot, formatea saltos de línea
    if (className === 'bot-msg') {
        div.innerHTML = "> " + text.replace(/\n/g, "<br>");
    } else {
        div.innerText = text;
    }
    
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
    return div.id;
}

function updateMessage(elementId, newText) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    if (!newText) newText = "Sin datos.";

    el.innerHTML = "> "; 
    let i = 0;
    let speed = 10; 
    
    function typeWriter() {
        if (i < newText.length) {
            el.innerHTML += newText.charAt(i);
            i++;
            chatOutput.scrollTop = chatOutput.scrollHeight;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

// --- FUNCIÓN DE CONEXIÓN SEGURA (VERCEL) ---

async function callBackendAPI(userMessage) {
    try {
        // Aquí es donde ocurre la magia: Llamamos a tu propia API en Vercel
        // No llamamos a Groq directamente.
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        return data.reply; // La respuesta limpia de la IA

    } catch (error) {
        console.error("Fallo Fetch Vercel:", error);
        return "ERROR DE RED: No se pudo conectar con el servidor de Vercel.";
    }
}

// ==========================================
// 4. TEMA (Dark/Light Mode)
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