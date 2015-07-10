(function (window, document) {
  'use strict';

  var timerId = null;
  var DELAY_TIME = 50;

  var timeDifference = null;
  var initialClientTZ = null;

  var ticks = 0;
  var MAX_TICKS = 10e3;

  if (!window.localStorage) {
    alert('Ваш браузер устарел!');
    return;
  }

  if (localStorage.hasOwnProperty('__timeDifference')) {

    initialClientTZ = +localStorage.getItem('__initialClientTZ');
    timeDifference = +localStorage.getItem('__timeDifference');

    displayAll();
    return;
  }

  var startTime = null;
  var duration = null;

  sendRequest();

  function sendRequest() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

      if (this.readyState != 2 && this.readyState != 4) return;

      if (this.readyState == 2) {
        duration = (Date.now() - startTime) / 2 | 0; // reqTime ~= resTime ??
        return;
      }

      if (this.status != 200) {
        console.log('Ошибка');
        return;
      }

      var respText = JSON.parse(this.responseText);

      var servTime = +(respText.time) + duration;

      timeDifference = servTime - new Date();
      localStorage.setItem('__timeDifference', timeDifference);

      localStorage.setItem('__serverTZ', +respText.zone);

      if (!localStorage.hasOwnProperty('__initialClientTZ')) {
        initialClientTZ = new Date().getTimezoneOffset();
        localStorage.setItem('__initialClientTZ', initialClientTZ);
      }

      displayAll();
    };

    xhr.open('GET', '/time');
    startTime = Date.now();
    xhr.send();
  }

  function displayAll() {
    displayTime();

    setInputHandler();
    displayInputElement();

    displayTZ();
  }

  function displayTime() {
    var div = document.getElementById('servTimeBlock');
    timeDifference = +localStorage.getItem('__timeDifference');

    var timerId = setInterval(function() {

      if (++ticks > MAX_TICKS) {
        ticks = 0;
        clearInterval(timerId);
        sendRequest();
      }

      var date = new Date(Date.now() + timeDifference);

      if (new Date().getTimezoneOffset() != initialClientTZ) {
        date.setMinutes(date.getMinutes() +
          (date.getTimezoneOffset() - initialClientTZ));
      }

      var hours = date.getHours();
      hours = hours < 10 ? '0' + hours : hours;

      var minutes = date.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var seconds = date.getSeconds();
      seconds = seconds < 10 ? '0' + seconds : seconds;

      var ms = date.getMilliseconds();

      div.innerHTML = hours + ':' + minutes + ':' + seconds + '.' + ms;
    }, DELAY_TIME);
  }

  function displayTZ() {
    document.getElementById('currentTZ').innerHTML =
      -(localStorage.getItem('__serverTZ') / 60);
  }

  function setInputHandler() {
    document.getElementById('interval').onchange = function() {

      var oldServerTZ = +localStorage.getItem('__serverTZ');
      var shift = oldServerTZ + this.value * 60;
      timeDifference += shift * 60 * 1000;

      localStorage.setItem('__timeDifference', timeDifference);
      localStorage.setItem('__serverTZ', -this.value * 60);

      document.getElementById('currentTZ').innerHTML = this.value;
    };
  }

  function displayInputElement() {
    document.getElementById('interval').value =
      -(localStorage.getItem('__serverTZ') / 60);

    document.getElementById('interval').style.display = 'block';
  }

})(window, document);
