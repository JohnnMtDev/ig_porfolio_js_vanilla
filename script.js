// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

    // Referencias DOM
    const images = Array.from(document.querySelectorAll('.gallery-img'));
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('closeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const themeSwitch = document.getElementById('themeSwitch');

    if (!images.length) return; // nada que mostrar

    // Estado
    let currentIndex = 0;
    let isOpen = false;

    // Añadir listener a cada imagen
    images.forEach((img, idx) => {
        img.dataset.index = idx;
        img.addEventListener('click', (e) => {
            currentIndex = Number(img.dataset.index);
            openModal();
        });
    });

    // Abre modal y muestra la imagen actual
    function openModal() {
        isOpen = true;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        showImage(currentIndex);
        // bloquear scroll del body mientras esté abierto
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    function closeModal() {
        isOpen = false;
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        // limpiar src para que deje de cargar si es necesario
        modalImg.classList.remove('visible');
        setTimeout(() => {
            modalImg.src = '';
        }, 250);
        // restaurar scroll
        document.body.style.overflow = '';
    }

    // Mostrar imagen en el modal con animación
    function showImage(index) {
        const src = images[index].getAttribute('src');
        // arrancar animación: quitar visible, cambiar src, luego añadir visible
        modalImg.classList.remove('visible');
        // forzar reflow antes de cambiar src para asegurar transición en navegadores
        void modalImg.offsetWidth;
        modalImg.src = src;
        // después de cargar imagen, añadir la clase visible (también controlado por onload)
        if (modalImg.complete) {
            // ya cargada en caché
            modalImg.classList.add('visible');
        } else {
            modalImg.onload = () => {
                modalImg.classList.add('visible');
                // limpiar handler
                modalImg.onload = null;
            };
        }
    }

    // Navegar al anterior
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    // Navegar al siguiente
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    // Eventos de los botones
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Cerrar al hacer clic fuera del contenedor de la imagen
    modal.addEventListener('click', (e) => {
        // si el clic es en el propio modal (fondo), cerrar
        if (e.target === modal) closeModal();
    });

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
        if (!isOpen) return;
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'Escape') {
            closeModal();
        }
    });

    // SWITCH DARK MODE
    function updateThemeButton() {
        themeSwitch.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
    }

    // Restaurar preferencia si quieres (no obligatoria)
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // if (prefersDark) document.body.classList.add('dark');

    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        updateThemeButton();
    });

    // Inicializa texto del botón
    updateThemeButton();

});
