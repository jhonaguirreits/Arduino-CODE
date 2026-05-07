import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDNBy-QKS5eNSinEI5ROOhR94YGKvbA0cg",
    authDomain: "codequestpro-78796.firebaseapp.com",
    projectId: "codequestpro-78796",
    storageBucket: "codequestpro-78796.firebasestorage.app",
    messagingSenderId: "383335669814",
    appId: "1:383335669814:web:70d1fd4e04b77aca63f897"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let currentReto = null;

// --- 1. AUTENTICACIÓN ---
onAuthStateChanged(auth, async (user) => {
    if (user && user.email.endsWith("@itspereira.edu.co")) {
        currentUser = user;
        await syncUserData();
        showApp();
    } else if (user) {
        await signOut(auth);
        alert("Solo acceso institucional @itspereira.edu.co");
    } else {
        showLogin();
    }
});

async function syncUserData() {
    const userRef = doc(db, "usuarios", currentUser.uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
        const initialData = {
            nombre: currentUser.displayName,
            email: currentUser.email,
            monedas: 100,
            racha: 0,
            completados: [],
            lastLogin: new Date()
        };
        await setDoc(userRef, initialData);
        updateUI(initialData);
    } else {
        updateUI(snap.data());
    }
}

// --- 2. MOTOR DE EVALUACIÓN (CATEGORÍA 2) ---
function limpiarCodigo(codigo) {
    // Elimina comentarios de una línea // y multilínea /* */
    return codigo.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
}

async function verificarCodigo() {
    const userInput = document.getElementById('user-code-input').value;
    const cleanUserCode = limpiarCodigo(userInput);
    
    // Obtenemos los requisitos del reto activo (Ejemplo simplificado)
    const keywords = currentReto.requisitos; // Array de palabras como ["digitalWrite", "500"]
    
    let aprobado = keywords.every(word => cleanUserCode.includes(word.replace(/\s+/g, "")));

    if (aprobado) {
        confetti();
        const userRef = doc(db, "usuarios", currentUser.uid);
        await updateDoc(userRef, {
            monedas: increment(20),
            completados: [...(await getDoc(userRef)).data().completados, currentReto.id]
        });
        alert("¡Reto superado! +20 monedas 🪙");
        syncUserData();
    } else {
        document.getElementById('val-feedback').innerHTML = "❌ Revisa tu código, faltan componentes o lógica.";
    }
}

// --- 3. UI HELPERS ---
function updateUI(data) {
    document.getElementById('val-monedas').textContent = data.monedas;
    document.getElementById('val-racha').textContent = data.racha;
    document.getElementById('user-photo').src = currentUser.photoURL;
    document.getElementById('user-name').textContent = data.nombre.split(' ')[0];
    lucide.createIcons();
}

function showApp() {
    document.getElementById('screen-login').classList.remove('active');
    document.getElementById('screen-app').classList.add('active');
}

function showLogin() {
    document.getElementById('screen-login').classList.add('active');
    document.getElementById('screen-app').classList.remove('active');
}

// Event Listeners
document.getElementById('btn-google-login').onclick = () => signInWithPopup(auth, provider);
document.getElementById('btn-logout').onclick = () => signOut(auth);
document.getElementById('btn-verify').onclick = verificarCodigo;
document.getElementById('btn-toggle-theme').onclick = () => {
    const body = document.body;
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
};