(function(){

    var searchInputWrap = document.querySelector(".js-autocomplete-wrap");
    var searchInput = document.querySelector(".js-autocomplete-input");
    var storeData;

    var ResultItem = function(country, city, airport, locations, searchInput) {
  		this.country = country;
  		this.city = city;
  		this.airport = airport;
  		this.locations = locations;
  		this.searchInput = searchInput;
  	};

    var autocomplete = {

      resultsContainer : false,
      enterKeyEvent : false,
      activeResults: false,

      addAutocompleteWrap : function() {
        var containerDiv = document.createElement('div');
        containerDiv.classList.add('autocomplete-wrap');
        searchInputWrap.appendChild(containerDiv);
        this.resultsContainer = true;

        if ( !this.enterKeyEvent ){
          document.addEventListener('click' , this.closeSearch);
          this.enterKeyEvent = true;
        };
      },

      collapse : function() {
          if ( this.activeResults ){
            this.hideResults();
            var acWrap = document.querySelector(".autocomplete-wrap");
    				acWrap.classList.add("is-hidden");
          }
      },

      showNoResult : function() {
        var acWrap = document.querySelector(".autocomplete-wrap");
        acWrap.innerHTML = "<div class='nothing-found'>Nothing found</div>";
        this.activeResults = true;
      },

      hideResults : function() {
        var acWrap = document.querySelector(".autocomplete-wrap");
        while (acWrap.firstChild) {
          acWrap.firstChild.remove();
        }
      },

      closeSearch: function(e) {
  			var acWrap = document.querySelector(".autocomplete-wrap");
  			if (e.target != acWrap ) {
          if ( !this.activeResults ) {
            autocomplete.collapse();
          }
  			}
  		},

      searchData : function( obj ) {
        var userInput = searchInput.value,
            inputValue = userInput.toLowerCase();
            console.log(inputValue);
  			    // this.searchCities( obj, inputValue );
      },

      parseResults : function() {
        if ( !this.resultsContainer ) {
  				this.addAutocompleteWrap();
  			} else {
  				var acWrap = document.querySelector(".autocomplete-wrap");
  				acWrap.classList.remove("is-hidden");
  			}

        this.showNoResult();
      },

      init : function() {
        var inputValue = searchInput.value;

        for (var k in storeData) {
  		    if (storeData.hasOwnProperty(k)) {
  		      this.searchData(storeData[k]);
  		    }
        }

        this.parseResults();
      }
    }


    var parseData = function() {
      var inputValue = searchInput.value;

  		if ( inputValue.length >= 3 ) {
  			autocomplete.init();
  		} else {
  			autocomplete.collapse();
  		}
    }

    var loadData = function() {
  	  var ajax = new XMLHttpRequest();
  	  ajax.open("GET", "https://api.myjson.com/bins/3809q", false);
  	  ajax.onreadystatechange = function() {
  	    if (ajax.readyState == 4 && ajax.status == 200) {
  	      var data = JSON.parse(ajax.responseText);
  				// Store object's "country" property with an array of countries objects
  	      storeData = data.countries;
  	    }
  	  };
  	  ajax.send(null);
  	  searchInput.removeEventListener("focus", loadData);
  	};

    searchInput.addEventListener("input" , parseData);
    searchInput.addEventListener("focus" , loadData);

})();
