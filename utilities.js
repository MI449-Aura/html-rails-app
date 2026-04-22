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


const RECIPES_JSON_URL = 'https://raw.githubusercontent.com/MI449-Aura/final-project-recipe-api/refs/heads/main/recpies.json';
const DISORDERS_JSON_URL = 'https://raw.githubusercontent.com/MI449-Aura/final-project-recipe-api/refs/heads/main/eating-disorders.json';

function buildRecipeCard(recipe) {
    const link = `recipe.html?id=${recipe.id}`;
    const imageSrc = recipe.image || '.jpg';
    return `
        <div class="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
            <a href="${link}"><img src="${imageSrc}" alt="${recipe.name}" class="h-40 w-full object-cover"></a>
            <a href="${link}"><h2 class="py-3 text-center">${recipe.name}</h2></a>
        </div>`;
}

function buildDisorderCard(disorder) {
    const link = `disorder.html?id=${disorder.id}`;
    const imageSrc = disorder.image || '.jpg';
    return `
        <div class="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
            <a href="${link}"><img src="${imageSrc}" alt="${disorder.name}" class="h-40 w-full object-cover"></a>
            <a href="${link}"><h2 class="py-3 text-center">${disorder.short_name}</h2></a>
        </div>`;
}

async function loadRecipes() {
    const grids = document.querySelectorAll('[id$="recipe-grid"]');
    if (!grids.length) return;
    try {
        const res = await fetch(RECIPES_JSON_URL);
        const data = await res.json();
        const cards = data.recipes.map(buildRecipeCard).join('');
        grids.forEach(grid => grid.innerHTML = cards);
    } catch (e) {
        console.error('Could not load recipes.json:', e);
    }
}

async function loadDisorders() {
    const grids = document.querySelectorAll('[id$="disorder-grid"]');
    if (!grids.length) return;
    try {
        const res = await fetch(DISORDERS_JSON_URL);
        const data = await res.json();
        const cards = data.eating_disorders.map(buildDisorderCard).join('');
        grids.forEach(grid => grid.innerHTML = cards);
    } catch (e) {
        console.error('Could not load eating_disorders.json:', e);
    }
}

async function loadRecipeDetail() {
    const container = document.getElementById('recipe-content');
    if (!container) return;
    const recipeId = parseInt(new URLSearchParams(window.location.search).get('id'));
    try {
        const res = await fetch(RECIPES_JSON_URL);
        const data = await res.json();
        const recipe = data.recipes.find(r => r.id === recipeId);
        if (!recipe) { container.innerHTML = '<p class="text-center">Recipe not found.</p>'; return; }
        document.title = recipe.name;
        const imageSrc = recipe.image || '.jpg';
        const ingredientItems = recipe.ingredients.map(i => `<li class="flex items-center gap-3 border-b border-[#283618]/20 py-3 text-sm"><span class="recipe-dot h-2 w-2 flex-shrink-0 rounded-full bg-[#283618]"></span>${i}</li>`).join('');
        const stepItems = recipe.steps.map((s, idx) => `<div class="flex items-start gap-5"><div class="recipe-step-number w-8 flex-shrink-0 text-2xl font-bold text-[#283618]">${idx + 1}</div><p class="text-sm leading-relaxed">${s}</p></div>`).join('');
        container.innerHTML = `
            <h1 class="mb-8 text-center text-3xl">${recipe.name}</h1>
            <div class="mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-[#e9e3be] shadow-md">
                <img src="${imageSrc}" alt="${recipe.name}" class="h-full w-full object-cover">
            </div>
            <p class="content-box mb-6 leading-relaxed">${recipe.notes}</p>
            <div class="content-box recipe-meta mb-12 text-sm leading-relaxed text-[#283618]/80">
                <p><strong>Eating disorder support:</strong> ${recipe.eating_disorder}</p>
                <p><strong>Calories:</strong> ${recipe.calories} &nbsp;|&nbsp; <strong>Texture:</strong> ${Array.isArray(recipe.texture) ? recipe.texture.join(', ') : recipe.texture}</p>
                <p><strong>Tags:</strong> ${recipe.tags.join(', ')}</p>
                ${recipe.source ? `<p class="mt-2"><a href="${recipe.source}" target="_blank" class="underline decoration-2 underline-offset-2 hover:opacity-80">View original source</a></p>` : ''}
            </div>
            <section class="mb-12">
                <h2 class="mb-2 text-center text-2xl">Ingredients</h2>
                <div class="mx-auto mb-6 h-0.5 w-10 rounded bg-[#283618]"></div>
                <div class="content-box"><ul class="grid grid-cols-2 gap-x-6">${ingredientItems}</ul></div>
            </section>
            <section>
                <h2 class="mb-2 text-center text-2xl">Preparation Instructions</h2>
                <div class="mx-auto mb-6 h-0.5 w-10 rounded bg-[#283618]"></div>
                <div class="content-box"><div class="flex flex-col gap-6">${stepItems}</div></div>
            </section>`;
    } catch (e) {
        container.innerHTML = '<p class="text-center">Could not load recipe.</p>';
        console.error(e);
    }
}

async function loadDisorderDetail() {
    const container = document.getElementById('disorder-content');
    if (!container) return;
    const disorderId = new URLSearchParams(window.location.search).get('id');
    const buildList = items => items.map(i => `<li class="flex items-start gap-3 border-b border-[#283618]/20 py-3 text-sm"><span class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#283618]"></span>${i}</li>`).join('');
    try {
        const res = await fetch(DISORDERS_JSON_URL);
        const data = await res.json();
        const disorder = data.eating_disorders.find(d => d.id === disorderId);
        if (!disorder) { container.innerHTML = '<p class="text-center">Disorder not found.</p>'; return; }
        document.title = disorder.name;
        container.innerHTML = `
            <h1 class="mb-4 text-center text-3xl">${disorder.name}</h1>
            <p class="content-box mb-8 leading-relaxed">${disorder.description}</p>
            <section class="mb-8">
                <h2 class="mb-2 text-center text-2xl">Common Challenges</h2>
                <div class="mx-auto mb-4 h-0.5 w-10 rounded bg-[#283618]"></div>
                <div class="content-box"><ul>${buildList(disorder.common_challenges)}</ul></div>
            </section>
            <section class="mb-8">
                <h2 class="mb-2 text-center text-2xl">Symptoms</h2>
                <div class="mx-auto mb-4 h-0.5 w-10 rounded bg-[#283618]"></div>
                <div class="content-box"><ul>${buildList(disorder.symptoms)}</ul></div>
            </section>
            <section class="mb-8">
                <h2 class="mb-2 text-center text-2xl">Helpful Food Characteristics</h2>
                <div class="mx-auto mb-4 h-0.5 w-10 rounded bg-[#283618]"></div>
                <div class="content-box"><ul>${buildList(disorder.helpful_food_characteristics)}</ul></div>
            </section>
            <section class="mb-8">
                <h2 class="mb-2 text-center text-2xl">Meal Tips</h2>
                <div class="mx-auto mb-4 h-0.5 w-10 rounded bg-[#283618]"></div>
                <div class="content-box"><ul>${buildList(disorder.meal_tips)}</ul></div>
            </section>
            <div class="content-box mb-8 text-sm leading-relaxed text-[#283618]/80">
                <p><strong>Note:</strong> ${disorder.notes}</p>
                ${disorder.resources ? `<p class="mt-3"><a href="${disorder.resources}" target="_blank" class="underline decoration-2 underline-offset-2 hover:opacity-80">Learn more at nationaleatingdisorders.org</a></p>` : ''}
            </div>`;
    } catch (e) {
        container.innerHTML = '<p class="text-center">Could not load disorder info.</p>';
        console.error(e);
    }
}

loadRecipes();
loadDisorders();
loadRecipeDetail();
loadDisorderDetail();