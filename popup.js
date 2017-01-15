function $(id) {
  return document.getElementById(id);
}

function getDomain(url) {
  if (url.indexOf("//")!=-1) {
    url = url.substring(url.indexOf("//")+2);
    if (url.indexOf("/")!=-1) {
      url = url.substring(0,url.indexOf("/"));
    }
  }
  return url;
}

function clickHandler(wholePage) {
  chrome.tabs.query( {active: true}, function(tab) {
    var url = tab[0].url;
    if (!wholePage) {
      url = getDomain(url);
    }
    var text = $("comment").value;
    var comments=JSON.parse(localStorage[url]?localStorage[url]:"[]");
    comments.push({"text":text});
    localStorage[url]=JSON.stringify(comments);
    $("content").innerHTML=url;
  });
}

function pageClickHandler() {
  clickHandler(true);
}

function domainClickHandler() {
  clickHandler(false);
}
console.log(new Date());
window.onload=function() {
    chrome.tabs.query( {active: true}, function(tab) {
      var url = tab[0].url;
      var domain = getDomain(url);
      var domainComments=JSON.parse(localStorage[domain]?localStorage[domain]:"[]");
      var pageComments=JSON.parse(localStorage[url]?localStorage[url]:"[]");
      var content = "";
      for (var i=0; i<domainComments.length; i++) {
        content+=domainComments[domainComments.length-i-1].text+"<hr />";
      }
      for (var i=0; i<pageComments.length; i++) {
        content+=pageComments[pageComments.length-i-1].text+"<hr />";
      }
      content=content.replace("\n","<br />");
      $("content").innerHTML=content;
      $("addToPage").onclick=pageClickHandler;
      $("addToDomain").onclick=domainClickHandler;
      // console.log("--->"+new Date());
    });
};
console.log(new Date());
