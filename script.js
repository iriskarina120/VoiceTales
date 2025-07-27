
// AudioTale - Aplicación de cuentos interactivos
// Desarrollado con HTML, CSS y JavaScript

// Variables globales
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

// Plantillas predefinidas de cuentos
const DEFAULT_TEMPLATES = [
    {
        id: 'forest-adventure',
        title: 'Aventura en el Bosque',
        description: 'Una mágica aventura entre árboles gigantes y criaturas fantásticas.',
        pages: [
            { background: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', text: '' }
        ]
    },
    {
        id: 'ocean-tale',
        title: 'Cuentos del Océano',
        description: 'Descubre los secretos del fondo marino con peces coloridos.',
        pages: [
            { background: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800', text: '' }
        ]
    },
    {
        id: 'space-journey',
        title: 'Viaje Espacial',
        description: 'Explora las estrellas y planetas lejanos en esta aventura cósmica.',
        pages: [
            { background: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1614732414444-096040ec8cfb?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1538414915055-29d20b820b2b?w=800', text: '' }
        ]
    },
    {
        id: 'fairy-castle',
        title: 'El Castillo de las Hadas',
        description: 'Un reino mágico lleno de hadas, unicornios y mucha diversión.',
        pages: [
            { background: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1563306406-e66174fa3787?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1520637836862-4d197d17c95a?w=800', text: '' },
            { background: 'https://images.unsplash.com/photo-1585411241865-ec2858c7de80?w=800', text: '' }
        ]
    }
];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎧 Iniciando AudioTale...');
    
    // Simular carga de la aplicación
    setTimeout(() => {
        hideLoadingScreen();
        showMainMenu();
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
    
    // Inicializar plantillas
    templates = [...DEFAULT_TEMPLATES];
    
    console.log('✅ Aplicación inicializada correctamente');
}

// Configurar event listeners
function setupEventListeners() {
    // Menú principal
    document.getElementById('library-btn').addEventListener('click', showLibrary);
    document.getElementById('my-books-btn').addEventListener('click', showMyBooks);
    document.getElementById('create-btn').addEventListener('click', showBookCreator);
    
    // Editor
    document.getElementById('editor-back-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
            showMainMenu();
        }
    });
    document.getElementById('save-book-btn').addEventListener('click', saveCurrentBook);
    document.getElementById('prev-page-btn').addEventListener('click', previousPage);
    document.getElementById('next-page-btn').addEventListener('click', nextPage);
    document.getElementById('record-btn').addEventListener('click', toggleRecording);
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
}

function showLibrary() {
    hideAllSections();
    document.getElementById('library-section').classList.remove('hidden');
    currentSection = 'library';
    displayTemplates();
}

function showMyBooks() {
    hideAllSections();
    document.getElementById('my-books-section').classList.remove('hidden');
    currentSection = 'my-books';
    displayUserBooks();
}

function showBookCreator() {
    hideAllSections();
    document.getElementById('book-creator').classList.remove('hidden');
    currentSection = 'book-creator';
    initializeCreator();
}

function showBookEditor(book) {
    hideAllSections();
    document.getElementById('book-editor').classList.remove('hidden');
    currentSection = 'book-editor';
    currentBook = book;
    currentPage = 0;
    document.getElementById('editor-title').textContent = `Editando: ${book.title}`;
    displayCurrentPage();
}

function showBookReader(book) {
    hideAllSections();
    document.getElementById('book-reader').classList.remove('hidden');
    currentSection = 'book-reader';
    currentBook = book;
    currentPage = 0;
    document.getElementById('reader-title').textContent = book.title;
    displayReaderPages();
}

function hideAllSections() {
    const sections = ['main-menu', 'library-section', 'my-books-section', 'book-editor', 'book-reader', 'book-creator'];
    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
}

// Mostrar plantillas
function displayTemplates() {
    const grid = document.getElementById('templates-grid');
    grid.innerHTML = '';
    
    templates.forEach(template => {
        const bookCard = createBookCard(template, () => {
            // Crear copia de la plantilla para editar
            const newBook = {
                ...template,
                id: 'book_' + Date.now(),
                isTemplate: false,
                pages: template.pages.map(page => ({...page}))
            };
            showBookEditor(newBook);
        });
        grid.appendChild(bookCard);
    });
}

// Mostrar libros del usuario
function displayUserBooks() {
    const grid = document.getElementById('my-books-grid');
    grid.innerHTML = '';
    
    if (books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: white; font-size: 1.2rem; grid-column: 1/-1;">No tienes libros guardados aún. ¡Crea tu primer libro!</p>';
        return;
    }
    
    books.forEach(book => {
        const bookCard = createBookCard(book, () => {
            showBookReader(book);
        });
        grid.appendChild(bookCard);
    });
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
        currentPage--;
        displayCurrentPage();
    }
}

function nextPage() {
    if (currentPage < currentBook.pages.length - 1) {
        currentPage++;
        displayCurrentPage();
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
                const audioUrl = URL.createObjectURL(audioBlob);
                currentBook.pages[currentPage].audio = audioUrl;
                updateAudioControls();
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            isRecording = true;
            recordBtn.textContent = '⏹️ Parar';
            recordBtn.classList.add('recording');
            
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
    }
}

// Guardar libro
function saveCurrentBook() {
    if (!currentBook) return;
    
    // Verificar que el libro tenga contenido
    const hasContent = currentBook.pages.some(page => page.text || page.audio);
    if (!hasContent) {
        alert('Agrega texto o audio a al menos una página antes de guardar.');
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
    alert('¡Libro guardado exitosamente!');
}

// Gestión del lector
function displayReaderPages() {
    if (!currentBook) return;
    
    const leftPage = document.getElementById('page-left');
    const rightPage = document.getElementById('page-right');
    
    // Página izquierda
    if (currentPage < currentBook.pages.length) {
        const page = currentBook.pages[currentPage];
        const leftBg = leftPage.querySelector('.page-background-left');
        const leftText = leftPage.querySelector('.page-text-left');
        
        leftBg.style.backgroundImage = `url(${page.background})`;
        leftText.textContent = page.text || '';
        leftPage.style.display = 'flex';
    } else {
        leftPage.style.display = 'none';
    }
    
    // Página derecha
    if (currentPage + 1 < currentBook.pages.length) {
        const page = currentBook.pages[currentPage + 1];
        const rightBg = rightPage.querySelector('.page-background-right');
        const rightText = rightPage.querySelector('.page-text-right');
        
        rightBg.style.backgroundImage = `url(${page.background})`;
        rightText.textContent = page.text || '';
        rightPage.style.display = 'flex';
    } else {
        rightPage.style.display = 'none';
    }
    
    // Reproducir audio automáticamente si está activado
    if (autoPlayMode && currentBook.pages[currentPage]?.audio) {
        setTimeout(() => {
            playReaderAudio();
        }, 500);
    }
    
    // Actualizar barra de progreso
    updateReadingProgress();
}

function readerPreviousPage() {
    if (currentPage > 0) {
        currentPage -= 2;
        if (currentPage < 0) currentPage = 0;
        displayReaderPages();
    }
}

function readerNextPage() {
    if (currentPage + 2 < currentBook.pages.length) {
        currentPage += 2;
        displayReaderPages();
    }
}

function playReaderAudio() {
    const page = currentBook.pages[currentPage];
    if (page?.audio) {
        if (currentAudio) {
            currentAudio.pause();
        }
        currentAudio = new Audio(page.audio);
        currentAudio.play();
        
        // Auto-advance si está en modo auto-play
        if (autoPlayMode) {
            currentAudio.onended = () => {
                setTimeout(() => {
                    if (currentPage + 2 < currentBook.pages.length) {
                        readerNextPage();
                    }
                }, 1000);
            };
        }
    }
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
    document.getElementById('book-description').value = '';
    document.getElementById('page-creator').innerHTML = '';
    
    // Agregar páginas iniciales
    for (let i = 0; i < 3; i++) {
        addNewPage();
    }
}

function addNewPage() {
    const container = document.getElementById('page-creator');
    const pageCount = container.children.length + 1;
    
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-creator-item';
    
    pageDiv.innerHTML = `
        <h4>Página ${pageCount}</h4>
        <div class="image-upload">
            <label for="page-image-${pageCount}">📷 Subir imagen de fondo</label>
            <input type="file" id="page-image-${pageCount}" accept="image/*" onchange="handleImageUpload(this, ${pageCount - 1})">
        </div>
        <div class="image-preview" id="preview-${pageCount}" style="display: none; margin: 1rem 0;">
            <img style="max-width: 200px; max-height: 150px; border-radius: 10px;" id="img-${pageCount}">
        </div>
    `;
    
    container.appendChild(pageDiv);
}

function handleImageUpload(input, pageIndex) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
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
    
    if (!title) {
        alert('Por favor ingresa un título para el libro.');
        return;
    }
    
    if (!window.tempBookPages || window.tempBookPages.length === 0) {
        alert('Por favor agrega al menos una imagen de fondo.');
        return;
    }
    
    const newBook = {
        id: 'custom_' + Date.now(),
        title: title,
        description: description || 'Mi libro personalizado',
        pages: window.tempBookPages.filter(page => page), // Filtrar páginas vacías
        isTemplate: false
    };
    
    window.tempBookPages = [];
    showBookEditor(newBook);
}

// Funciones de compartir
function openShareModal() {
    document.getElementById('share-modal').classList.remove('hidden');
}

function closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
}

function shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    closeShareModal();
}

function shareOnTwitter() {
    const text = `¡Mira este increíble cuento "${currentBook.title}" que creé en AudioTale! 🎧📚`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    closeShareModal();
}

function shareOnWhatsApp() {
    const text = `¡Mira este increíble cuento "${currentBook.title}" que creé en AudioTale! 🎧📚 ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeShareModal();
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('¡Enlace copiado al portapapeles!');
        closeShareModal();
    });
}

// Persistencia de datos
function saveUserData() {
    try {
        localStorage.setItem('audioTaleBooks', JSON.stringify(books));
        console.log('💾 Datos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

function loadUserData() {
    try {
        const savedBooks = localStorage.getItem('audioTaleBooks');
        if (savedBooks) {
            books = JSON.parse(savedBooks);
            console.log(`📚 Cargados ${books.length} libros guardados`);
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        books = [];
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
document.addEventListener('keydown', function(e) {
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

console.log('🎧 AudioTale cargado correctamente - ¡Listo para crear cuentos mágicos!');
