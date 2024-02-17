'use strict';

(function() {

    class Pagination {
        constructor(domains = [], elements = {}) {
            this.domains = domains;
            this.currentPage = 1;
            this.totalPages = 1;
            this.elements = elements;
            this.elements.next.addEventListener('click', () => this.next());
            this.elements.prev.addEventListener('click', () => this.prev());
            this.pageDomains = [];
            this.target = this.elements.domainList;
            this.originalDomains = domains;
            this.paginate();
        }

        search(query) {
            this.currentPage = 1;
            this.domains = this.domains.filter(domain => domain.includes(query.toLowerCase()));
            this.paginate();
        }

        reset() {
            this.currentPage = 1;
            this.domains = this.originalDomains;
            this.paginate();
        }

        paginate() {
            this.totalPages = Math.ceil(this.domains.length / 10);
            this.update();
        }

        next() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.update();
            }
        }

        prev() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.update();
            }
        }

        onPaginate() {
            if(this.currentPage === 1) {
                this.elements.prev.setAttribute('disabled', true);
            } else {
                this.elements.prev.removeAttribute('disabled');
            }
            if(this.currentPage === this.totalPages) {
                this.elements.next.setAttribute('disabled', true);
            } else {
                this.elements.next.removeAttribute('disabled');
            }
        }

        insertDomains() {
            const fragment = document.createDocumentFragment();
            this.pageDomains.forEach(domain => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${domain}</span><button class="app-favorite-btn" data-domain="${domain}">Add</button>`
                fragment.appendChild(li);
            });
            this.target.innerHTML = '';
            this.target.appendChild(fragment);
        }

        update() {
            const start = (this.currentPage - 1) * 10;
            const end = start + 10;
            this.pageDomains = this.domains.slice(start, end);
            this.insertDomains();
            this.onPaginate();
        }
    }

    window.Pagination = Pagination;

})();