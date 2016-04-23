
var validation = {

    $form : null,
    $formElementsText : null,
    $formElementsEmail : null,
    $formElementsPassword : null,

    validEmail : null,
    validPass : null,
    validText : null,

    emailFormat : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    passFormat : {

      passLength : 10

    },

    validationErrors : {

        language : {

            en : {

              empty : "Fill field!",
              email : "Enter correct e-mail!"
            }
        }
    },

    checkFill : function(val){

      if ( val.trim() ) {
        return true;
      } else {
        return false;
      }

    },

    addError : function(el) {
      el.addClass("input-error");
    },

    hideError : function(el) {
      el.removeClass("input-error");
    },

    validate : function() {

      if ( validation.$formElementsText.length > 0 ) {
          validation.validText = false;
      } else {
          validation.validText = true;
      }

      if ( validation.$formElementsEmail.length > 0 ) {
          validation.validEmail = false;
          validation.validateEmail(validation.$formElementsEmail);
      } else {
          validation.validEmail = true;
      }

      if ( validation.$formElementsPassword.length > 0 ) {
          validation.validPass = false;
          validation.validatePassword(validation.$formElementsPassword);
      } else {
          validation.validPass = true;
      }

      validation.formSubmit();

    },

    formSubmit : function() {

        if ( validation.validText && validation.validEmail && validation.validPass ) {
          validation.$form.unbind("submit");
          validation.$form.submit();
        }

    },

    validateEmail : function(emailInput) {

      $.each(emailInput , function(){

        if ( validation.checkFill( emailInput.val() ) ) {
          if ( validation.emailFormat.test(emailInput.val()) ) {
            validation.hideError(emailInput);
            validation.validEmail = true;
            console.log("good email");
          } else {
            validation.addError(emailInput);
            validation.validEmail = false;
            console.log("bad email");
          }
        } else {
          validation.addError(emailInput);
          validation.validEmail = false;
          console.log("fill email");
        }

      });

    },

    validatePassword : function(passwordInput) {

      if ( validation.checkFill( passwordInput.val() ) ) {

          if ( passwordInput.val().length >= validation.passFormat.passLength ) {
              validation.hideError(passwordInput);
              validation.validPass = true;
              console.log("good pass");
          } else {
              validation.addError(passwordInput);
              validation.validPass = false;
              console.log("short pass");
          }

      } else {
        validation.addError(passwordInput);
        validation.validPass = false;
        console.log("fill pass");
      }

    },


    init : function(formID){


        validation.$form = $(formID);
        validation.$formElementsText = validation.$form.find("input[type=text]");
        validation.$formElementsEmail = validation.$form.find("input[type=email]");
        validation.$formElementsPassword = validation.$form.find("input[type=password]");


        validation.$form.on("submit", function(e){
          e.preventDefault();
          validation.validate();
        });
    }
};

validation.init("#auth-form");
