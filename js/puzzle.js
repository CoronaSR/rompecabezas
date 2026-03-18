const board = document.getElementById("board");
const piecesContainer = document.getElementById("pieces");

// Configuración
const size = 3; // 3x3
let pieces = [];
const missingPieceIndex = 4; // centro (puedes cambiarlo)
let missingUnlocked = false;

// Crear slots del tablero
for (let i = 0; i < size * size; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;

    // Si es el slot faltante
    if (i == missingPieceIndex) {
        slot.classList.add("missing-slot");

        slot.addEventListener("click", () => {
            if (!missingUnlocked) {
                abrirModal();
            }
        });
    }

    slot.addEventListener("dragover", e => e.preventDefault());

    slot.addEventListener("drop", e => {
    const pieceId = e.dataTransfer.getData("text");
    const piece = document.getElementById(pieceId);

    if (piece.dataset.correct == slot.dataset.index) {
        slot.appendChild(piece);
        piece.draggable = false;

        // 🔥 Verificar si ya terminó
        if (checkCompletion()) {
            finalizarJuego();
        }
    }
});

    board.appendChild(slot);
}

// Crear piezas (ejemplo con imagen)
for (let i = 0; i < size * size; i++) {

    if (i == missingPieceIndex) continue; // quitar pieza de pista
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.id = "piece-" + i;
    piece.draggable = true;
    piece.dataset.correct = i;

    piece.style.backgroundImage = "url('img/collage.png')";
    piece.style.backgroundSize = `${size * 120}px ${size * 120}px`;

    const x = (i % size) * 120;
    const y = Math.floor(i / size) * 120;

    piece.style.backgroundPosition = `-${x}px -${y}px`;

    piece.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text", piece.id);
    });

    pieces.push(piece);
}

// Mezclar piezas
pieces.sort(() => Math.random() - 0.5);

// Agregar al contenedor
pieces.forEach(p => piecesContainer.appendChild(p));

function abrirModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function desbloquearPieza() {
    document.getElementById("modal").classList.add("hidden");

    if (missingUnlocked) return;

    missingUnlocked = true;

    crearPiezaFaltante();
}

function crearPiezaFaltante() {

    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.id = "piece-" + missingPieceIndex;
    piece.draggable = true;
    piece.dataset.correct = missingPieceIndex;

    piece.style.backgroundImage = "url('img/collage.png')";
    piece.style.backgroundSize = `${size * 120}px ${size * 120}px`;

    const x = (missingPieceIndex % size) * 120;
    const y = Math.floor(missingPieceIndex / size) * 120;

    piece.style.backgroundPosition = `-${x}px -${y}px`;

    piece.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text", piece.id);
    });

    piecesContainer.appendChild(piece);
}

function checkCompletion() {
    const slots = document.querySelectorAll(".slot");

    for (let slot of slots) {
        if (slot.children.length === 0) {
            return false;
        }
    }

    return true;
}

function finalizarJuego() {

    // Quitar signo de interrogación
    const missingSlot = document.querySelector(".missing-slot");
    if (missingSlot) {
        missingSlot.classList.remove("missing-slot");
    }

    // Mostrar modal final
    document.getElementById("finalModal").classList.remove("hidden");
}

function descargarBoleto() {
    const link = document.createElement("a");
    link.href = "img/boleto.png"; // 👈 tu imagen
    link.download = "boleto.png";
    link.click();
}