
// AudioTale - Aplicación de cuentos interactivos
// Desarrollado con HTML, CSS y JavaScript

// Variables globales
let unsavedChanges = false; // Control de cambios no guardados
let currentSection = 'loading'; // Sección actual
let currentBook = null; // Libro actual en edición/lectura
let currentPage = 0; // Página actual
let isRecording = false; // Estado de grabación
let mediaRecorder = null; // Grabador de audio
let audioChunks = []; // Fragmentos de audio
let books = []; // Libros del usuario
let templates = []; // Plantillas disponibles
let autoPlayMode = false; // Modo auto-play
let currentAudio = null; // Audio actual reproduciéndose
let selectedCategory = 'aventura'; // Categoría seleccionada
let isReadingBook = false; // Estado de lectura
let audioQueue = []; // Cola de audios para reproducir
let currentAudioIndex = 0; // Índice del audio actual en la cola
let userImages = []; // Imágenes subidas por el usuario
let userName = ''; // Nombre del usuario
let backgroundMusic = null; // Música de fondo
let mascotVisible = false; // Estado de visibilidad de la mascota

// Galería de imágenes predefinidas
const IMAGE_GALLERY = {
    naturaleza: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    oceano: [
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
        'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    ],
    espacio: [
        'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800',
        'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800',
        'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800',
        'https://images.unsplash.com/photo-1614732414444-096040ec8cfb?w=800',
        'https://images.unsplash.com/photo-1538414915055-29d20b820b2b?w=800'
    ],
    fantasia: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
        'https://images.unsplash.com/photo-1563306406-e66174fa3787?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c95a?w=800',
        'https://images.unsplash.com/photo-1585411241865-ec2858c7de80?w=800'
    ],
    animales: [
        'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800',
        'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800'
    ],
    ciudad: [
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
        'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
    ]
};

// Categorías de plantillas
const TEMPLATE_CATEGORIES = {
    aventura: {
        name: 'Aventura',
        icon: '🏔️',
        templates: [
            {
                id: 'forest-adventure',
                title: 'Aventura en el Bosque',
                description: 'Una mágica aventura entre árboles gigantes y criaturas fantásticas.',
                pages: [
                    { background: IMAGE_GALLERY.naturaleza[0], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[1], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[2], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[3], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[4], text: '' }
                ]
            },
            {
                id: 'mountain-climb',
                title: 'Escalada en la Montaña',
                description: 'Sube hasta la cima más alta y descubre tesoros ocultos.',
                pages: [
                    { background: IMAGE_GALLERY.naturaleza[0], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[2], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[4], text: '' },
                    { background: IMAGE_GALLERY.espacio[0], text: '' },
                    { background: IMAGE_GALLERY.fantasia[2], text: '' }
                ]
            }
        ]
    },
    fantasia: {
        name: 'Fantasía',
        icon: '🧚‍♀️',
        templates: [
            {
                id: 'fairy-castle',
                title: 'El Castillo de las Hadas',
                description: 'Un reino mágico lleno de hadas, unicornios y mucha diversión.',
                pages: [
                    { background: IMAGE_GALLERY.fantasia[0], text: '' },
                    { background: IMAGE_GALLERY.fantasia[1], text: '' },
                    { background: IMAGE_GALLERY.fantasia[2], text: '' },
                    { background: IMAGE_GALLERY.fantasia[3], text: '' },
                    { background: IMAGE_GALLERY.fantasia[4], text: '' }
                ]
            },
            {
                id: 'magic-forest',
                title: 'El Bosque Mágico',
                description: 'Donde los árboles hablan y los animales son tus amigos.',
                pages: [
                    { background: IMAGE_GALLERY.fantasia[1], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[2], text: '' },
                    { background: IMAGE_GALLERY.animales[0], text: '' },
                    { background: IMAGE_GALLERY.fantasia[3], text: '' },
                    { background: IMAGE_GALLERY.naturaleza[5], text: '' }
                ]
            }
        ]
    },
    ciencia: {
        name: 'Ciencia Ficción',
        icon: '🚀',
        templates: [
            {
                id: 'space-journey',
                title: 'Viaje Espacial',
                description: 'Explora las estrellas y planetas lejanos en esta aventura cósmica.',
                pages: [
                    { background: IMAGE_GALLERY.espacio[0], text: '' },
                    { background: IMAGE_GALLERY.espacio[1], text: '' },
                    { background: IMAGE_GALLERY.espacio[2], text: '' },
                    { background: IMAGE_GALLERY.espacio[3], text: '' },
                    { background: IMAGE_GALLERY.espacio[4], text: '' }
                ]
            },
            {
                id: 'robot-friend',
                title: 'Mi Amigo Robot',
                description: 'Una amistad especial entre un niño y su robot compañero.',
                pages: [
                    { background: IMAGE_GALLERY.ciudad[0], text: '' },
                    { background: IMAGE_GALLERY.ciudad[2], text: '' },
                    { background: IMAGE_GALLERY.espacio[1], text: '' },
                    { background: IMAGE_GALLERY.ciudad[4], text: '' },
                    { background: IMAGE_GALLERY.espacio[3], text: '' }
                ]
            }
        ]
    },
    oceano: {
        name: 'Océano',
        icon: '🌊',
        templates: [
            {
                id: 'ocean-tale',
                title: 'Cuentos del Océano',
                description: 'Descubre los secretos del fondo marino con peces coloridos.',
                pages: [
                    { background: IMAGE_GALLERY.oceano[0], text: '' },
                    { background: IMAGE_GALLERY.oceano[1], text: '' },
                    { background: IMAGE_GALLERY.oceano[2], text: '' },
                    { background: IMAGE_GALLERY.oceano[3], text: '' },
                    { background: IMAGE_GALLERY.oceano[4], text: '' }
                ]
            },
            {
                id: 'mermaid-adventure',
                title: 'La Aventura de la Sirena',
                description: 'Sumérgete en las profundidades con una sirena valiente.',
                pages: [
                    { background: IMAGE_GALLERY.oceano[1], text: '' },
                    { background: IMAGE_GALLERY.oceano[3], text: '' },
                    { background: IMAGE_GALLERY.fantasia[2], text: '' },
                    { background: IMAGE_GALLERY.oceano[4], text: '' },
                    { background: IMAGE_GALLERY.oceano[0], text: '' }
                ]
            }
        ]
    }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎧 Iniciando AudioTale...');

    // Simular carga de la aplicación
    setTimeout(() => {
        hideLoadingScreen();
        initializeBackgroundMusic();
        showWelcomeScreen();
        initializeApp();
    }, 2000);
});

// Inicializar aplicación
function initializeApp() {
    console.log('🚀 Inicializando aplicación...');

    // Cargar datos guardados
    loadUserData();

    // Configurar eventos
    setupEventListeners();

    // Inicializar plantillas desde categorías
    templates = [];
    Object.values(TEMPLATE_CATEGORIES).forEach(category => {
        templates.push(...category.templates);
    });

    // Crear elemento de mascota
    createMascot();

    console.log('✅ Aplicación inicializada correctamente');
}

// Crear mascota animada (Mago Cuento)
function createMascot() {
    const mascot = document.createElement('div');
    mascot.id = 'mascot';
    mascot.className = 'mascot hidden';
    mascot.innerHTML = `
        <div class="mascot-character">🧙‍♂️</div>
        <div class="mascot-speech-bubble">
            <p id="mascot-text">¡Hola! Soy Mago Cuento</p>
            <div class="speech-bubble-arrow"></div>
        </div>
    `;
    document.body.appendChild(mascot);

    // Agregar evento de click para ocultar
    mascot.addEventListener('click', hideMascot);

    // Mostrar mascota ocasionalmente durante la experiencia
    setInterval(() => {
        if (!mascotVisible && Math.random() < 0.15) { // 15% probabilidad cada 20 segundos
            if (Math.random() < 0.3) {
                showContextualTip();
            } else {
                showRandomEncouragement();
            }
        }
    }, 20000);

    // Mascota aparece al cambiar de sección
    setTimeout(() => {
        if (currentSection === 'main-menu') {
            showContextualTip();
        }
    }, 3000);
}

// Mostrar pantalla de bienvenida
function showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.remove('hidden');
    } else {
        // Crear pantalla de bienvenida si no existe
        const newWelcomeScreen = document.createElement('div');
        newWelcomeScreen.id = 'welcome-screen';
        newWelcomeScreen.className = 'welcome-screen';
        newWelcomeScreen.innerHTML = `
            <div class="welcome-content">
                <div class="mascot-logo">🧙‍♂️</div>
                <h1>¡Bienvenido a AudioTale!</h1>
                <p>¡Hola! Soy Mago Cuento, tu guía mágico en este mundo de historias.</p>
                <p>¿Cómo te llamas?</p>
                <input type="text" id="user-name-input" placeholder="Escribe tu nombre aquí..." maxlength="20">
                <button id="start-adventure-btn" onclick="startAdventure()">¡Comenzar la Aventura!</button>
            </div>
        `;
        document.body.appendChild(newWelcomeScreen);
    }
}

// Comenzar aventura
function startAdventure() {
    const nameInput = document.getElementById('user-name-input');
    userName = nameInput.value.trim() || 'Aventurero';

    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.classList.add('fade-out');

    setTimeout(() => {
        document.body.removeChild(welcomeScreen);
        showMainMenu();
        showMascot(`¡Perfecto, ${userName}! ¡Estás listo para crear historias increíbles!`);
    }, 500);
}

// Mostrar mascota con mensaje
function showMascot(message, duration = 4000) {
    const mascot = document.getElementById('mascot');
    const mascotText = document.getElementById('mascot-text');

    mascotText.textContent = message;
    mascot.classList.remove('hidden');
    mascotVisible = true;

    setTimeout(() => {
        hideMascot();
    }, duration);
}

// Mostrar mensajes aleatorios de ánimo
function showRandomEncouragement() {
    if (currentSection === 'book-editor' || currentSection === 'book-reader') return; // No interrumpir durante lectura/edición

    const encouragements = [
        `¡Sigue así, ${userName}! Eres muy creativo.`,
        `¡Tus historias son increíbles, ${userName}!`,
        `¿Qué tal si agregamos más aventuras a tu libro?`,
        `¡Me encanta ver cómo creas, ${userName}!`,
        `¿Sabías que puedes grabar tu voz en cada página?`,
        `¡Cada historia tuya es única y especial!`,
        `${userName}, ¿ya exploraste todas las categorías de plantillas?`,
        `¡Recuerda que puedes subir tus propias imágenes!`,
        `${userName}, tus cuentos podrían inspirar a otros niños.`,
        `¿Qué tal si creas un libro sobre tus mascotas?`,
        `¡La magia está en tu imaginación, ${userName}!`
    ];

    const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
    playMagicSound();
    showMascot(randomMessage, 6000);
}

// Mostrar consejos específicos según la sección
function showContextualTip() {
    let tip = '';

    switch (currentSection) {
        case 'library':
            tip = `${userName}, ¡hay muchas plantillas geniales aquí! Cada categoría tiene historias únicas.`;
            break;
        case 'my-books':
            tip = `¡Qué biblioteca tan impresionante, ${userName}! ¿Cuál vas a leer primero?`;
            break;
        case 'book-creator':
            tip = `${userName}, ¡este es mi lugar favorito! Aquí es donde nace la magia de las historias.`;
            break;
        default:
            showRandomEncouragement();
            return;
    }

    playMagicSound();
    showMascot(tip, 5000);
}

// Ocultar mascota
function hideMascot() {
    const mascot = document.getElementById('mascot');
    mascot.classList.add('hidden');
    mascotVisible = false;
}

// Inicializar música de fondo
function initializeBackgroundMusic() {
    backgroundMusic = new Audio();
    backgroundMusic.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA'; // Placeholder
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    // Crear música sintética simple
    createBackgroundMusic();
}

// Variables para sonidos
let backgroundMusicEnabled = true;
let audioContext = null;
let backgroundMusicPlaying = false;

// Crear música de fondo sintética
function createBackgroundMusic() {
    try {
        // Crear un audio sintético más agradable para niños
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        backgroundMusicPlaying = false;

        console.log('🎵 Sistema de audio inicializado');

    } catch (error) {
        console.log('Audio sintético no disponible:', error);
        audioContext = null;
    }
}

// Función para crear notas musicales
function playNote(frequency, duration, startTime, volume = 0.03) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// Reproducir música de fondo
function startBackgroundMusic() {
    if (!audioContext || backgroundMusicPlaying || !backgroundMusicEnabled) return;

    backgroundMusicPlaying = true;

    // Melodía suave para niños (Twinkle Twinkle Little Star simplificada)
    const melody = [
        { note: 261.63, duration: 0.5 }, // C
        { note: 261.63, duration: 0.5 }, // C
        { note: 392.00, duration: 0.5 }, // G
        { note: 392.00, duration: 0.5 }, // G
        { note: 440.00, duration: 0.5 }, // A
        { note: 440.00, duration: 0.5 }, // A
        { note: 392.00, duration: 1.0 }, // G
        { note: 349.23, duration: 0.5 }, // F
        { note: 349.23, duration: 0.5 }, // F
        { note: 329.63, duration: 0.5 }, // E
        { note: 329.63, duration: 0.5 }, // E
        { note: 293.66, duration: 0.5 }, // D
        { note: 293.66, duration: 0.5 }, // D
        { note: 261.63, duration: 1.0 }, // C
    ];

    let currentTime = audioContext.currentTime;
    let melodyIndex = 0;

    function playMelody() {
        if (backgroundMusicPlaying && backgroundMusicEnabled && audioContext) {
            const currentNote = melody[melodyIndex];
            playNote(currentNote.note, currentNote.duration, currentTime, 0.02);
            currentTime += currentNote.duration + 0.1;
            melodyIndex = (melodyIndex + 1) % melody.length;

            if (melodyIndex === 0) {
                currentTime += 3; // Pausa entre repeticiones
            }

            setTimeout(playMelody, (currentNote.duration + 0.1) * 1000);
        }
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            playMelody();
        });
    } else {
        playMelody();
    }
}

// Detener música de fondo
function stopBackgroundMusic() {
    backgroundMusicPlaying = false;
}

// Sonidos de interacción
function playClickSound() {
    if (!audioContext) return;
    const currentTime = audioContext.currentTime;
    playNote(523.25, 0.1, currentTime, 0.1); // C5
}

function playSuccessSound() {
    if (!audioContext) return;
    const currentTime = audioContext.currentTime;
    playNote(523.25, 0.2, currentTime, 0.08); // C5
    playNote(659.25, 0.2, currentTime + 0.1, 0.08); // E5
    playNote(783.99, 0.3, currentTime + 0.2, 0.08); // G5
}

function playErrorSound() {
    if (!audioContext) return;
    const currentTime = audioContext.currentTime;
    playNote(220.00, 0.3, currentTime, 0.1); // A3
    playNote(196.00, 0.3, currentTime + 0.15, 0.1); // G3
}

function playMagicSound() {
    if (!audioContext) return;
    const currentTime = audioContext.currentTime;
    // Secuencia mágica ascendente
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    notes.forEach((note, index) => {
        playNote(note, 0.15, currentTime + (index * 0.08), 0.06);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Menú principal
    document.getElementById('library-btn').addEventListener('click', showLibrary);
    document.getElementById('my-books-btn').addEventListener('click', showMyBooks);
    document.getElementById('create-btn').addEventListener('click', showBookCreator);

    // Editor
    document.getElementById('editor-back-btn').addEventListener('click', () => {
        // Si está grabando, detener y guardar automáticamente
        if (isRecording && currentSection === 'book-editor') {
            stopRecordingAutomatically();
        }
        if (unsavedChanges) {
            showUnsavedChangesPopup(() => {
                unsavedChanges = false;
                showMainMenu();
            });
        } else {
            showMainMenu();
        }
    });
    document.getElementById('save-book-btn').addEventListener('click', saveCurrentBook);
    document.getElementById('prev-page-btn').addEventListener('click', previousPage);
    document.getElementById('next-page-btn').addEventListener('click', nextPage);
    document.getElementById('record-btn').addEventListener('click', () => {
        // Solo permitir grabar en la sección de edición
        if (currentSection === 'book-editor') {
            toggleRecording();
        } else {
            showMascot('Solo puedes grabar audio mientras editas un libro.');
        }
    });
    document.getElementById('play-btn').addEventListener('click', playPageAudio);
    document.getElementById('delete-audio-btn').addEventListener('click', deletePageAudio);

    // Lector
    document.getElementById('reader-back-btn').addEventListener('click', showMyBooks);
    document.getElementById('reader-prev-btn').addEventListener('click', readerPreviousPage);
    document.getElementById('reader-next-btn').addEventListener('click', readerNextPage);
    document.getElementById('auto-play-btn').addEventListener('click', toggleAutoPlay);
    document.getElementById('share-btn').addEventListener('click', openShareModal);

    // Creador
    document.getElementById('add-page-btn').addEventListener('click', addNewPage);
    document.getElementById('create-book-btn').addEventListener('click', createNewBook);
}

// Gestión de pantallas
function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.add('hidden');
}

function showMainMenu() {
    hideAllSections();
    document.getElementById('main-menu').classList.remove('hidden');
    currentSection = 'main-menu';
    playClickSound();
    // Reanudar música de fondo si está habilitada
    if (backgroundMusicEnabled) {
        setTimeout(() => startBackgroundMusic(), 500);
    }
}

function showLibrary() {
    hideAllSections();
    document.getElementById('library-section').classList.remove('hidden');
    currentSection = 'library';
    playClickSound();
    displayTemplates();
    // Mantener música de fondo
    if (backgroundMusicEnabled && !backgroundMusicPlaying) {
        setTimeout(() => startBackgroundMusic(), 300);
    }
}

function showMyBooks() {
    hideAllSections();
    document.getElementById('my-books-section').classList.remove('hidden');
    currentSection = 'my-books';
    playClickSound();
    displayUserBooks();
    // Mantener música de fondo
    if (backgroundMusicEnabled && !backgroundMusicPlaying) {
        setTimeout(() => startBackgroundMusic(), 300);
    }
}

function showBookCreator() {
    hideAllSections();
    document.getElementById('book-creator').classList.remove('hidden');
    currentSection = 'book-creator';
    playClickSound();
    initializeCreator();
    // Mantener música de fondo
    if (backgroundMusicEnabled && !backgroundMusicPlaying) {
        setTimeout(() => startBackgroundMusic(), 300);
    }
}

function showBookEditor(book) {
    hideAllSections();
    document.getElementById('book-editor').classList.remove('hidden');
    currentSection = 'book-editor';
    currentBook = book;
    currentPage = 0;
    document.getElementById('editor-title').textContent = `Editando: ${book.title}`;
    playClickSound();
    // Detener música de fondo en editor
    stopBackgroundMusic();
    displayCurrentPage();
}

function showBookReader(book) {
    hideAllSections();
    document.getElementById('book-reader').classList.remove('hidden');
    currentSection = 'book-reader';
    currentBook = book;
    currentPage = 0; // Portada es la página 0
    isReadingBook = true;
    autoPlayMode = true;
    document.getElementById('reader-title').textContent = book.title;
    playClickSound();
    // Detener música de fondo en lector
    stopBackgroundMusic();
    displayReaderPages();
}

function hideAllSections() {
    const sections = ['main-menu', 'library-section', 'my-books-section', 'book-editor', 'book-reader', 'book-creator'];
    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
}

// Mostrar plantillas por categorías
function displayTemplates() {
    const grid = document.getElementById('templates-grid');
    grid.innerHTML = '';

    // Crear selector de categorías
    const categorySelector = document.createElement('div');
    categorySelector.className = 'category-selector';
    categorySelector.innerHTML = `
        <h3>📚 Categorías</h3>
        <div class="category-buttons">
            ${Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) =>
        `<button class="category-btn ${key === selectedCategory ? 'active' : ''}" onclick="selectCategory('${key}')">
                    ${category.icon} ${category.name}
                </button>`
    ).join('')}
        </div>
    `;
    grid.appendChild(categorySelector);

    // Mostrar plantillas de la categoría seleccionada
    const selectedTemplates = TEMPLATE_CATEGORIES[selectedCategory].templates;
    const templatesContainer = document.createElement('div');
    templatesContainer.className = 'templates-container';

    selectedTemplates.forEach(template => {
        const bookCard = createBookCard(template, () => {
            // Crear copia de la plantilla para editar
            const newBook = {
                ...template,
                id: 'book_' + Date.now(),
                isTemplate: false,
                pages: template.pages.map(page => ({ ...page }))
            };
            showBookEditor(newBook);
        });
        templatesContainer.appendChild(bookCard);
    });

    grid.appendChild(templatesContainer);
}

// Seleccionar categoría
function selectCategory(category) {
    selectedCategory = category;
    displayTemplates();
}

// Mostrar libros del usuario
function displayUserBooks() {
    const grid = document.getElementById('my-books-grid');
    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem; grid-column: 1/-1;">No tienes libros guardados aún. ¡Crea tu primer libro!</p>';
        return;
    }

    books.forEach((book, index) => {
        const bookCard = createUserBookCard(book, index);
        grid.appendChild(bookCard);
    });
}

// Crear tarjeta de libro del usuario con opciones
function createUserBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card user-book-card';

    const cover = document.createElement('div');
    cover.className = 'book-cover';
    // Siempre usar la primera imagen como portada
    cover.style.backgroundImage = `url(${book.pages && book.pages[0] && book.pages[0].background ? book.pages[0].background : ''})`;
    cover.onclick = () => showBookReader(book);

    const info = document.createElement('div');
    info.className = 'book-info';

    const title = document.createElement('h3');
    title.className = 'book-title';
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = 'book-author';
    author.textContent = `Autor: ${book.author || 'Autor desconocido'}`;

    const description = document.createElement('p');
    description.className = 'book-description';
    description.textContent = book.description;

    const actions = document.createElement('div');
    actions.className = 'book-actions';

    const readBtn = document.createElement('button');
    readBtn.className = 'action-btn read-btn';
    readBtn.innerHTML = '📖 Leer';
    readBtn.onclick = () => showBookReader(book);

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '✏️ Editar';
    editBtn.onclick = () => showBookEditor(book);

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'action-btn download-btn';
    downloadBtn.innerHTML = '💾 Descargar';
    downloadBtn.onclick = () => downloadBook(book);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '🗑️ Eliminar';
    deleteBtn.onclick = () => deleteBook(index);

    actions.appendChild(readBtn);
    actions.appendChild(editBtn);
    actions.appendChild(downloadBtn);
    actions.appendChild(deleteBtn);

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(description);
    info.appendChild(actions);
    card.appendChild(cover);
    card.appendChild(info);

    return card;
}

// Crear tarjeta de libro
function createBookCard(book, clickHandler) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = clickHandler;

    const cover = document.createElement('div');
    cover.className = 'book-cover';
    cover.style.backgroundImage = `url(${book.pages[0].background})`;

    const info = document.createElement('div');
    info.className = 'book-info';

    const title = document.createElement('h3');
    title.className = 'book-title';
    title.textContent = book.title;

    const description = document.createElement('p');
    description.className = 'book-description';
    description.textContent = book.description;

    info.appendChild(title);
    info.appendChild(description);
    card.appendChild(cover);
    card.appendChild(info);

    return card;
}

// Gestión del editor
function displayCurrentPage() {
    if (!currentBook || !currentBook.pages[currentPage]) return;

    const page = currentBook.pages[currentPage];
    const pageElement = document.getElementById('current-page');
    const backgroundElement = pageElement.querySelector('.page-background');
    const textInput = pageElement.querySelector('.text-input');

    // Configurar fondo
    backgroundElement.style.backgroundImage = `url(${page.background})`;

    // Configurar texto
    textInput.value = page.text || '';
    textInput.oninput = () => {
        currentBook.pages[currentPage].text = textInput.value;
        unsavedChanges = true;
    };

    // Actualizar contador de páginas
    document.getElementById('page-counter').textContent = `Página ${currentPage + 1} de ${currentBook.pages.length}`;

    // Actualizar botones de navegación
    document.getElementById('prev-page-btn').disabled = currentPage === 0;
    document.getElementById('next-page-btn').disabled = currentPage === currentBook.pages.length - 1;

    // Actualizar controles de audio
    updateAudioControls();
}

function updateAudioControls() {
    const page = currentBook.pages[currentPage];
    const playBtn = document.getElementById('play-btn');
    const deleteBtn = document.getElementById('delete-audio-btn');

    if (page.audio) {
        playBtn.classList.remove('hidden');
        deleteBtn.classList.remove('hidden');
    } else {
        playBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
    }
}

function previousPage() {
    if (currentPage > 0) {
        playClickSound();
        // Detener grabación automáticamente si está activa
        if (isRecording) {
            stopRecordingAutomatically();
            // Esperar un momento antes de cambiar de página para que se complete la grabación
            setTimeout(() => {
                currentPage--;
                displayCurrentPage();
            }, 500);
        } else {
            currentPage--;
            displayCurrentPage();
        }
    }
}

function nextPage() {
    if (currentPage < currentBook.pages.length - 1) {
        playClickSound();
        // Detener grabación automáticamente si está activa
        if (isRecording) {
            stopRecordingAutomatically();
            // Esperar un momento antes de cambiar de página para que se complete la grabación
            setTimeout(() => {
                currentPage++;
                displayCurrentPage();
            }, 500);
        } else {
            currentPage++;
            displayCurrentPage();
        }
    }
}

// Detener grabación automáticamente al cambiar de página
function stopRecordingAutomatically() {
    if (isRecording && mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        isRecording = false;
        const recordBtn = document.getElementById('record-btn');
        recordBtn.textContent = '🎤 Grabar';
        recordBtn.classList.remove('recording');

        showMascot(`¡${userName}! He guardado tu grabación automáticamente al cambiar de página.`);
    }
}

// Gestión de audio
async function toggleRecording() {
    const recordBtn = document.getElementById('record-btn');

    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                // Guardar audio como base64 (DataURL) para persistencia
                const reader = new FileReader();
                reader.onloadend = function () {
                    const dataUrl = reader.result;
                    currentBook.pages[currentPage].audio = dataUrl; // DataURL
                    updateAudioControls();
                    stream.getTracks().forEach(track => track.stop());
                    // Guardar automáticamente el libro para no perder el audio
                    saveCurrentBook();
                    unsavedChanges = false;
                    // Log para depuración
                    console.log('🎤 Audio guardado en página', currentPage, dataUrl ? dataUrl.substring(0, 50) + '...' : 'null');
                };
                reader.readAsDataURL(audioBlob);
            };

            mediaRecorder.start();
            isRecording = true;
            recordBtn.textContent = '⏹️ Parar';
            recordBtn.classList.add('recording');
            playMagicSound();

        } catch (error) {
            console.error('Error al acceder al micrófono:', error);
            alert('No se pudo acceder al micrófono. Asegúrate de dar permisos.');
        }
    } else {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.textContent = '🎤 Grabar';
        recordBtn.classList.remove('recording');
    }
}

function playPageAudio() {
    const page = currentBook.pages[currentPage];
    if (page.audio) {
        if (currentAudio) {
            currentAudio.pause();
        }
        currentAudio = new Audio(page.audio);
        currentAudio.play();
    }
}

function deletePageAudio() {
    if (confirm('¿Estás seguro de que quieres eliminar el audio de esta página?')) {
        currentBook.pages[currentPage].audio = null;
        updateAudioControls();
        unsavedChanges = true;
    }
}

// Guardar libro
function saveCurrentBook() {
    if (!currentBook) return;
    unsavedChanges = false;

    // Popup visual y amigable para niños sobre cambios no guardados
    function showUnsavedChangesPopup(onConfirm) {
        // Si ya existe, no crear otro
        if (document.getElementById('unsaved-popup')) return;
        const popup = document.createElement('div');
        popup.id = 'unsaved-popup';
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100vw';
        popup.style.height = '100vh';
        popup.style.background = 'rgba(0,0,0,0.4)';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.justifyContent = 'center';
        popup.style.zIndex = '9999';
        popup.innerHTML = `
        <div style="background: #fffbe7; border-radius: 24px; box-shadow: 0 4px 24px #0002; padding: 2.5rem 2rem; max-width: 350px; text-align: center; border: 4px solid #ffe082;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🧙‍♂️</div>
            <h2 style="color: #4a90e2; margin-bottom: 0.5rem;">¡Espera, ${userName}!</h2>
            <p style="font-size: 1.1rem; color: #333; margin-bottom: 1.2rem;">Tienes cambios mágicos sin guardar en tu cuento.<br>¿Quieres salir y perderlos?</p>
            <button id="popup-continue" style="background: #4a90e2; color: #fff; border: none; border-radius: 8px; padding: 0.7rem 1.5rem; font-size: 1.1rem; margin-right: 1rem; cursor: pointer;">Salir sin guardar</button>
            <button id="popup-cancel" style="background: #fff; color: #4a90e2; border: 2px solid #4a90e2; border-radius: 8px; padding: 0.7rem 1.5rem; font-size: 1.1rem; cursor: pointer;">Seguir editando</button>
        </div>
    `;
        document.body.appendChild(popup);
        document.getElementById('popup-continue').onclick = () => {
            document.body.removeChild(popup);
            if (onConfirm) onConfirm();
        };
        document.getElementById('popup-cancel').onclick = () => {
            document.body.removeChild(popup);
        };
    }

    // Detener grabación si está activa
    if (isRecording) {
        stopRecordingAutomatically();
    }

    // Verificar que el libro tenga contenido
    const hasContent = currentBook.pages.some(page => page.text || page.audio);
    if (!hasContent) {
        showMascot(`¡${userName}! Necesitas agregar texto o audio a al menos una página antes de guardar.`);
        return;
    }

    // Buscar si el libro ya existe
    const existingIndex = books.findIndex(book => book.id === currentBook.id);

    if (existingIndex >= 0) {
        books[existingIndex] = currentBook;
    } else {
        books.push(currentBook);
    }

    saveUserData();
    playSuccessSound();
    showMascot(`¡Felicidades ${userName}! Tu libro "${currentBook.title}" ha sido guardado exitosamente. ¡Eres un gran escritor!`, 5000);
}

// Gestión del lector
function displayReaderPages() {
    if (!currentBook) return;

    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');

    // Limpiar eventos anteriores
    leftPage.onclick = null;
    rightPage.onclick = null;

    // Portada (solo página derecha, página 0)
    if (currentPage === 0) {
        showBookCover();
    } else if (currentPage === 1) {
        // Dorso de portada a la izquierda, página 1 a la derecha
        showBackOfCoverAndPage1();
    } else if (currentPage >= currentBook.pages.length) {
        // Contraportada
        showBookBackCover();
    } else {
        // Páginas pares/impares normales
        showRegularPages();
    }
// Mostrar dorso de la portada a la izquierda y página 1 a la derecha
function showBackOfCoverAndPage1() {
    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');

    // Dorso de la portada (misma imagen que portada, sin texto)
    const portadaUrl = currentBook.pages && currentBook.pages[0] && currentBook.pages[0].background ? currentBook.pages[0].background : '';
    const leftBg = leftPage.querySelector('.page-background-left');
    const leftText = leftPage.querySelector('.page-text-left');
    leftBg.style.backgroundImage = `url(${portadaUrl})`;
    leftText.innerHTML = '';
    leftPage.style.display = 'flex';
    leftPage.onclick = () => {
        currentPage = 0;
        displayReaderPages();
    };

    // Página 1 a la derecha
    if (currentBook.pages.length > 1) {
        const page = currentBook.pages[1];
        const rightBg = rightPage.querySelector('.page-background-right');
        const rightText = rightPage.querySelector('.page-text-right');
        rightBg.style.backgroundImage = `url(${page.background})`;
        rightText.textContent = page.text || '';
        rightPage.style.display = 'flex';
        rightPage.onclick = () => {
            currentPage = 2;
            displayReaderPages();
        };
    } else {
        rightPage.style.display = 'none';
    }
    // Preparar y reproducir audios de las páginas visibles
    prepareAndPlayAudios();
}

    // Actualizar barra de progreso
    updateReadingProgress();
}

function showBookCover() {
    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');

    // Ocultar página izquierda
    leftPage.style.display = 'none';

    // Mostrar portada en página derecha
    const rightBg = rightPage.querySelector('.page-background-right');
    const rightText = rightPage.querySelector('.page-text-right');

    // Siempre usar la primera imagen como portada
    rightBg.style.backgroundImage = `url(${currentBook.pages && currentBook.pages[0] && currentBook.pages[0].background ? currentBook.pages[0].background : ''})`;
    rightText.innerHTML = `
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #333; text-shadow: 2px 2px 4px rgba(255,255,255,0.8);">${currentBook.title}</h1>
            <p style="font-size: 1.2rem; color: #666; text-shadow: 1px 1px 2px rgba(255,255,255,0.8);">${currentBook.description}</p>
            <p style="font-size: 1.1rem; color: #555; margin-top: 0.5rem;">Autor: ${currentBook.author || 'Autor desconocido'}</p>
            <p style="margin-top: 2rem; font-style: italic; color: #888;">Toca para comenzar</p>
        </div>
    `;
    rightPage.style.display = 'flex';
    rightPage.onclick = () => {
        currentPage = 1;
        displayReaderPages();
    };
}

function showBookBackCover() {
    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');

    // Mostrar contraportada en página izquierda
    const leftBg = leftPage.querySelector('.page-background-left');
    const leftText = leftPage.querySelector('.page-text-left');

    // Siempre usar la primera imagen como portada/contraportada si no hay otra
    // Siempre usar la primera imagen como portada/contraportada
    const backImg = (currentBook.pages && currentBook.pages[0] && currentBook.pages[0].background) ? currentBook.pages[0].background : '';
    leftBg.style.backgroundImage = `url(${backImg})`;
    // Fecha de creación (siempre mostrarla)
    let fechaCreacion = '';
    if (currentBook.createdAt) {
        fechaCreacion = `Fecha de creación: ${currentBook.createdAt}`;
    } else if (currentBook.lastEdit) {
        fechaCreacion = `Fecha de creación: ${currentBook.lastEdit}`;
    } else {
        // Si no existe, usar fecha actual
        const now = new Date();
        fechaCreacion = `Fecha de creación: ${now.toLocaleDateString()}`;
    }
    leftText.innerHTML = `
        <div style="text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center;">
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #333; text-shadow: 2px 2px 4px rgba(255,255,255,0.8);">¡Fin!</h2>
            <p style="font-size: 1.1rem; color: #666; text-shadow: 1px 1px 2px rgba(255,255,255,0.8);">¡Has terminado de leer \"${currentBook.title}\"!</p>
            <p style="font-size: 1.1rem; color: #555; margin-top: 0.5rem;">Autor: ${currentBook.author || 'Autor desconocido'}</p>
            <p style="font-size: 1.1rem; color: #888; margin-top: 0.5rem;">${fechaCreacion}</p>
            <p style="margin-top: 2rem; font-style: italic; color: #888;">Toca para cerrar</p>
        </div>
    `;
    leftPage.style.display = 'flex';

    // Ocultar página derecha
    rightPage.style.display = 'none';

    leftPage.onclick = () => {
        isReadingBook = false;
        showMyBooks();
    };
}

function showRegularPages() {
    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');

    // Páginas pares/impares normales (currentPage >= 2)
    // Izquierda: currentPage (par), Derecha: currentPage+1 (impar)
    if (currentPage < currentBook.pages.length) {
        const pageL = currentBook.pages[currentPage];
        const leftBg = leftPage.querySelector('.page-background-left');
        const leftText = leftPage.querySelector('.page-text-left');
        leftBg.style.backgroundImage = `url(${pageL.background})`;
        leftText.textContent = pageL.text || '';
        leftPage.style.display = 'flex';
        leftPage.onclick = () => {
            if (currentPage > 1) {
                currentPage -= 2;
                displayReaderPages();
            } else if (currentPage === 2) {
                currentPage = 1;
                displayReaderPages();
            }
        };
    } else {
        leftPage.style.display = 'none';
    }

    if (currentPage + 1 < currentBook.pages.length) {
        const pageR = currentBook.pages[currentPage + 1];
        const rightBg = rightPage.querySelector('.page-background-right');
        const rightText = rightPage.querySelector('.page-text-right');
        rightBg.style.backgroundImage = `url(${pageR.background})`;
        rightText.textContent = pageR.text || '';
        rightPage.style.display = 'flex';
        rightPage.onclick = () => {
            currentPage += 2;
            displayReaderPages();
        };
    } else {
        rightPage.style.display = 'none';
    }

    // Preparar y reproducir audios de las páginas visibles
    prepareAndPlayAudios();
}

function prepareAndPlayAudios() {
    audioQueue = [];
    currentAudioIndex = 0;

    // Agregar audios de páginas visibles a la cola
    if (currentPage >= 0 && currentPage < currentBook.pages.length && currentBook.pages[currentPage].audio) {
        audioQueue.push(currentBook.pages[currentPage].audio);
    }
    if (currentPage + 1 < currentBook.pages.length && currentBook.pages[currentPage + 1].audio) {
        audioQueue.push(currentBook.pages[currentPage + 1].audio);
    }

    // Reproducir primer audio si hay cola
    if (audioQueue.length > 0 && autoPlayMode) {
        setTimeout(() => {
            playNextAudioInQueue();
        }, 500);
    }
}

function playNextAudioInQueue() {
    if (currentAudioIndex < audioQueue.length) {
        if (currentAudio) {
            currentAudio.pause();
        }

        currentAudio = new Audio(audioQueue[currentAudioIndex]);
        currentAudio.onended = () => {
    if (!currentBook) return;

    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');

    // Limpiar eventos anteriores
    leftPage.onclick = null;
    rightPage.onclick = null;

    // Portada (solo página derecha, página 0)
    if (currentPage === 0) {
        showBookCover();
    } else if (currentPage === 1) {
        // Dorso de portada a la izquierda, página 1 a la derecha
        showBackOfCoverAndPage1();
    } else if (currentPage >= currentBook.pages.length) {
        showBookBackCover();
    } else {
        showRegularPages();
    }


    // Actualizar barra de progreso
    updateReadingProgress();
}

function toggleAutoPlay() {
    autoPlayMode = !autoPlayMode;
    const btn = document.getElementById('auto-play-btn');

    if (autoPlayMode) {
        btn.classList.add('auto-play-active');
        btn.textContent = '⏸️';
        playReaderAudio();
    } else {
        btn.classList.remove('auto-play-active');
        btn.textContent = '⏯️';
        if (currentAudio) {
            currentAudio.pause();
        }
    }
}

function updateReadingProgress() {
    const progress = ((currentPage + 1) / currentBook.pages.length) * 100;
    document.getElementById('reading-progress').style.width = `${progress}%`;
}

// Creador de libros
function initializeCreator() {
    document.getElementById('book-title-input').value = '';
    let authorInput = document.getElementById('book-author-input');
    if (authorInput) authorInput.value = '';
    document.getElementById('book-description').value = '';
    document.getElementById('page-creator').innerHTML = '';
    // Agregar páginas iniciales
    for (let i = 0; i < 3; i++) {
        addNewPage();
    }
}

function addNewPage() {
    const container = document.getElementById('page-creator');
    const pageCount = container.children.length;

    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-creator-item';

    // La primera imagen es la portada, las siguientes son páginas 1, 2, ...
    let pageLabel = '';
    if (pageCount === 0) {
        pageLabel = 'Portada';
    } else {
        pageLabel = `Página ${pageCount}`;
    }

    pageDiv.innerHTML = `
        <h4>${pageLabel}</h4>
        <div class="image-selection">
            <div class="image-upload">
                <label for="page-image-${pageCount+1}">📷 Subir imagen propia</label>
                <input type="file" id="page-image-${pageCount+1}" accept="image/*" onchange="handleImageUpload(this, ${pageCount})">
            </div>
            <button class="gallery-btn" onclick="showImageGallery(${pageCount})">🖼️ Galería de imágenes</button>
        </div>
        <div class="image-preview" id="preview-${pageCount+1}" style="display: none; margin: 1rem 0;">
            <img style="max-width: 200px; max-height: 150px; border-radius: 10px;" id="img-${pageCount+1}">
        </div>
        <div class="image-gallery-modal hidden" id="gallery-modal-${pageCount+1}">
            <div class="gallery-content">
                <h4>Selecciona una imagen</h4>
                <div class="gallery-categories">
                    ${Object.entries(IMAGE_GALLERY).map(([category, images]) => `
                        <div class="gallery-category">
                            <h5>${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                            <div class="gallery-images">
                                ${images.map(img => `
                                    <img src="${img}" onclick="selectGalleryImage('${img}', ${pageCount}, ${pageCount+1})" 
                                         style="width: 80px; height: 60px; object-fit: cover; margin: 5px; cursor: pointer; border-radius: 5px;">
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button onclick="closeImageGallery(${pageCount+1})">Cerrar</button>
            </div>
        </div>
    `;

    container.appendChild(pageDiv);
}

function showImageGallery(pageIndex) {
    const modal = document.getElementById(`gallery-modal-${pageIndex + 1}`);
    modal.classList.remove('hidden');
}

function closeImageGallery(pageNumber) {
    const modal = document.getElementById(`gallery-modal-${pageNumber}`);
    modal.classList.add('hidden');
}

function selectGalleryImage(imageUrl, pageIndex, pageNumber) {
    const preview = document.getElementById(`preview-${pageNumber}`);
    const img = document.getElementById(`img-${pageNumber}`);

    img.src = imageUrl;
    preview.style.display = 'block';

    // Guardar la imagen en el arreglo temporal
    if (!window.tempBookPages) {
        window.tempBookPages = [];
    }
    window.tempBookPages[pageIndex] = {
        background: imageUrl,
        text: ''
    };

    closeImageGallery(pageNumber);
}

function handleImageUpload(input, pageIndex) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById(`preview-${pageIndex + 1}`);
            const img = document.getElementById(`img-${pageIndex + 1}`);
            img.src = e.target.result;
            preview.style.display = 'block';

            // Guardar la imagen en el arreglo temporal
            if (!window.tempBookPages) {
                window.tempBookPages = [];
            }
            window.tempBookPages[pageIndex] = {
                background: e.target.result,
                text: ''
            };
        };
        reader.readAsDataURL(file);
    }
}

function createNewBook() {
    const title = document.getElementById('book-title-input').value.trim();
    const description = document.getElementById('book-description').value.trim();
    // Tomar autor del input
    let authorInput = document.getElementById('book-author-input');
    let author = (authorInput && authorInput.value.trim()) ? authorInput.value.trim() : ((typeof userName === 'string' && userName.trim()) ? userName.trim() : 'Autor desconocido');

    if (!title) {
        playErrorSound();
        showMascot(`¡${userName}! No olvides ponerle un título a tu libro.`);
        return;
    }

    if (!window.tempBookPages || !Array.isArray(window.tempBookPages) || window.tempBookPages.length === 0) {
        playErrorSound();
        showMascot(`¡${userName}! Necesitas agregar al menos una imagen de fondo para comenzar.`);
        return;
    }

    // Validar que la primera página tenga imagen (portada)
    const portada = window.tempBookPages[0];
    if (!portada || !portada.background) {
        playErrorSound();
        showMascot(`¡${userName}! Debes seleccionar una imagen para la portada (primera página).`);
        return;
    }

    // Asegurar que cada página tenga al menos el campo background y text
    const pages = window.tempBookPages
        .filter(page => page && typeof page.background === 'string' && page.background.length > 0)
        .map(page => ({
            background: page.background,
            text: typeof page.text === 'string' ? page.text : ''
        }));

    const newBook = {
        id: 'custom_' + Date.now(),
        title: title,
        description: description || 'Mi libro personalizado',
        author: author,
        pages: pages,
        isTemplate: false,
        createdAt: new Date().toLocaleDateString()
    };

    window.tempBookPages = [];
    playSuccessSound();
    showMascot(`¡Felicidades ${userName}! Has creado "${title}". ¡Eres un verdadero escritor mágico! Ahora puedes agregar texto y audio a cada página.`, 6000);
    showBookEditor(newBook);
}

// Función para eliminar libro
function deleteBook(index) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${books[index].title}"? Esta acción no se puede deshacer.`)) {
        books.splice(index, 1);
        saveUserData();
        displayUserBooks();
        alert('Libro eliminado correctamente.');
    }
}

// Función para crear video MP4 del libro
async function createBookVideo(book) {

    try {
        // Validar datos esenciales antes de iniciar el proceso
        const portada = (book.pages && Array.isArray(book.pages) && book.pages[0]) ? book.pages[0].background : null;
        const autor = (typeof book.author === 'string' && book.author.trim()) ? book.author : 'Autor desconocido';
        const descripcion = (typeof book.description === 'string' && book.description.trim()) ? book.description : 'Mi libro personalizado';
        if (!portada || portada.length < 5) {
            playErrorSound();
            showMascot(`${userName}, tu libro no tiene una imagen de portada válida. Por favor edita el libro y selecciona una imagen para la portada.`);
            return;
        }
        if (!book.title || typeof book.title !== 'string' || book.title.trim().length === 0) {
            playErrorSound();
            showMascot(`${userName}, tu libro no tiene título. Por favor edita el libro y ponle un título.`);
            return;
        }

        showMascot(`${userName}, estoy preparando tu video mágico... ¡Esto puede tomar unos momentos!`, 3000);
        playMagicSound();

        // Canvas y contexto
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1280;
        canvas.height = 720;

        // MediaRecorder para capturar el canvas
        const stream = canvas.captureStream(30);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioDestination = audioContext.createMediaStreamDestination();
        stream.addTrack(audioDestination.stream.getAudioTracks()[0]);
        const videoRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
        const chunks = [];
        videoRecorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data); };
        videoRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            downloadVideoBlob(blob, book.title);
        };
        videoRecorder.start();
        // ...

        // Dibuja el libro cerrado (portada/contraportada) y espera a que la imagen cargue
        async function drawClosedBook(coverImg, title, author, desc) {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Sombra libro
            ctx.fillStyle = '#bfa76f';
            ctx.fillRect(canvas.width/2-220, 120, 440, 480);
            // Tapa
            ctx.fillStyle = '#f5e6c8';
            ctx.fillRect(canvas.width/2-200, 140, 400, 440);
            // Imagen portada
            if (coverImg) {
                const img = new Image();
                await new Promise(res => {
                    img.onload = () => {
                        ctx.drawImage(img, canvas.width/2-180, 160, 360, 220);
                        res();
                    };
                    img.onerror = res;
                    img.src = coverImg;
                });
            }
            // Título
            ctx.font = 'bold 40px "Comic Sans MS", cursive';
            ctx.fillStyle = '#4a90e2';
            ctx.textAlign = 'center';
            ctx.fillText(title, canvas.width/2, 410);
            // Autor
            ctx.font = '28px "Comic Sans MS", cursive';
            ctx.fillStyle = '#666';
            ctx.fillText('Autor: ' + (author||''), canvas.width/2, 450);
            // Descripción
            ctx.font = '22px "Comic Sans MS", cursive';
            ctx.fillStyle = '#888';
            ctx.fillText(desc||'', canvas.width/2, 490);
            ctx.restore();
        }

        // Dibuja el libro abierto (doble página)
        async function drawOpenBook(left, right, leftText, rightText) {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Fondo
            ctx.fillStyle = '#f5e6c8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Sombra central
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(canvas.width / 2 - 10, 40, 20, canvas.height - 80);
            // Borde
            ctx.strokeStyle = '#bfa76f';
            ctx.lineWidth = 12;
            ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
            // Imagen izquierda
            if (left) {
                const imgL = new Image();
                await new Promise(res => {
                    imgL.onload = () => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(60, 60);
                        ctx.lineTo(canvas.width/2-10, 60);
                        ctx.lineTo(canvas.width/2-10, canvas.height-60);
                        ctx.lineTo(60, canvas.height-60);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(imgL, 60, 60, canvas.width/2-70, canvas.height-120);
                        ctx.restore();
                        res();
                    };
                    imgL.onerror = res;
                    imgL.src = left;
                });
            }
            // Imagen derecha
            if (right) {
                const imgR = new Image();
                await new Promise(res => {
                    imgR.onload = () => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(canvas.width/2+10, 60);
                        ctx.lineTo(canvas.width-60, 60);
                        ctx.lineTo(canvas.width-60, canvas.height-60);
                        ctx.lineTo(canvas.width/2+10, canvas.height-60);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(imgR, canvas.width/2+10, 60, canvas.width/2-70, canvas.height-120);
                        ctx.restore();
                        res();
                    };
                    imgR.onerror = res;
                    imgR.src = right;
                });
            }
            // Texto izquierda
            if (leftText) {
                ctx.save();
                ctx.font = 'bold 32px "Comic Sans MS", cursive';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 4;
                const x = canvas.width/4;
                const y = canvas.height - 120;
                const maxWidth = canvas.width/2-100;
                let words = (leftText||'').split(' '), line = '', lines = [];
                for (let w of words) {
                    let test = line + w + ' ';
                    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w + ' '; } else { line = test; }
                }
                if (line) lines.push(line);
                lines.forEach((l,i)=>ctx.fillText(l.trim(), x, y+40*i));
                ctx.restore();
            }
            // Texto derecha
            if (rightText) {
                ctx.save();
                ctx.font = 'bold 32px "Comic Sans MS", cursive';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 4;
                const x = 3*canvas.width/4;
                const y = canvas.height - 120;
                const maxWidth = canvas.width/2-100;
                let words = (rightText||'').split(' '), line = '', lines = [];
                for (let w of words) {
                    let test = line + w + ' ';
                    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w + ' '; } else { line = test; }
                }
                if (line) lines.push(line);
                lines.forEach((l,i)=>ctx.fillText(l.trim(), x, y+40*i));
                ctx.restore();
            }
            ctx.restore();
        }

        // Animación de apertura de libro
        async function animateBookOpening(coverImg, title, author, desc) {
            // De libro cerrado a abierto (simple fade)
            for (let t=0; t<=1; t+=0.05) {
                ctx.save();
                ctx.globalAlpha = 1;
                drawClosedBook(coverImg, title, author, desc);
                ctx.globalAlpha = t;
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.restore();
                await new Promise(r=>setTimeout(r,20));
            }
        }

        // Animación de paso de página (doble página)
        async function animatePageTurnDouble(prevLeft, prevRight, nextLeft, nextRight, prevLeftText, prevRightText, nextLeftText, nextRightText) {
            // Efecto de "giro" simple: deslizamiento horizontal
            const steps = 20;
            // Precargar imágenes si existen
            let imgPrevLeft = null, imgPrevRight = null, imgNextLeft = null, imgNextRight = null;
            async function loadImg(src) {
                if (!src) return null;
                return await new Promise(res => {
                    const img = new Image();
                    img.onload = () => res(img);
                    img.onerror = () => res(null);
                    img.src = src;
                });
            }
            [imgPrevLeft, imgPrevRight, imgNextLeft, imgNextRight] = await Promise.all([
                loadImg(prevLeft),
                loadImg(prevRight),
                loadImg(nextLeft),
                loadImg(nextRight)
            ]);
            for (let s=0; s<=steps; s++) {
                const progress = s/steps;
                ctx.save();
                ctx.clearRect(0,0,canvas.width,canvas.height);
                // Fondo
                ctx.fillStyle = '#f5e6c8';
                ctx.fillRect(0,0,canvas.width,canvas.height);
                // Páginas anteriores (izq/der) se deslizan a la izquierda
                if (imgPrevLeft) {
                    ctx.drawImage(imgPrevLeft, 60-progress*canvas.width/2, 60, canvas.width/2-70, canvas.height-120);
                }
                if (imgPrevRight) {
                    ctx.drawImage(imgPrevRight, canvas.width/2+10-progress*canvas.width/2, 60, canvas.width/2-70, canvas.height-120);
                }
                // Nuevas páginas aparecen desde la derecha
                if (imgNextLeft) {
                    ctx.drawImage(imgNextLeft, 60+progress*canvas.width/2, 60, canvas.width/2-70, canvas.height-120);
                }
                if (imgNextRight) {
                    ctx.drawImage(imgNextRight, canvas.width/2+10+progress*canvas.width/2, 60, canvas.width/2-70, canvas.height-120);
                }
                ctx.restore();
                await new Promise(r=>setTimeout(r,20));
            }
        }
        const pages = [
            { type: 'cover', img: portada, text: book.title, desc: descripcion, author: autor },
            ...(Array.isArray(book.pages) ? book.pages.map((p, i) => ({
                type: 'page',
                img: p && p.background ? p.background : '',
                text: p && typeof p.text === 'string' ? p.text : '',
                audio: p && p.audio ? p.audio : undefined,
                idx: i
            })) : []),
            { type: 'back', img: (book.pages && book.pages.length > 0 && book.pages[0]?.background) ? book.pages[0].background : portada, text: '¡Fin!', desc: `Has terminado de leer "${book.title}"`, author: autor, lastEdit: book.lastEdit || (new Date()).toLocaleDateString() }
        ];

        async function renderBookPages() {
            // 1. Libro cerrado (portada)
            await drawClosedBook(pages[0].img, pages[0].text, pages[0].author, pages[0].desc);
            await new Promise(r=>setTimeout(r, 1500));

            // 2. Animación de apertura
            await animateBookOpening(pages[0].img, pages[0].text, pages[0].author, pages[0].desc);
            await new Promise(r=>setTimeout(r, 500));

            // 3. Portadilla (igual a portada, pero libro abierto)
            await drawOpenBook(pages[0].img, null, pages[0].text, pages[0].author);
            await new Promise(r=>setTimeout(r, 1200));

            // 4. Páginas dobles de la historia
            let pagePairs = [];
            for (let i=1; i<pages.length-1; i+=2) {
                pagePairs.push([pages[i], pages[i+1]||null]);
            }
            let prevLeft = pages[0].img, prevRight = null, prevLeftText = '', prevRightText = '';
            for (let pair of pagePairs) {
                const left = pair[0], right = pair[1];
                // Animación de paso de página
                await animatePageTurnDouble(prevLeft, prevRight, left?.img, right?.img, prevLeftText, prevRightText, left?.text, right?.text);
                // Mostrar doble página
                await drawOpenBook(left?.img, right?.img, left?.text, right?.text);
                // Reproducir audio de ambas páginas, en orden, solo una vez cada una
                if (left?.audio) {
                    const audioL = new Audio(left.audio);
                    const audioSourceL = audioContext.createMediaElementSource(audioL);
                    audioSourceL.connect(audioDestination);
                    await new Promise(res=>{audioL.onended=res; audioL.play().catch(()=>res());});
                }
                if (right?.audio) {
                    const audioR = new Audio(right.audio);
                    const audioSourceR = audioContext.createMediaElementSource(audioR);
                    audioSourceR.connect(audioDestination);
                    await new Promise(res=>{audioR.onended=res; audioR.play().catch(()=>res());});
                }
                await new Promise(r=>setTimeout(r, 500));
                prevLeft = left?.img; prevRight = right?.img; prevLeftText = left?.text; prevRightText = right?.text;
            }

            // 5. Cierre del libro mostrando contraportada
            // (Animación simple: fundido a libro cerrado con contraportada)
            for (let t=0; t<=1; t+=0.05) {
                ctx.save();
                ctx.globalAlpha = 1-t;
                await drawOpenBook(prevLeft, prevRight, prevLeftText, prevRightText);
                ctx.globalAlpha = t;
                await drawClosedBook(pages[pages.length-1].img, pages[pages.length-1].text, pages[pages.length-1].author, pages[pages.length-1].desc);
                ctx.restore();
                await new Promise(r=>setTimeout(r,20));
            }
            // Contraportada con fecha
            await drawClosedBook(pages[pages.length-1].img, pages[pages.length-1].text, pages[pages.length-1].author, 'Última edición: '+(pages[pages.length-1].lastEdit||''));
            await new Promise(r=>setTimeout(r, 1500));

            setTimeout(() => {
                videoRecorder.stop();
                audioContext.close();
                playSuccessSound();
                showMascot(`¡Increíble ${userName}! Tu libro animado está listo para descargar y compartir.`, 4000);
            }, 1000);
        }

        await renderBookPages();
    } catch (error) {
        console.error('Error creando video:', error);
        playErrorSound();
        showMascot(`${userName}, hubo un problema creando el video. Intenta de nuevo.`);
    }
}

// Función para descargar el blob de video
function downloadVideoBlob(blob, title) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}_AudioTale.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Función para descargar libro (ahora genera video)
function downloadBook(book) {
    playClickSound();
    createBookVideo(book);
}

// Funciones de compartir
function openShareModal() {
    document.getElementById('share-modal').classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
}

function shareOnFacebook() {
    playClickSound();
    const text = `¡Mira este increíble cuento "${currentBook.title}" que creé en AudioTale! 🎧📚🎬`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
    showMascot(`${userName}, ¡genial! Compartir tus historias inspire a otros niños.`);
    closeShareModal();
}

function shareOnTwitter() {
    playClickSound();
    const text = `¡Mira este increíble cuento "${currentBook.title}" que creé en AudioTale! 🎧📚🎬 Descarga el video y compártelo con tus amigos.`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    showMascot(`¡Perfecto ${userName}! Twitter es genial para compartir tu creatividad.`);
    closeShareModal();
}

function shareOnWhatsApp() {
    playClickSound();
    const text = `¡Mira este increíble cuento "${currentBook.title}" que creé en AudioTale! 🎧📚🎬 Primero descarga el video desde la app: ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showMascot(`¡Excelente ${userName}! Compartir con la familia es lo mejor.`);
    closeShareModal();
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('¡Enlace copiado al portapapeles!');
        closeShareModal();
    });
}

// Funciones para imágenes del usuario
function handleUserImageUpload(input) {
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                userImages.push({
                    id: 'user_img_' + Date.now() + '_' + i,
                    url: e.target.result,
                    name: file.name
                });
                saveUserData();
                displayUserImages();
            };
            reader.readAsDataURL(file);
        }
    }
    input.value = ''; // Limpiar input
}

function displayUserImages() {
    const grid = document.getElementById('user-images-grid');
    if (!grid) return;

    grid.innerHTML = '';

    userImages.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'user-image-item';

        imageItem.innerHTML = `
            <img src="${image.url}" onclick="selectUserImage('${image.url}')" title="${image.name}">
            <button class="user-image-delete" onclick="deleteUserImage(${index})" title="Eliminar imagen">×</button>
        `;

        grid.appendChild(imageItem);
    });
}

function selectUserImage(imageUrl) {
    // Esta función puede ser llamada desde el contexto de creación de páginas
    alert('Imagen seleccionada. Implementar lógica de selección según el contexto.');
}

function deleteUserImage(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
        userImages.splice(index, 1);
        saveUserData();
        displayUserImages();
    }
}

function initializeCreator() {
    document.getElementById('book-title-input').value = '';
    document.getElementById('book-description').value = '';
    document.getElementById('page-creator').innerHTML = '';

    // Mostrar imágenes del usuario
    displayUserImages();

    // Agregar páginas iniciales
    for (let i = 0; i < 3; i++) {
        addNewPage();
    }
}

// Persistencia de datos
function saveUserData() {
    try {
        const userData = {
            books: books,
            userImages: userImages
        };
        localStorage.setItem('audioTaleData', JSON.stringify(userData));
        console.log('💾 Datos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

function loadUserData() {
    try {
        const savedData = localStorage.getItem('audioTaleData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            books = userData.books || [];
            userImages = userData.userImages || [];
            // Migrar audios antiguos (blob:) a null para evitar referencias rotas
            books.forEach(book => {
                // Asegurar campos esenciales
                if (!book.author || typeof book.author !== 'string') {
                    book.author = 'Autor desconocido';
                }
                if (!book.description || typeof book.description !== 'string') {
                    book.description = 'Mi libro personalizado';
                }
                if (book.pages && Array.isArray(book.pages) && book.pages.length > 0) {
                    // Asegurar que la portada tenga imagen
                    if (!book.pages[0] || typeof book.pages[0] !== 'object') {
                        book.pages[0] = { background: '', text: '' };
                    } else if (!book.pages[0].background) {
                        book.pages[0].background = '';
                    }
                    book.pages.forEach(page => {
                        // Solo borrar audios que sean blob:, no los que sean data:audio
                        if (page.audio && typeof page.audio === 'string') {
                            if (page.audio.startsWith('blob:')) {
                                console.log('🧹 Migrando audio blob: a null en página', page);
                                page.audio = null;
                            } else if (page.audio.startsWith('data:audio')) {
                                // Audio válido, log para depuración
                                console.log('✅ Audio base64 detectado en página', page);
                            }
                        }
                        // Asegurar campos mínimos
                        if (!('text' in page)) page.text = '';
                        if (!('background' in page)) page.background = '';
                    });
                }
            });
            console.log(`📚 Cargados ${books.length} libros y ${userImages.length} imágenes`);
        }

        // Migrar datos antiguos si existen
        const oldBooks = localStorage.getItem('audioTaleBooks');
        if (oldBooks && books.length === 0) {
            books = JSON.parse(oldBooks);
            saveUserData();
            localStorage.removeItem('audioTaleBooks');
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        books = [];
        userImages = [];
    }
}

// Service Worker para PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('📱 Service Worker registrado correctamente');
            })
            .catch(error => {
                console.log('❌ Error al registrar Service Worker:', error);
            });
    });
}

// Gestión de eventos de teclado
document.addEventListener('keydown', function (e) {
    if (currentSection === 'book-editor') {
        if (e.key === 'ArrowLeft' && !e.target.matches('textarea, input')) {
            previousPage();
        } else if (e.key === 'ArrowRight' && !e.target.matches('textarea, input')) {
            nextPage();
        }
    } else if (currentSection === 'book-reader') {
        if (e.key === 'ArrowLeft') {
            readerPreviousPage();
        } else if (e.key === 'ArrowRight') {
            readerNextPage();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleAutoPlay();
        }
    }
});

// Controlar música de fondo
function toggleBackgroundMusic() {
    const musicBtn = document.getElementById('music-toggle');

    backgroundMusicEnabled = !backgroundMusicEnabled;

    if (backgroundMusicEnabled) {
        musicBtn.textContent = '🎵';
        musicBtn.title = 'Pausar música';
        // Solo iniciar música si no estamos en editor/lector de libros
        if (currentSection === 'main-menu' || currentSection === 'library' ||
            currentSection === 'my-books' || currentSection === 'book-creator') {
            startBackgroundMusic();
        }
        playClickSound();
    } else {
        musicBtn.textContent = '🔇';
        musicBtn.title = 'Reproducir música';
        stopBackgroundMusic();
        playClickSound();
    }
}

// Hacer la app descargable como PWA
function makeAppDownloadable() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Mostrar botón de instalación personalizado
        const installBtn = document.createElement('button');
        installBtn.id = 'install-btn';
        installBtn.className = 'install-btn';
        installBtn.innerHTML = '📱 Instalar App';
        installBtn.onclick = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    showMascot(`¡Genial ${userName}! Ahora puedes usar AudioTale desde tu dispositivo.`);
                }
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        };

        document.body.appendChild(installBtn);
    });
}

// Inicializar PWA al cargar la página
window.addEventListener('load', () => {
    makeAppDownloadable();
});

// Forzar actualización de caché en desarrollo
if (location.hostname === 'localhost' || location.hostname.includes('repl')) {
    // Agregar timestamp para evitar caché en desarrollo
    const timestamp = new Date().getTime();
    console.log('🔄 Forzando actualización de caché - Timestamp:', timestamp);
}

console.log('🎧 AudioTale cargado correctamente - ¡Listo para crear cuentos mágicos!');




