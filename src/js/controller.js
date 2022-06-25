//NOTE: api link:--> https://forkify-api.herokuapp.com/v2

import * as model from './model.js';
import recipeView from './views/recipeView.js';

// polyfilling packages
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

///////////////////////////////////////

//---TASK---: Loading recipe
const controlRecipes = async function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    try {
        recipeView.renderSpinner();
        // NOTE: loadRecipe is an async function
        await model.loadRecipe(id);
        // const { recipe } = model.state;
        // console.log('model.state.recipe ', model.state.recipe);
        recipeView.render(model.state.recipe);
    } catch (err) {
        console.error(err);
        recipeView.renderError();
    }
};

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
};

init();
