const adultModeSection = document.getElementById('adult-mode');
const kidsModeSection = document.getElementById('kids-mode');
const pageBody = document.body;

const modeToggle = document.getElementById('mode-toggle');
const modeToggleThumb = document.getElementById('mode-toggle-thumb');
const adultLabel = document.getElementById('adult-label');
const kidsLabel = document.getElementById('kids-label');

const navButtons = document.querySelectorAll('nav button');
const hasToggleSwitcher = Boolean(modeToggle);
const adultButton = hasToggleSwitcher ? null : navButtons[0];
const kidsButton = hasToggleSwitcher ? null : navButtons[1];

const applyMode = (mode) => {
    const isKidsMode = mode === 'kids';
    localStorage.setItem('mode', mode);

    if (pageBody) {
        pageBody.classList.toggle('kids-theme', isKidsMode);
        pageBody.classList.toggle('adult-theme', !isKidsMode);
    }

    if (adultModeSection && kidsModeSection) {
        adultModeSection.classList.toggle('hidden', isKidsMode);
        kidsModeSection.classList.toggle('hidden', !isKidsMode);
    }

    if (modeToggle && modeToggleThumb) {
        modeToggle.setAttribute('aria-checked', String(isKidsMode));
        modeToggleThumb.classList.toggle('translate-x-8', isKidsMode);
        modeToggle.style.backgroundColor = isKidsMode ? '#FDBA74' : '#65a30d';
    }

    if (adultLabel && kidsLabel) {
        adultLabel.classList.toggle('opacity-100', !isKidsMode);
        adultLabel.classList.toggle('opacity-60', isKidsMode);
        kidsLabel.classList.toggle('opacity-100', isKidsMode);
        kidsLabel.classList.toggle('opacity-60', !isKidsMode);
    }
};

const savedMode = localStorage.getItem('mode') || 'adult';
applyMode(savedMode);

const recipeCategoryHeadings = Array.from(document.querySelectorAll('h2')).filter((heading) => {
    return heading.textContent && heading.textContent.trim() === 'Recipe Categories';
});

recipeCategoryHeadings.forEach((heading) => {
    const cardGrid = heading.nextElementSibling;
    if (!cardGrid || !cardGrid.classList.contains('grid')) {
        return;
    }

    const cards = cardGrid.querySelectorAll(':scope > div');
    cards.forEach((card) => {
        const imageLink = card.querySelector('a');
        if (imageLink) {
            imageLink.setAttribute('href', 'recipes.html');
        }

        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Open recipe details');

        card.addEventListener('click', (event) => {
            if (event.target && event.target.closest('a[href]')) {
                return;
            }
            window.location.href = 'recipes.html';
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = 'recipes.html';
            }
        });
    });
});

if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        const currentMode = localStorage.getItem('mode') || 'adult';
        const nextMode = currentMode === 'adult' ? 'kids' : 'adult';
        applyMode(nextMode);
    });
}

if (adultButton) {
    adultButton.addEventListener('click', () => {
        applyMode('adult');
    });
}

if (kidsButton) {
    kidsButton.addEventListener('click', () => {
        applyMode('kids');
    });
}