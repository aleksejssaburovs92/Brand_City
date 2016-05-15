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

      highlightElement : function ( index ) {
          var currentHighlighted;
          var array = document.querySelectorAll(".js-suggested-item");
          if ( document.querySelector(".js-suggested-item_highlighted") !== null ) {
              currentHighlighted = document.querySelector(".js-suggested-item_highlighted");
          } else {
              currentHighlighted = null;
          }

          if ( currentHighlighted === null ) {
              if ( index === -1 ) {
                  array[array.length - 1].classList.add("js-suggested-item_highlighted");
              } else {
                  array[0].classList.add("js-suggested-item_highlighted");
              }
          } else {
              for(var i = 0; i < array.length; i++) {
                  if ( array[i].classList.contains("js-suggested-item_highlighted") ) {
                      array[i].classList.remove("js-suggested-item_highlighted");

                      if ( array[ i + index ] === undefined && i+index < 0 ) {
                          console.log("-");
                          array[array.length - 1].classList.add("js-suggested-item_highlighted");
                          return;
                      } else if ( array[ i + index ] === undefined && i+index > array.length-1 ){
                          console.log("+");
                          array[0].classList.add("js-suggested-item_highlighted");
                          return;
                      } else {
                          console.log("Z");
                          array[i + index].classList.add("js-suggested-item_highlighted");
                          return;
                      }
                  }
              }
          }
      },

      arroNavigation : function(e) {
          var nextItem = null;

          if ( e.keyCode === 38 ) {
              nextItem = -1;
              autocomplete.highlightElement( nextItem );
          } else if ( e.keyCode === 40 ) {
              nextItem = 1;
              autocomplete.highlightElement( nextItem );
          } else if ( e.keyCode === 13 ) {
              searchInput.value = document.querySelector(".js-suggested-item_highlighted").innerText;
              autocomplete.collapse();
              autocomplete.clearData();
              searchInput.addEventListener("focus", autocomplete.parseResults);
              return;
          }
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
              searchInput.addEventListener("focus", autocomplete.parseResults);
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
          var acElements = document.querySelectorAll(".js-suggested-item");
          for ( var z = 0; z < acElements.length; z++ ) {
              acElements[z].addEventListener("click" , function(){
                  searchInput.value = this.innerText;
                  autocomplete.collapse();
                  autocomplete.clearData();
                  searchInput.addEventListener("focus", autocomplete.parseResults);
              });
          }
      },

      searchData : function( obj , value ) {
          var userInput = value,
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
              autocomplete.showResultCity();
              document.addEventListener("keyup" , autocomplete.arroNavigation);
          } else {
              autocomplete.showNoResult();
          }


          if (!autocomplete.enterKeyEvent) {
      				autocomplete.enterKeyEvent = true;
    			}
      },

      init : function( value ) {

          this.clearData();
          var inputValue;
          if ( value === undefined ) {
              inputValue = searchInput.value;
          } else {
              inputValue = value;
          }

          for (var k in storeData) {
      		    if (storeData.hasOwnProperty(k)) {
      		        this.searchData(storeData[k] , inputValue );
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
