'use strict';

(function() {

    const favoritesElements = {
        toggle: document.querySelector('.app-favorites-toggle'),
        count: document.querySelector('.app-favorites-count'),
        sidebar: document.querySelector('.app-favorites'),
        sidebarClose: document.querySelector('.app-favorites-close'),
        list: document.querySelector('.app-favorites-list')
    };

    const domainElements = {
        form: document.querySelector('.app-form'),
        dateInput: document.querySelector('#date')
    };

    const searchElements = {
        form: document.querySelector('.app-search-form'),
        input: document.querySelector('#search'),
        reset: document.querySelector('#reset-search')
    };

    const mainElements = {
        pagination: document.querySelector('.app-pagination'),
        domainList: document.querySelector('.app-domains'),
        paginationNext: document.querySelector('.app-pagination-next'),
        paginationPrev: document.querySelector('.app-pagination-prev')
    };

    const loader = document.querySelector('.app-loader');
    const Storage = new DomainStorage();

    function insertFavorites() {
        if(Storage.length() === 0) {
            return favoritesElements.list.innerHTML = '<li>No favorites yet</li>';
        }
        const domains = Storage.getDomains();
        const list = favoritesElements.list;
        list.innerHTML = '';
        domains.forEach(domain => {
            const item = document.createElement('li');
            item.innerHTML = `
                <span>${domain}</span>
                <button class="app-favorites-remove" data-domain="${domain}">&times;</button>
            `;
            list.appendChild(item);
        });
    }

    function insertDomains(domains) {
        hideElement(mainElements.pagination);
        const pagination = new Pagination(domains, {
            next: mainElements.paginationNext,
            prev: mainElements.paginationPrev,
            domainList: mainElements.domainList
        });
        toggleElement(mainElements.pagination);
        handleSearchForm(pagination.search.bind(pagination), pagination.reset.bind(pagination));
    }

    async function fetchDomains() {
        const date = domainElements.dateInput.value;
        const morning = utils.parseDateStr(date, 'morning');
        const afternoon = utils.parseDateStr(date, 'afternoon');
        toggleElement(loader);
        const domainsData = await Promise.all([api.getDropTimeDomains(morning), api.getDropTimeDomains(afternoon)]);
        const domains = domainsData.flat();
        toggleElement(loader);
        if(domains.length > 0) {
            toggleElement(searchElements.form);
            return insertDomains(domains);
        }
        return false;
    }

    function toggleElement(element) {
        element.classList.toggle('hidden');
    }

    function hideElement(element) {
        element.classList.add('hidden');
    }

    function setMinMaxDates() {
        const minDate = utils.weekAgo();
        const maxDate = utils.currentDate();
        domainElements.dateInput.setAttribute('min', minDate);
        domainElements.dateInput.setAttribute('max', maxDate);
    }

    function handleDomainForm() {
        setMinMaxDates();
        domainElements.form.addEventListener('submit', (event) => {
            event.preventDefault();
            (async () => {
                await fetchDomains();
            })();
        });
    }

    function handleSearchForm(searchFn = () => {}, resetFn = () => {}) {
        searchElements.form.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = searchElements.input.value;
            searchFn(query);
        });
        searchElements.reset.addEventListener('click', () => {
            searchElements.input.value = '';
            resetFn();
        });
    }

    function handleEventListeners() {
        favoritesElements.toggle.addEventListener('click', () => {
            favoritesElements.sidebar.classList.add('show');
        });
        favoritesElements.sidebarClose.addEventListener('click', () => {
           favoritesElements.sidebar.classList.remove('show');
        });

        utils.on('.app-favorite-btn', 'click', (event) => {
            const domain = event.target.dataset.domain;
            Storage.addDomain(domain);
            handleFavoritesToggle();
            insertFavorites();
        }, false);

        utils.on('.app-favorites-remove', 'click', (event) => {
            const domain = event.target.dataset.domain;
            Storage.removeDomain(domain);
            handleFavoritesToggle();
            insertFavorites();
        });
    }

    function handleFavoritesToggle() {
        if(Storage.length() > 0) {
            favoritesElements.toggle.classList.remove('hidden');
            favoritesElements.count.textContent = Storage.length();
        } else {
            favoritesElements.toggle.classList.add('hidden');
        }
    }

    function init() {
        handleFavoritesToggle();
        insertFavorites();
        handleEventListeners();
        handleDomainForm();
    }

    document.addEventListener('DOMContentLoaded', init, false);

})();