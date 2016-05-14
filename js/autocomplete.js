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

      //sets dropdown
      addAutocompleteWrap : function() {
          var containerDiv = document.createElement('div');
          containerDiv.classList.add('autocomplete-wrap');
          searchInputWrap.appendChild(containerDiv);
          autocomplete.resultsContainer = true;
      },

      //hides dropdown
      collapse : function() {
          if ( autocomplete.activeResults ){
              autocomplete.hideResults();
              var acWrap = document.querySelector(".autocomplete-wrap");
      				acWrap.classList.add("is-hidden");
          }
      },

      //adds in dropdown element with no results found
      showNoResult : function() {
          var acWrap = document.querySelector(".autocomplete-wrap");
          acWrap.innerHTML = "<div class='nothing-found'>Nothing found</div>";
          autocomplete.activeResults = true;
      },

      // removes elements from dropdown
      hideResults : function() {
          var acWrap = document.querySelector(".autocomplete-wrap");
          while (acWrap.firstChild) {
              acWrap.firstChild.remove();
          }
      },

      closeSearch: function(e) {
    			var acWrap = document.querySelector(".autocomplete-wrap");
          console.log("closeSearch");
    			if (e.target != acWrap ) {
              if ( !this.activeResults ) {
                  autocomplete.collapse();
                  document.removeEventListener("click", autocomplete.closeSearch);
                  autocomplete.enterKeyEvent = false;
                  searchInput.addEventListener("click", autocomplete.parseResults);
              }
    			}
  		},

      searchData : function( obj ) {
          var userInput = searchInput.value,
              inputValue = userInput.toLowerCase();
    			    // this.searchCities( obj, inputValue );
      },

      parseResults : function() {
          if ( !autocomplete.resultsContainer ) {
    				    autocomplete.addAutocompleteWrap();
    			} else {
      				var acWrap = document.querySelector(".autocomplete-wrap");
      				acWrap.classList.remove("is-hidden");
    			}

          autocomplete.showNoResult();

          if (!autocomplete.enterKeyEvent) {
              console.log("add closeSearch");
              document.addEventListener("click", autocomplete.closeSearch);
      				autocomplete.enterKeyEvent = true;
    			}
      },

      init : function() {
          var inputValue = searchInput.value;

          for (var k in storeData) {
      		    if (storeData.hasOwnProperty(k)) {
      		        autocomplete.searchData(storeData[k]);
      		    }
          }

          autocomplete.parseResults();
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
