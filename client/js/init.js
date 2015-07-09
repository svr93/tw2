(function(window, document) {
  'use strict';

  var uploader = null;

  var form = document.getElementById('fileForm');
  form.style.display = 'block';

  var button = document.getElementById('sendFileFormData');

  button.onclick = function() {
    var data = new FormData(form);
    var output = document.getElementById('result');

    uploader = new Uploader(data, 'multipart/form-data', null, output);
    uploader.upload();
  };

  button.style.display = 'block';

})(window, document);
