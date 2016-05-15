$(".js-dropdown").each(function(){

	var $dropdown = $(this),
			$dropdownToggler = $dropdown.find(".js-dropdown-toggler"),
			$dropdownBox = $dropdown.find(".js-dropdown-box"),
			dropdownType = $dropdown.data("dropdown-type"),
	    open = function(){
	      if(!$dropdown.hasClass("open")){
	  				$dropdown.addClass("open");
	  				$(document).bind("click", close);
	  			} else {
	  				$dropdown.removeClass("open");
	  				$(document).unbind("click", close);
	  			}
	  	},
	    close = function(e) {
	      var $target = $(e.target),
	  			  inBox = $target.closest($dropdownBox[0]).length,
	  			  inButton = $target.closest($dropdownToggler[0]).length,
	          outside = (!inButton) ? (dropdownType !== "closing") ? (!inBox) ? true : false : true : false;

	  		if(outside){
	        $dropdown.removeClass("open");
	  			$(document).unbind("click", close);
	      }
	    };

  		$dropdownToggler.on("click", open);
});


$(".js-lang").each(function(){
		var $lang = $(this),
				$langDisplay = $lang.find(".js-lang-display"),
				$langToggler = $lang.find(".js-lang-toggler");

		$langToggler.on("click", function(){
				var lang = $(this).attr("href").substring(1);
				$langDisplay.html(lang);
		});

});

$(".mobile-btn").on("click", function(){
		$(".mobile-nav").slideToggle();
});
