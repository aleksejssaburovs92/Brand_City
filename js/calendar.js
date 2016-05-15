(function(){
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

var start_date = null;
var end_date = null;

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

//CREATE CALENDAR MONTHS WRAP

var createCalendarWrap = function(number) {
  var $cloneItem = $("<div>", {class: "calendar-wrap box-item js-calendar-wrap"});
  $(".calendar-container").empty();
  for (var i = 0; i < number; i++) {
    $cloneItem.clone().appendTo($(".calendar-container"));
  }
}

//RESPONSIVE CALENDAR

var addCalendarMonths = function() {
  if ($("body").width() > 991 ) {
    createCalendarWrap(3);
  } else if ($("body").width() > 767 ) {
    createCalendarWrap(2);
  } else {
    createCalendarWrap(1);
  }
  createCalendar();
};
addCalendarMonths();

//ON RESIZE REDEPLOY CALENDAR WRAP

$(window).resize(function(){
  addCalendarMonths();
  addCalendarOptions($(".calendar-container"));
  colorChosenDays( start_date , end_date );
  $(".calendar-day").each(function(i){
      if ( $(this).attr("data-date") == start_date ) {
        $(this).addClass("js-start-date");
      } else if ( $(this).attr("data-date") == end_date ) {
        $(this).addClass("js-end-date");
      }
  });
});

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

      if (start_date !== null || end_date !== null ) {
            $("[data-date='" + start_date + "']").addClass("js-start-date");
            $("[data-date='" + end_date + "']").addClass("js-end-date");
          colorChosenDays( start_date , end_date );
      }

      addCalendarOptions($(".calendar-container"));

    });
  });
};
calSwitch();




var calendarOptions = function(element){

    var $calendarDay = element.find(".calendar-day");

    firstTripDate = function(){
      var $target = $(event.target);

      //CLEAR UP CLICKED calendar-day CLASSES
      $calendarDay.each(function(){
        $(this).removeClass("js-start-date");
        $(this).removeClass("js-end-date");
        $(this).removeClass("trip-day");
        });
        // ADD CLICKED calendar-day CLASS OF FIRST TRIP DAY
        $target.addClass("js-start-date");
        start_date = new Date( $target.attr("data-date") );

        // ADD MONTH TO DROPDOWN HEADER
        var fullStartDate = cal_months_labels[start_date.getMonth()] + ' ' + start_date.getDate();
        var shortStratDate = cal_months_labels[start_date.getMonth()].substring(0,3) + ' ' + start_date.getDate();

        $(".sd-start").find(".date-full").html(fullStartDate);
        $(".sd-start").find(".date-mini").html(shortStratDate);

        //UNBIND firstTripDate FUNCTION AND BIND lastTripDate FUNCTION
        $calendarDay.each(function(){
          $(this).off("click" , firstTripDate);
          $(this).on("click" , lastTripDate);
          $(this).on("mouseover" , mouseoverTripDay);
      });
    };

    lastTripDate = function(){

      // TARGET OF EVENT(CLICK)
      var $target = $(event.target);

      // GET OBJECTS BY NEW DATE FROM OUR DATA_DATE ATTRIBUTE
      end_date = new Date( $target.attr("data-date") );

      $target.addClass("js-end-date");

      // DAY OUT CAN'T BE LESSER THAN DAY IN
      if ( start_date > end_date ) {
        return false;
      }


      // ADD MONTH TO DROPDOWN HEADER
      var fullEndDate = cal_months_labels[end_date.getMonth()] + ' ' + end_date.getDate();
      var shortEndDate = cal_months_labels[end_date.getMonth()].substring(0,3) + ' ' + end_date.getDate();

      $(".sd-end").find(".date-full").html(fullEndDate);
      $(".sd-end").find(".date-mini").html(shortEndDate);

      //UNBIND lastTripDate FUNCTION AND BIND firstTripDate FUNCTION
      addEventToCalDay($calendarDay);

      //CALL FUNCTION colorChosenDays
      colorChosenDays( start_date , end_date );
    };

    addEventToCalDay = function(element) {
      element.each(function(){
        $(this).off("click" , lastTripDate );
        $(this).off("mouseover" , mouseoverTripDay);
        $(this).on("click" , firstTripDate );
      });
    };


    //REMOVES trip-day
    removeSelectedArea = function() {
      $(".calendar-day").each(function(){
        $(this).removeClass("trip-day");
      });
    };


    // ON HOVER ADDS SPECIAL COLOR FOR ALL AREA FROM START_DAY
    mouseoverTripDay = function() {
      // TARGET OF EVENT(CLICK)
      var $target = $(event.target);
      // GET OBJECTS BY NEW DATE FROM OUR DATA_DATE ATTRIBUTE
      var day_in = new Date( $(".js-start-date").attr("data-date") );
      var day_out = new Date( $target.attr("data-date") );

      removeSelectedArea();
      colorChosenDays( day_in , day_out );
    };


    //ON EACH calendar-day CLICK CALLS FUNCTION firstTripDate
    $calendarDay.each(function(){
      $(this).on("click", firstTripDate);
    });
};

var colorChosenDays = function( day_in , day_out ){
  //COUNTS HOW MANY DAYS ARE CHOOSEN TO TRIP
  var daysToColor = Math.ceil( ( day_out - day_in )/86400000);

  //COLOR UP EVERY DAY THAT HAS BEEN CHOOSEN (FROM SECOND TILL LASTDAY)
  for ( var i = 1; i < daysToColor; i++) {
    var day = [];
    var dayColor = new Date(new Date(day_in).setDate(day_in.getDate()+i));

    //PUSH OBJECT IN ARRAY TO STRINGIFY
    day.push(dayColor);

    //LOOP TO COLOR UP calendar-day BY ATTRIBUTE data-date
    $(".calendar-container").find(".calendar-day").each(function(){
      if ( day == $(this).attr("data-date") ) {
        $(this).addClass("trip-day");
      }
    });
  }
};

var addCalendarOptions = function(element) {

  element.each(function(){
    calendarOptions($(this));
  });

};

addCalendarOptions($(".calendar-container"));
})();
