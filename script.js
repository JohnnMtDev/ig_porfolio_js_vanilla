// Datos de las imágenes con sus likes
const imagesData = [
    { 
        id: 1, 
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", 
        likes: 1234, 
        dislikes: 45,
        alt: "Paisaje montañoso al atardecer",
        title: "Atardecer en las montañas"
    },
    { 
        id: 2, 
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", 
        likes: 2567, 
        dislikes: 89,
        alt: "Bosque verde con rayos de sol",
        title: "Bosque iluminado"
    },
    { 
        id: 3, 
        url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", 
        likes: 892, 
        dislikes: 12,
        alt: "Lago en las montañas",
        title: "Lago sereno"
    },
    { 
        id: 4, 
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", 
        likes: 3421, 
        dislikes: 67,
        alt: "Aurora boreal en el cielo nocturno",
        title: "Aurora boreal"
    },
    { 
    id: 5, 
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", 
    likes: 1895, 
    dislikes: 42,
    alt: "Montañas nevadas al amanecer",
    title: "Cumbres nevadas"
},
{ 
    id: 6, 
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", 
    likes: 2750, 
    dislikes: 38,
    alt: "Desierto con dunas al atardecer",
    title: "Dunas del desierto"
}
];

// Estado de la aplicación
let currentImageIndex = 0;
let isDarkMode = true; // Modo oscuro por defecto
let userLikes = {}; // Almacena las interacciones del usuario

// Referencias a elementos del DOM
const galleryContainer = document.getElementById('gallery-container');
const themeSwitch = document.getElementById('theme-switch');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalImageTitle = document.getElementById('modal-image-title');
const closeModalBtn = document.getElementById('close-modal');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentIndexSpan = document.getElementById('current-index');
const totalImagesSpan = document.getElementById('total-images');

// Inicializar la galería
function initGallery() {
    // Generar las tarjetas de imagen
    imagesData.forEach((image, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.dataset.index = index;
        photoCard.dataset.id = image.id;
        
        // Inicializar estado de likes para esta imagen
        userLikes[image.id] = { liked: false, disliked: false };
        
        photoCard.innerHTML = `
            <div class="image-container">
                <img src="${image.url}" alt="${image.alt}" loading="lazy">
            </div>
            <div class="photo-info">
                <div class="likes-container">
                    <button class="like-btn" data-id="${image.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="like-count">${image.likes.toLocaleString()}</span>
                    </button>
                    <button class="dislike-btn" data-id="${image.id}">
                        <i class="fas fa-thumbs-down"></i>
                        <span class="dislike-count">${image.dislikes.toLocaleString()}</span>
                    </button>
                </div>
            </div>
        `;
        
        galleryContainer.appendChild(photoCard);
        
        // Agregar evento de clic para ampliar imagen
        photoCard.addEventListener('click', (e) => {
            if (!e.target.closest('.like-btn') && !e.target.closest('.dislike-btn')) {
                openModal(index);
            }
        });
    });
    
    // Agregar eventos a los botones de like/dislike
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', handleLike);
    });
    
    document.querySelectorAll('.dislike-btn').forEach(btn => {
        btn.addEventListener('click', handleDislike);
    });
    
    // Actualizar contador total de imágenes
    totalImagesSpan.textContent = imagesData.length;
}

// Manejar like
function handleLike(e) {
    e.stopPropagation();
    const imageId = parseInt(e.currentTarget.dataset.id);
    const imageData = imagesData.find(img => img.id === imageId);
    const userLikeState = userLikes[imageId];
    
    // Si ya estaba likeado, quitamos el like
    if (userLikeState.liked) {
        userLikeState.liked = false;
        imageData.likes -= 1;
        e.currentTarget.classList.remove('active');
    } else {
        // Si estaba dislikeado, quitamos el dislike
        if (userLikeState.disliked) {
            userLikeState.disliked = false;
            imageData.dislikes -= 1;
            document.querySelector(`.dislike-btn[data-id="${imageId}"]`).classList.remove('active');
        }
        
        // Añadimos el like
        userLikeState.liked = true;
        imageData.likes += 1;
        e.currentTarget.classList.add('active');
    }
    
    // Actualizar el contador
    e.currentTarget.querySelector('.like-count').textContent = imageData.likes.toLocaleString();
    document.querySelector(`.dislike-btn[data-id="${imageId}"] .dislike-count`).textContent = imageData.dislikes.toLocaleString();
}

// Manejar dislike
function handleDislike(e) {
    e.stopPropagation();
    const imageId = parseInt(e.currentTarget.dataset.id);
    const imageData = imagesData.find(img => img.id === imageId);
    const userLikeState = userLikes[imageId];
    
    // Si ya estaba dislikeado, quitamos el dislike
    if (userLikeState.disliked) {
        userLikeState.disliked = false;
        imageData.dislikes -= 1;
        e.currentTarget.classList.remove('active');
    } else {
        // Si estaba likeado, quitamos el like
        if (userLikeState.liked) {
            userLikeState.liked = false;
            imageData.likes -= 1;
            document.querySelector(`.like-btn[data-id="${imageId}"]`).classList.remove('active');
        }
        
        // Añadimos el dislike
        userLikeState.disliked = true;
        imageData.dislikes += 1;
        e.currentTarget.classList.add('active');
    }
    
    // Actualizar el contador
    e.currentTarget.querySelector('.dislike-count').textContent = imageData.dislikes.toLocaleString();
    document.querySelector(`.like-btn[data-id="${imageId}"] .like-count`).textContent = imageData.likes.toLocaleString();
}

// Abrir modal con imagen ampliada
function openModal(index) {
    currentImageIndex = index;
    updateModalImage();
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Actualizar imagen en el modal
function updateModalImage() {
    const image = imagesData[currentImageIndex];
    modalImage.src = image.url;
    modalImage.alt = image.alt;
    modalImageTitle.textContent = image.title;
    currentIndexSpan.textContent = currentImageIndex + 1;
}

// Navegar a la imagen anterior
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + imagesData.length) % imagesData.length;
    updateModalImage();
}

// Navegar a la siguiente imagen
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % imagesData.length;
    updateModalImage();
}

// Cambiar modo claro/oscuro
function toggleTheme() {
    isDarkMode = !themeSwitch.checked;
    
    if (isDarkMode) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
}

// Navegación con teclado
function handleKeyDown(event) {
    if (!imageModal.classList.contains('active')) return;
    
    switch(event.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
}

// Inicializar eventos
function initEvents() {
    // Cambio de tema
    themeSwitch.addEventListener('change', toggleTheme);
    
    // Configurar modo oscuro por defecto
    themeSwitch.checked = false;
    
    // Cerrar modal
    closeModalBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera de la imagen
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });
    
    // Navegación en el modal
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Navegación con teclado
    document.addEventListener('keydown', handleKeyDown);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar Font Awesome para los iconos de like/dislike
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    
    initGallery();
    initEvents();
});