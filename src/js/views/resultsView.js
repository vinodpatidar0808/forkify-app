import previewView from './previewView';
import View from './view';
class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query, please try again!';
    _message = '';

    _generateMarkup() {
        // console.log(result);
        return this._data
            .map(result => previewView.render(result, false))
            .join('');
    }
}

export default new ResultsView();