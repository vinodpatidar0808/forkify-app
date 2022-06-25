//NOTE: api link:--> https://forkify-api.herokuapp.com/v2

import * as model from './model.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
// polyfilling packages
import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

// not real js , this is from parcel
/* 
if (module.hot) {
    module.hot.accept();
}
 */

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

const controlSearchResults = async function () {
    try {
        resultsView.renderSpinner();

        // 1) get search query from searchView
        const query = searchView.getQuery();
        if (!query) return;

        // 2) load search results
        await model.loadSearchResults(query);

        // 3) render results in UI
        // resultsView.render(model.state.search.result);
        resultsView.render(model.getSearchResultsPage());

        // 4) render inital pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.error(err);
    }
};

const controlPagination = function (goToPage) {
    resultsView.render(model.getSearchResultsPage(goToPage));

    paginationView.render(model.state.search);
};

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};

init();
