NodeList.prototype.forEach = Array.prototype.forEach;

var Autocomplete = {

    _defaultOptions: {
        apiUrl: 'https://restcountries.eu/rest/v1/name/{search}'
    },

    attachInputEventListener: function(autocomplete) {
        var timer = null;

        autocomplete.addEventListener('input', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                var ajax = new XMLHttpRequest();
                var ajax_url = this._defaultOptions.apiUrl;
                ajax_url = ajax_url.replace('{search}', encodeURIComponent(autocomplete.value));

                ajax.open('GET', ajax_url);

                ajax.onload = function() {
                    if (ajax.status === 200) {
                        var countries = JSON.parse(ajax.responseText);
                        var result_countries = {};
                        countries.forEach(function(country) {
                            result_countries[country.alpha2Code] = country.name;
                        });
                        var dropdown = this.createDropdown(result_countries);
                        this.showDropdown(autocomplete, dropdown);
                    } else {
                        console.error('Autocomplete ajax error');
                    }
                }.bind(Autocomplete);

                ajax.send();

            }.bind(Autocomplete), 300)
        });
    },

    createDropdown: function(items_list) {
        var dropdown = Dropdown.createContainer();
        var item = null;
        for (var item_key in items_list) {
            item = Dropdown.createItem(items_list[item_key], item_key);
            dropdown.appendChild(item);
        }
        return dropdown;
    },

    showDropdown: function(autocomplete, dropdown) {
        this.removeDropdown(autocomplete);
        autocomplete.parentNode.appendChild(dropdown);
    },

    getDropdown: function(autocomplete) {
        return autocomplete.parentNode.getElementsByClassName(Dropdown._defaultOptions.styles.containerClass)[0];
    },

    dropdownExists: function(autocomplete) {
        var el = this.getDropdown(autocomplete)
        if (el === undefined) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Removes dropdown from DOM if dropdown exists
     * @param autocomplete - autocomplete input HTML element
     */
    removeDropdown: function(autocomplete) {
        var dropdown = this.getDropdown(autocomplete);
        if (dropdown !== undefined) {
            autocomplete.parentNode.removeChild(dropdown);
        }
    }

};

var Dropdown = {

    _defaultOptions: {
        styles: {
            containerClass: 'dropdown',
            itemClass: 'dropdown-item',
        },
        markup: {
            containerTagName: 'div',
            itemTagName: 'div',
            itemValueAttributeName: 'data-value',
        }
    },

    createContainer: function() {
        var el = document.createElement(this._defaultOptions.markup.containerTagName);
        el.classList.add(this._defaultOptions.styles.containerClass);
        return el;
    },

    createItem: function(content, id) {
        if (id === undefined) {
            id = null;
        }
        var el = document.createElement(this._defaultOptions.markup.itemTagName);
        el.classList.add(this._defaultOptions.styles.itemClass);
        if (id !== null) {
            el.setAttribute(this._defaultOptions.markup.itemValueAttributeName, id);
        }

        el.textContent = content;
        return el;
    },



};

document.querySelectorAll('[data-role="autocomplete"]').forEach(function(ac) {

    Autocomplete.attachInputEventListener(ac);

});
