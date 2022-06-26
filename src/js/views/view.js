import icons from 'url:../../img/icons.svg';

// this class will be uses as parent class of other child views
export default class View {
    _data;
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        // console.log('data in recipeview render', data);
        this._data = data;
        // console.log(this._data);
        const markup = this._generateMarkup();

        if (!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    updateView(data) {
        // if (!data || (Array.isArray(data) && data.length === 0))
        //     return this.renderError();
        // console.log('data in recipeview render', data);
        this._data = data;
        const newMarkup = this._generateMarkup();

        // converts the string newMarkup into real  dom object in memory
        const newDOM = document
            .createRange()
            .createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(
            this._parentElement.querySelectorAll('*')
        );
        // console.log(newElements);
        // console.log(curElements);

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // to compare node there is a method available in dom, content in nodes is compared
            // console.log(newEl.isEqualNode(curEl));
            // update changed text
            if (
                !newEl.isEqualNode(curEl) &&
                newEl.firstChild?.nodeValue.trim() !== ''
            ) {
                curEl.textContent = newEl.textContent;
            }
            // update changed attributes
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderError(message = this._errorMessage) {
        const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `<div class="message">
                    <div>
                        <svg>
                            <use href="${icons}#icon-smile"></use>
                        </svg>
                    </div>
                    <p>
                    ${message}
                    </p>
                </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    renderSpinner() {
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}
