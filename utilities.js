const adultMode = document.getElementById('adult-mode');
const kidsMode = document.getElementById('kids-mode');
const buttons = document.querySelectorAll('nav button');

const savedMode = localStorage.getItem('mode') || 'adult';
if (savedMode === 'kids') {
    adultMode.classList.add('hidden');
    kidsMode.classList.remove('hidden');
} else {
    kidsMode.classList.add('hidden');
    adultMode.classList.remove('hidden');
}

buttons[0].addEventListener('click', () => {
    localStorage.setItem('mode', 'adult');
    adultMode.classList.remove('hidden');
    kidsMode.classList.add('hidden');
});
buttons[1].addEventListener('click', () => {
    localStorage.setItem('mode', 'kids');
    kidsMode.classList.remove('hidden');
    adultMode.classList.add('hidden');
});