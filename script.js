// ==========================================
// 1. CONFIGURACIÓN DE SEGURIDAD
// ==========================================
// Nota: La API Key se configura en el panel de Vercel (Environment Variables).
// El frontend solo se comunica con tu endpoint seguro: /api/chat

// ==========================================
// 2. EFECTO HACKER (Logo Desencriptado)
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

// ==========================================
// 3. LÓGICA DEL CHAT AI (Ventas Monolith)
// ==========================================
const inputField = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");
const sendBtn = document.getElementById("send-btn");

async function handleSendMessage() {
    let userText = inputField.value;
    if (userText.trim() === "") return;

    // A. UI: Mostrar mensaje del usuario y bloquear controles
    addMessage(userText, 'user-msg');
    inputField.value = "";
    inputField.disabled = true;
    sendBtn.disabled = true;

    // B. UI: Mostrar placeholder de carga
    const loadingId = addMessage("Sincronizando con Neural Core...", 'bot-msg', true);

    try {
        // C. API: Llamada al backend de Vercel
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        if (!response.ok) throw new Error("Error en la conexión del servidor.");

        const data = await response.json();
        
        // D. UI: Actualizar con la respuesta de la IA (Typewriter effect)
        updateMessage(loadingId, data.reply);

    } catch (error) {
        console.error("Chat Error:", error);
        updateMessage(loadingId, "ERROR_CRÍTICO: Enlace interrumpido. Contacta directamente a monolith872@gmail.com.");
    } finally {
        // E. UI: Reactivar controles
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }
}

// --- Listeners del Chat ---
if (sendBtn) sendBtn.addEventListener("click", handleSendMessage);
if (inputField) {
    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });
}

// --- Funciones de Interfaz de Chat ---
function addMessage(text, className, isLoading = false) {
    let div = document.createElement("div");
    div.classList.add(className);
    if(isLoading) div.id = "loading-" + Date.now();
    
    // El bot siempre empieza con el prompt ">"
    div.innerHTML = (className === 'bot-msg' ? "> " : "") + text.replace(/\n/g, "<br>");
    
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
    return div.id;
}

function updateMessage(elementId, newText) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML = "> "; 
    let i = 0;
    let speed = 12; // Velocidad de escritura
    
    function typeWriter() {
        if (i < newText.length) {
            el.innerHTML += newText.charAt(i);
            i++;
            chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll dinámico
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

// ==========================================
// 4. GESTIÓN DE TEMAS (Modo Claro/Oscuro)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const iconElement = themeToggle ? themeToggle.querySelector('i') : null;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
if(iconElement) updateIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
}

function updateIcon(theme) {
    if (!iconElement) return;
    iconElement.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ==========================================
// 5. INICIALIZACIÓN
// ==========================================
window.onload = () => {
    startHackerEffect();
    console.log("Monolith System v.1.0.2 Online.");
};