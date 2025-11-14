// Firebase config (à remplacer par le tien)
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJET.firebaseapp.com",
    databaseURL: "https://VOTRE_PROJET.firebaseio.com",
    projectId: "VOTRE_PROJET",
    storageBucket: "VOTRE_PROJET.appspot.com",
    messagingSenderId: "VOTRE_ID",
    appId: "VOTRE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const canvas = document.getElementById("canvas");
let zoom = 1;
let world = {};

// Récupérer la position depuis l'URL
let posX = parseInt(new URLSearchParams(window.location.search).get("x")) || 0;
let posY = parseInt(new URLSearchParams(window.location.search).get("y")) || 0;

function renderCell(x, y, char){
    const div = document.createElement("div");
    div.className = "cell";
    div.style.left = `${x*20}px`;
    div.style.top = `${y*20}px`;
    div.textContent = char;
    canvas.appendChild(div);
}

function renderWorld(){
    canvas.innerHTML = "";
    for(const key in world){
        const [x,y] = key.split(":").map(Number);
        renderCell(x,y,world[key]);
    }
}

db.ref('world').on('value', (snapshot)=>{
    world = snapshot.val() || {};
    renderWorld();
});

canvas.addEventListener("click", (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left)/20);
    const y = Math.floor((e.clientY - rect.top)/20);

    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = `${x*20}px`;
    input.style.top = `${y*20}px`;
    input.style.width = "20px";
    input.style.height = "20px";
    input.style.fontFamily = "monospace";
    input.style.fontSize = "20px";
    input.maxLength = 1;
    canvas.appendChild(input);
    input.focus();

    input.addEventListener("keydown",(event)=>{
        if(event.key.length === 1 || event.key === "Enter"){
            const char = input.value;
            db.ref(`world/${x}:${y}`).set(char);
            input.remove();
        }
    });
});

document.getElementById("zoomIn").addEventListener("click", ()=>{
    zoom = Math.min(zoom + 0.1,5);
    canvas.style.transform = `scale(${zoom})`;
});
document.getElementById("zoomOut").addEventListener("click", ()=>{
    zoom = Math.max(zoom - 0.1,0.1);
    canvas.style.transform = `scale(${zoom})`;
});