document.addEventListener('DOMContentLoaded', () => {

    const images = Array.from(document.querySelectorAll('.gallery-img'));
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('closeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const themeSwitch = document.getElementById('themeSwitch');

    let currentIndex = 0;

    function openModal(index) {
        currentIndex = index;
        modalImg.src = images[currentIndex].src;
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex].src;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex].src;
    }

    images.forEach((img, i) => {
        img.addEventListener('click', () => openModal(i));
    });

    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark', themeSwitch.checked);
    });

});
