'use strict';

(function() {

    class DomainStorage {
        constructor() {
            this.domains = [];
            this.storage = window.localStorage;
            this.loadDomains();
        }

        length() {
            return this.getDomains().length;
        }

        getDomains() {
            return JSON.parse(this.storage.getItem('domains')) || [];
        }

        setDomains(domains) {
            this.domains = domains;
            this.storage.setItem('domains', JSON.stringify(domains));
        }

        loadDomains() {
            this.domains = JSON.parse(this.storage.getItem('domains')) || [];
        }

        addDomain(domain) {
            this.domains.push(domain);
            this.setDomains(this.domains);
        }

        removeDomain(domain) {
            this.domains = this.domains.filter((item) => item !== domain);
            this.setDomains(this.domains);
        }
    }

    window.DomainStorage = DomainStorage;

})();