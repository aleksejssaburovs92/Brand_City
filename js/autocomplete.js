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

      citiesFound : [],
      resultsContainer : false,
      enterKeyEvent : false,
      activeResults : false,
      itemClass : "js-suggested-item",
      itemCityClass : "js-suggested-city",

      //sets dropdown
      clearData : function() {
          this.citiesFound.length = 0;
      },

      /**
       * create autocomplete-wrap
       * inside autocomplete-wrap create autocomplete-inner-wrap
       * set param autocomplete.resultsContainer = true;
       */
      addAutocompleteWrap : function() {
          var containerDiv = document.createElement('div');
          var innerWrap = document.createElement('div');
          innerWrap.classList.add('autocomplete-inner-wrap');
          containerDiv.classList.add('autocomplete-wrap');
          searchInputWrap.appendChild(containerDiv);
          containerDiv.appendChild(innerWrap);
          autocomplete.resultsContainer = true;
      },

      //hides dropdown
      collapse : function() {
          if ( autocomplete.activeResults ){
              var acWrap = document.querySelector(".autocomplete-wrap");
              if  ( acWrap !== null ) {
                  acWrap.remove();
              }
          }
      },

      /**
       * add to wrap div with innerHTML = Nothing found
       * set param autocomplete.activeResults true
       */
      showNoResult : function() {
          var acWrap = document.querySelector(".autocomplete-inner-wrap");
          acWrap.innerHTML = "<div class='nothing-found'>Nothing found</div>";
          autocomplete.activeResults = true;
      },

      /**
       * if click is inside "js-autocomplete-wrap" container
       * if false, removes dropdown, removes click event from DOM, ads event on
       * searchInput, also clears citiesFound
       *
       * @param click event e
       *
       */
      closeSearch: function(e) {
    			if ( !autocomplete.isInsideContainer( e.target ) ) {
              autocomplete.collapse();
              document.removeEventListener("click", autocomplete.closeSearch);
              autocomplete.enterKeyEvent = false;
              autocomplete.clearData();
              searchInput.addEventListener("click", autocomplete.parseResults);
    			}
  		},


      /**
       * Check if element is inside autocomplete container/wrapper or is container itself
       *
       * @param {HTMLElement} element
       * @returns {boolean} - true if element is inside container or is container itself or false
       */
      isInsideContainer : function(element) {

          if ( element === null ) {
              return;
          }

          if (element.classList.contains("js-autocomplete-wrap")) {
              return true;
          } else if ( element === document.querySelector("html") ) {
              return false;
          } else {
              return this.isInsideContainer(element.parentNode);
          }
      },

      selectValule : function() {
          var x = document.querySelectorAll(".js-suggested-item");
          for ( var z = 0; z < x.length; z++ ) {
              x[z].addEventListener("click" , function(){
                  searchInput.value = this.innerHTML;
                  autocomplete.collapse();
              });
          }
      },

      searchData : function( obj ) {
          var userInput = searchInput.value,
              inputValue = userInput.toLowerCase();
    			    this.searchCities( obj, inputValue );
      },

      searchCities : function( obj , input ) {
          for ( city in obj.cities ) {
              if (obj.cities.hasOwnProperty(city)) {
                  var dataValue = city.toLowerCase();
                  var compareValues = dataValue.indexOf( input );
                  if ( compareValues > -1 ) {
                      var item = new ResultItem(obj.countryName, city, obj.cities[city].airport, obj.cities[city].locations, input);
                      this.citiesFound.push(item);
                  }
              }
          }
      },

      showResultCity : function(){
          autocomplete.activeResults = true;
          var acWrap = document.querySelector(".autocomplete-inner-wrap");
          acWrap.innerHTML = "";
          for (var x = 0; x < this.citiesFound.length; x++) {
              var matched = this.citiesFound[x].city.slice( this.citiesFound[x].city.toLowerCase().indexOf(this.citiesFound[x].searchInput) , this.citiesFound[x].city.toLowerCase().indexOf(this.citiesFound[x].searchInput) + this.citiesFound[x].searchInput.length );
              var matchedBold = "<b>" + matched + "</b>";
              var highlightedValue = this.citiesFound[x].city.replace( matched , matchedBold );
              acWrap.innerHTML += "<div class='" + this.itemClass + " " + this.itemCityClass + "'>" + highlightedValue + ", " + this.citiesFound[x].country + "</div>";
              acWrap.innerHTML += "<div class='" + this.itemClass + " plane'>" + this.citiesFound[x].airport.name + "</div>";
              for (var i = 0; i < this.citiesFound[x].locations.length; i++) {
                  acWrap.innerHTML += "<div class='" + this.itemClass + "'>" + this.citiesFound[x].locations[i] + "</div>";
              }
          }

          autocomplete.selectValule();
      },

      parseResults : function(e) {
          //remove old wrap
          autocomplete.collapse();

          //create new wrap
			    autocomplete.addAutocompleteWrap();

          if ( autocomplete.citiesFound.length ) {
            console.log(autocomplete.citiesFound.length + " :citiesfound");
              autocomplete.showResultCity();
          } else {
              autocomplete.showNoResult();
          }


          if (!autocomplete.enterKeyEvent) {
              document.addEventListener("click", autocomplete.closeSearch);
      				autocomplete.enterKeyEvent = true;
    			}
      },

      init : function() {
          var inputValue = searchInput.value;
          console.log(this.citiesFound);
          this.clearData();

          for (var k in storeData) {
      		    if (storeData.hasOwnProperty(k)) {
      		        this.searchData(storeData[k]);
      		    }
          }

          this.parseResults();
      }
    }

    /**
     * init autocomplete if length of input is more than 0
     *
     */
    var parseData = function() {
      var inputValue = searchInput.value;

  		if ( inputValue.length >= 1 ) {
  			   autocomplete.init();
  		} else {
  			   autocomplete.collapse();
  		}
    }


    /**
     * Loads data from api https://api.myjson.com/bins/3809q
     *
     */
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
  	};
    loadData();
    searchInput.addEventListener("input" , parseData);

})();
