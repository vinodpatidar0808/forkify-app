import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = Number(btn.dataset.goto);
            // console.log(goToPage);
            handler(goToPage);
        });
    }

    _generateMarkup() {
        const curPage = this._data.page;
        // console.log(this._data);
        const numPages = Math.ceil(
            this._data.result.length / this._data.resultsPerPage
        );
        // console.log(numPages);

        // page 1, and there are other pages
        if (curPage === 1 && numPages > 1)
            return this._generateNextButton(curPage);

        // last page
        if (curPage === numPages) return this._generatePrevButton(curPage);

        // other intermediate page
        if (curPage < numPages)
            return `${this._generateNextButton(
                curPage
            )} ${this._generatePrevButton(curPage)}`;
        // page 1, and there are no other pages
        return '';
    }
    _generatePrevButton(curPage) {
        return `<button data-goto='${
            curPage - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }
    _generateNextButton(curPage) {
        return `<button data-goto='${
            curPage + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
}

export default new PaginationView();
