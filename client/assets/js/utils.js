'use strict';

(function() {
    const weekAgo = () =>{
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString().split('T')[0];
    };

    const currentDate = () =>{
        return new Date().toISOString().split('T')[0];
    };

    const parseDateStr = (date = '', when = 'morning' ) => {
        const suffix = when === 'morning' ? '09' : '16';
        return date.replace(/-/g, '') + suffix;
    };

    const on = (selector, event, callback) => {
        document.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                callback(e);
            }
        }, false);
    }

    window.utils = {
        weekAgo,
        currentDate,
        parseDateStr,
        on
    };
})();

