async function fetchAndDisplayMealsForCategories() {
    const categories = [
        "Beef",
        "Chicken",
        "Dessert",
        "Lamb",
        "Miscellaneous",
        "Pasta",
        "Pork",
        "Seafood",
        "Side",
        "Starter",
        "Vegan",
        "Vegetarian",
        "Breakfast",
        "Goat"
    ];

    for (const category of categories) {
        await fetchMealsByCategory(category);
    }
}

async function fetchMealsByCategory(category) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        const meals = data.meals;
        displaySearchedMeals(meals, category);
    } catch (error) {
        console.error('Error fetching meals by category:', error);
    }
}

function displaySearchedMeals(meals, category) {
    const categorySection = document.getElementById(`${category.toLowerCase()}Category`);
    const mealContainer = document.createElement('div');
    mealContainer.classList.add('meals-container');

    for (let i = 0; i < 8 && i < meals.length; i++) {
        const meal = meals[i];
        const mealElement = document.createElement('div');
        mealElement.classList.add('meal');
        mealElement.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" onclick="displayMealDetails('${meal.idMeal}')">
            <p>${meal.strMeal}</p>
        `;
        mealContainer.appendChild(mealElement);
    }

    categorySection.appendChild(mealContainer);
}

window.addEventListener('load', () => {
    fetchAndDisplayMealsForCategories();
});
