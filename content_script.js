
chrome.runtime.sendMessage({"cmd":"getComments"},function(state) {
  var domainComments=state.domainComments;
  var pageComments=state.pageComments;

  var content = "";
  var count=0;
  for (var i=0; i<domainComments.length; i++) {
    var comment=domainComments[domainComments.length-i-1];
    if (comment.fullPage) {
      content+=comment.text+"<hr />";
      count++;
    }
  }
  for (var i=0; i<pageComments.length; i++) {
    var comment=pageComments[pageComments.length-i-1];
    if (comment.fullPage) {
      content+=comment.text+"<hr />";
      count++;
    }
  }
  content=content.replace("\n","<br />");
  if (count>0) {
    content=content.substring(0,content.length-3);
    var newElement = document.createElement("div");
    newElement.style.backgroundColor="orange";
    newElement.style.padding="5px";
    newElement.innerHTML=content;
    document.body.insertBefore(newElement,document.body.firstChild);
  }
});
