import { API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
    },
};

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}`);

        let { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        };

        // console.log(state.recipe);
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        // console.log(data);
        // data.data.recipes is an array of all the recipes for search term
        state.search.result = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            };
        });
        // console.log(state.search.result);
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
};
