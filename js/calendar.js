// these are labels for the days of the week
cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the days of the week for each month, in order
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
cal_current_date = new Date();

function Calendar( date ) {
  this.month = ( date.getMonth() == null) ? cal_current_date.getMonth() : date.getMonth();
  this.year  = ( date.getFullYear() == null) ? cal_current_date.getFullYear() : date.getFullYear();
  this.html = '';
}

Calendar.prototype.generateHTML = function(){
  var html = "";
    // get first day of month

    var firstDay = new Date(this.year, this.month , 1);
    var startingDay = firstDay.getDay();

    // find number of days in month
    var monthLength = cal_days_in_month[this.month];

    // compensate for leap year
    if (this.month == 1) { // February only!
      if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
        monthLength = 29;
      }
    }


    // do the header
    var monthName = cal_months_labels[this.month]
    html += '<table class="calendar-table">';
    html += '<tr><th class="calendar-months" colspan="7">';
    html +=  monthName + "&nbsp;" + this.year;
    html += '</th></tr>';
    html += '<tr class="calendar-header">';
    for(var i = 0; i <= 6; i++ ){
      html += '<td class="calendar-header-day">';
      html += cal_days_labels[i];
      html += '</td>';
    }
    html += '</tr><tr>';

    // fill in the days
    var day = 1;
    // this loop is for is weeks (rows)
    for (var i = 0; i < 9; i++) {
      // this loop is for weekdays (cells)
      for (var j = 0; j <= 6; j++) {

        var dataDate = ( day <= monthLength && (i > 0 || j >= startingDay) ) ? new Date( this.year , this.month , day ) : "" ;

        html += '<td class="calendar-day" data-date="' + dataDate + '">';
        if (day <= monthLength && (i > 0 || j >= startingDay)) {
          html += day;
          day++;
        }
        html += '</td>';
      }
      // stop making rows if we've run out of days
      if (day > monthLength) {
        break;
      } else {
        html += '</tr><tr>';
      }
    }
    html += '</tr></table>';

    this.html = html;
}

Calendar.prototype.getHTML = function() {
  return this.html;
};


//make all prev dates and unfilled td disabled

var disableDay = function( element , data_date ){
  var dayCount = new Date( data_date );
  if ( Math.ceil( (dayCount - cal_current_date)/86400000 ) < 0 || data_date.length === 0 ) {
    element.addClass("disabled");
  }
};


//CREATE CALENDAR ON LOAD

var createCalendar = function(){

  $(".js-calendar-box").each(function(){
    $(".js-calendar-wrap").each(function(i){
        var newMonth = new Date(new Date(cal_current_date).setMonth(cal_current_date.getMonth()+i));
        var cal = new Calendar(newMonth);
        cal.generateHTML();
        $(this).html(cal.getHTML());
        $(".calendar-day").each(function(){
             disableDay( $(this) , $(this).attr("data-date"));
        });
    });
  });

};
createCalendar();

// CALENDAR OPTIONS NEXT OR PREV
var calSwitch = function(){

  var nextCalMonths = 0;
  $(".js-calendar-arrow").each(function(){

    $(this).on("click", function(){
      if ( $(this).attr("data-dir") === "prev" ) {
        nextCalMonths--;
      } else {
        nextCalMonths++;
      }


      $(this).siblings(".calendar-container").find(".calendar-wrap").each(function(i){

        var newMonth = new Date(new Date(cal_current_date).setMonth(cal_current_date.getMonth()+nextCalMonths+i));
        var cal = new Calendar(newMonth);
        cal.generateHTML();
        $(this).html(cal.getHTML());

        $(".calendar-day").each(function(){
             disableDay( $(this) , $(this).attr("data-date"));
        });

      });
    });
  });

};
calSwitch();

$(".calendar-container").each(function(){

  var $calendarDay = $(this).find(".calendar-day");

  firstTripDate = function(e){
    var $target = $(event.target);
    $calendarDay.each(function(){
      $(this).removeClass("js-start-date");
      $(this).removeClass("js-end-date");
      $(this).removeClass("trip-day");
      });

      $target.addClass("js-start-date");
      $calendarDay.each(function(){
        $(this).off("click" , firstTripDate);
        $(this).on("click" , lastTripDate);
    });


  };

  lastTripDate = function(e){

    var $target = $(event.target);
    $target.addClass("js-end-date");
    $target.unbind("click" , lastTripDate);
    $calendarDay.each(function(){
      $(this).off("click" , lastTripDate );
      $(this).on("click" , firstTripDate );
    });
    var day_in = new Date( $(".js-start-date").attr("data-date") );
    var day_out = new Date( $(".js-end-date").attr("data-date") );
    colorChosenDays( day_in , day_out );
  };

  $calendarDay.each(function(){
    $(this).on("click", firstTripDate);
  });

  colorChosenDays = function( day_in , day_out ){
    var daysToColor = Math.ceil( ( day_out - day_in )/86400000);
    for ( var i = 1; i < daysToColor; i++) {
      var day = [];
      var dayColor = new Date(new Date(day_in).setDate(day_in.getDate()+i));

      day.push(dayColor);
      $calendarDay.each(function(){
        if ( day == $(this).attr("data-date") ) {
          $(this).addClass("trip-day");
        }
      });
    }
  };

});
