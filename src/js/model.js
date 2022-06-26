import { API_KEY, API_URL, RES_PER_PAGE } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
};

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

        state.recipe = createRecipeObject(data);
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        // console.log(state.recipe);
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        // console.log(data);
        // data.data.recipes is an array of all the recipes for search term
        state.search.result = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            };
        });
        state.search.page = 1;
        // console.log(state.search.result);
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
};

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        // newqty = oldqty * servings /oldservings
        return (ing.quantity =
            (ing.quantity * newServings) / state.recipe.servings);
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    // push recipe to bookmark

    state.bookmarks.push(recipe);
    // mark recipe as book mark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // mark current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};

init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
};
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(
                entry => entry[0].startsWith('ingredient') && entry[1] !== ''
            )
            .map(ing => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3)
                    throw new Error(
                        'Wrong ingredient format! Please use the correct format:)'
                    );

                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                };
            });
        // console.log(ingredients);

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        console.log(recipe);
        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (error) {
        throw error;
    }
};
