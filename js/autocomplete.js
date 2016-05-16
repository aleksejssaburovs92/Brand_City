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
      itemClass : "js-suggested-item",
      itemHoverClass : "js-suggested-item_highlighted",
      itemCityClass : "js-suggested-city",
      autocompleteWrap : "autocomplete-wrap",
      autocompleteInnerWrap : "autocomplete-inner-wrap",

      //sets dropdown
      clearData : function() {
          this.citiesFound.length = 0;
      },

      /**
       * create autocomplete-wrap
       * inside autocomplete-wrap create autocomplete-inner-wrap
       */
      addAutocompleteWrap : function() {
          var containerDiv = document.createElement('div');
          var innerWrap = document.createElement('div');
          innerWrap.classList.add(autocomplete.autocompleteInnerWrap);
          containerDiv.classList.add(autocomplete.autocompleteWrap);
          searchInputWrap.appendChild(containerDiv);
          containerDiv.appendChild(innerWrap);
      },

      highlightElement : function ( index ) {
          var currentHighlighted;
          var array = document.getElementsByClassName(autocomplete.itemClass);
          if ( document.getElementsByClassName(autocomplete.itemHoverClass)[0] !== undefined ) {
              currentHighlighted = document.getElementsByClassName(autocomplete.itemHoverClass)[0];
          } else {
              currentHighlighted = null;
          }


          if ( currentHighlighted === null ) {
              if ( index === -1 ) {
                  array[array.length - 1].classList.add(autocomplete.itemHoverClass);
              } else {
                  array[0].classList.add(autocomplete.itemHoverClass);
              }
          } else {
              for(var i = 0; i < array.length; i++) {
                  if ( array[i].classList.contains(autocomplete.itemHoverClass) ) {
                      array[i].classList.remove(autocomplete.itemHoverClass);

                      if ( array[ i + index ] === undefined && i+index < 0 ) {
                          array[array.length - 1].classList.add(autocomplete.itemHoverClass);
                          return;
                      } else if ( array[ i + index ] === undefined && i+index > array.length-1 ){
                          array[0].classList.add(autocomplete.itemHoverClass);
                          return;
                      } else {
                          array[i + index].classList.add(autocomplete.itemHoverClass);
                          return;
                      }
                  }
              }
          }
      },

      mouseHover : function(e) {

          var itemCollection = document.getElementsByClassName(autocomplete.itemClass);

          for ( var i = 0; i < itemCollection.length; i++ ) {
              if ( itemCollection[i].classList.contains(autocomplete.itemHoverClass) ) {
                  itemCollection[i].classList.remove(autocomplete.itemHoverClass)
              }
          }

          if ( e.target.classList.contains(autocomplete.itemClass)  ) {
              e.target.classList.add(autocomplete.itemHoverClass);
          }
      },

      mouseRemoveHover : function(e) {
          if ( e.target.classList.contains(autocomplete.itemHoverClass)  ) {
              e.target.classList.remove(autocomplete.itemHoverClass);
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
              searchInput.value = document.getElementsByClassName(autocomplete.itemHoverClass)[0].innerText;
              autocomplete.collapse();
              autocomplete.clearData();
              searchInput.addEventListener("focus", autocomplete.parseResults);
              return;
          }
      },

      //hides dropdown
      collapse : function() {
          var acWrap = document.getElementsByClassName(autocomplete.autocompleteWrap);
          if  ( acWrap[0] !== undefined ) {
              acWrap[0].remove();
          }
      },

      /**
       * add to wrap div with innerHTML = Nothing found
       */
      showNoResult : function() {
          var acWrap = document.getElementsByClassName(autocomplete.autocompleteWrap);
          acWrapp[0].innerHTML = "<div class='nothing-found'>Nothing found</div>";
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
          var acElements = document.getElementsByClassName(autocomplete.itemClass);
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
          var acWrap = document.getElementsByClassName(autocomplete.autocompleteInnerWrap);
          acWrap[0].innerHTML = "";
          for (var x = 0; x < this.citiesFound.length; x++) {
              var matched = this.citiesFound[x].city.slice( this.citiesFound[x].city.toLowerCase().indexOf(this.citiesFound[x].searchInput) , this.citiesFound[x].city.toLowerCase().indexOf(this.citiesFound[x].searchInput) + this.citiesFound[x].searchInput.length );
              var matchedBold = "<b>" + matched + "</b>";
              var highlightedValue = this.citiesFound[x].city.replace( matched , matchedBold );
              acWrap[0].innerHTML += "<div class='" + this.itemClass + " " + this.itemCityClass + "'>" + highlightedValue + ", " + this.citiesFound[x].country + "</div>";
              acWrap[0].innerHTML += "<div class='" + this.itemClass + " plane'>" + this.citiesFound[x].airport.name + "</div>";
              for (var i = 0; i < this.citiesFound[x].locations.length; i++) {
                  acWrap[0].innerHTML += "<div class='" + this.itemClass + "'>" + this.citiesFound[x].locations[i] + "</div>";
              }
          }

          autocomplete.selectValule();
      },

      parseResults : function(e) {

          //remove old wrap
          autocomplete.collapse();
          console.log("add");
          //create new wrap
			    autocomplete.addAutocompleteWrap();

          if ( autocomplete.citiesFound.length ) {
              autocomplete.showResultCity();
              document.addEventListener("keyup" , autocomplete.arroNavigation);
              document.addEventListener("mouseover" , autocomplete.mouseHover);
              document.addEventListener("mouseout" , autocomplete.mouseRemoveHover);
          } else {
              autocomplete.showNoResult();
          }

          document.addEventListener("click", autocomplete.closeSearch);
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
