async function fetchRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        const meal = data.meals[0];
        displayRandomMeal(meal);
    } catch (error) {
        console.error('Error fetching random meal:', error);
    }
}

function displayRandomMeal(meal) {
    const randomMealSection = document.getElementById('randomMeal');
    randomMealSection.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strMeal}</p>
    `;
    randomMealSection.addEventListener('click', () => {
        displayIngredients(meal);
        addRecentlySearchedMeal(meal);
    });
}

function displayIngredients(meal) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>${meal.strMeal}</h2>
            <h3>Ingredients:</h3>
            <ul>
                ${getIngredientsList(meal).join('')}
            </ul>
        </div>
    `;
}

function getIngredientsList(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(`<li>${measure} ${ingredient}</li>`);
        }
    }
    return ingredients;
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

async function fetchMealsByCategory(category) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        const meals = data.meals;
        displaySearchedMeals(meals);
    } catch (error) {
        console.error('Error fetching meals by category:', error);
    }
}

function displaySearchedMeals(meals) {
    const searchedMealsSection = document.getElementById('searchedMeals');
    searchedMealsSection.innerHTML = meals.map(meal => `
        <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="displayMealDetails('${meal.idMeal}')">
            <p>${meal.strMeal}</p>
        </div>
    `).join('');
}

async function displayMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];
        displayIngredients(meal);
        addRecentlySearchedMeal(meal);
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
}

document.getElementById('searchButton').addEventListener('click', () => {
    const searchQuery = document.getElementById('searchInput').value;
    if (searchQuery) {
        fetchMealsByCategory(searchQuery);
    } else {
        document.getElementById('searchedMeals').innerHTML = '';
    }
});

function addRecentlySearchedMeal(meal) {
    const recentlySearchedMeals = getRecentlySearchedMeals();
    recentlySearchedMeals.unshift(meal);
    if (recentlySearchedMeals.length > 20) {
        recentlySearchedMeals.pop();
    }
    saveRecentlySearchedMeals(recentlySearchedMeals);
    displayRecentlySearchedMeals(recentlySearchedMeals);
}

function getRecentlySearchedMeals() {
    return JSON.parse(localStorage.getItem('recentlySearchedMeals')) || [];
}

function saveRecentlySearchedMeals(meals) {
    localStorage.setItem('recentlySearchedMeals', JSON.stringify(meals));
}

function displayRecentlySearchedMeals(meals) {
    const recentlySection = document.getElementById('recently');
    recentlySection.innerHTML = meals.map(meal => `
        <div class="recently-item">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strMeal}</p>
        </div>
    `).join('');
}

window.addEventListener('load', () => {
    const recentlySearchedMeals = getRecentlySearchedMeals();
    displayRecentlySearchedMeals(recentlySearchedMeals);
});

document.getElementById('Button').addEventListener('click', () => {
    window.location.href = 'dish.html';
});
document.getElementById('about').addEventListener('click', () => {
    window.location.href = 'about.html';
});

document.getElementById('searchButton').addEventListener('click', function() {
    document.getElementById('h2').style.display = 'block';
    document.getElementById('searchedMeals').scrollIntoView({ behavior: 'smooth' });
  });

fetchRandomMeal();
