// IIFE keeps our variables private
// and gets executed immediately!
(function () {
  
  let doc = document.getElementById('editor-view');
  doc.contentEditable = true;
  doc.focus();
})()