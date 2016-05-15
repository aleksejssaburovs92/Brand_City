
var validation = {

    $form : null,
    $formElementsText : null,
    $formElementsEmail : null,
    $formElementsPassword : null,
    errorClass : 'input-error',

    validEmail : true,
    validPass : true,

    emailFormat : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    passFormat : {

      passLength : 10

    },

    validationErrors : {

        language : {

            en : {

              empty : "Fill field!",
              email : "Enter correct e-mail!",
              password : "Password is too short!"
            }
        }
    },

    createErrorText : function( errorType ) {
      var html = '<span class="' + validation.errorClass + '">' + errorType + '</span>';
      return html;
    },

    removeErrorText : function( element , error ) {

      element.removeClass("input-error");
      element.siblings().each(function(){
        if ($(this).hasClass(validation.errorClass)) {
          $(this).remove();
        }
      });
      if ( element.siblings().hasClass(error) ) {
          element.siblings(error).remove();
      }
    },

    insertErrorText : function( er , element ) {

      validation.removeErrorText( element , $( validation.errorClass ) );
      element.addClass("input-error");
      $(er).insertAfter(element);
    },

    checkFill : function(val){

      if ( val.trim() ) {
        return true;
      } else {
        return false;
      }

    },

    validate : function() {

      if ( validation.$formElementsEmail.length > 0 ) {
          validation.validEmail = false;
          validation.validateEmail(validation.$formElementsEmail);
      }

      if ( validation.$formElementsPassword.length > 0 ) {
          validation.validPass = false;
          validation.validatePassword(validation.$formElementsPassword);
      }

      validation.formSubmit();

    },

    formSubmit : function() {

        if ( validation.validText && validation.validEmail && validation.validPass ) {

          var url = validation.$form.attr('action');
		      var serializedData = validation.$form.serialize();

    			$.post( url, serializedData,
    				// function(data){
    				// 	if (data.error){
            //     console.log("error");
    				// 	} else if (data.success){
    				// 		if (data.redirect){
    				// 			window.location = data.redirect;
    				// 			return ;
    				// 		}
    				// 		window.location.reload();
    				// 	}
    				// },
             "json");
        }

    },

    validateEmail : function( emailInput ) {

        $.each( emailInput , function(){

            if ( validation.checkFill( emailInput.val() ) ) {

                if ( validation.emailFormat.test(emailInput.val()) ) {
                    validation.validEmail = true;
                    validation.removeErrorText( emailInput );
                } else {
                    validation.validEmail = false;
                    validation.insertErrorText( validation.createErrorText( validation.validationErrors.language.en.email)  , emailInput );
                }

            } else {
                validation.validEmail = false;
                validation.insertErrorText( validation.createErrorText( validation.validationErrors.language.en.empty)  , emailInput );
            }

        });

    },

    validatePassword : function( passwordInput ) {

        if ( validation.checkFill( passwordInput.val() ) ) {

            if ( passwordInput.val().length >= validation.passFormat.passLength ) {
                validation.validPass = true;
                validation.removeErrorText( passwordInput );
            } else {
                validation.validPass = false;
                validation.insertErrorText( validation.createErrorText( validation.validationErrors.language.en.password)  , passwordInput );
            }

        } else {
            validation.validPass = false;
            validation.insertErrorText( validation.createErrorText( validation.validationErrors.language.en.empty)  , passwordInput );
        }

    },


    init : function( formID ){

        validation.$form = $( formID );
        validation.$formElementsEmail = validation.$form.find("input[type=email]");
        validation.$formElementsPassword = validation.$form.find("input[type=password]");

        validation.validate();
    }
};



$("#auth-form").on("submit", function(e){
  e.preventDefault();
  validation.init($(this));
});

$("#subscription-form").on("submit", function(e){
  e.preventDefault();
  validation.init($(this));
});

$("#deals-subscription-form").on("submit", function(e){
  e.preventDefault();
  validation.init($(this));
});
