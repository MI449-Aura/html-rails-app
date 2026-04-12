const adultMode = document.getElementById('adult-mode');
const kidsMode = document.getElementById('kids-mode');
const buttons = document.querySelectorAll('nav button');

buttons[0].addEventListener('click', () => {
    adultMode.classList.remove('hidden');
    kidsMode.classList.add('hidden');
});
buttons[1].addEventListener('click', () => {
    kidsMode.classList.remove('hidden');
    adultMode.classList.add('hidden');
});