'use strict';

(function() {

    const API_URL = 'http://localhost:4000/api';
    const getDropTimeDomains = async date => {
        try {
            const response = await fetch(`${API_URL}/droptime/${date}`);
            const data = await response.json();
            return data.domains;
        } catch (error) {
            return [];
        }
    };

    window.api = {
        getDropTimeDomains
    };

})();