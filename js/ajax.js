var req = new XMLHttpRequest();
req.open('GET', 'https://restcountries.eu/rest/v1/name/ba', true); /* Третий аргумент true означает асинхронность */
req.onreadystatechange = function (aEvt) {
  if (req.readyState == 4) {
     if(req.status == 200){
      var data = JSON.parse(req.responseText);
      for (var i = 0; i<data.length; i++) {
        console.log(data[i]);
      }
    } else {
      dump("Error loading page\n");
    }
  }
};
req.send(null);
