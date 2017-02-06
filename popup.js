function $(id) {
    return document.getElementById(id);
}

function getDomain(url) {
    if (url.indexOf("//") != -1) {
        url = url.substring(url.indexOf("//") + 2);
        if (url.indexOf("/") != -1) {
            url = url.substring(0, url.indexOf("/"));
        }
    }
    return url;
}

function clickHandler(wholePage) {
    chrome.tabs.query({active: true}, function (tab) {
        var url = tab[0].url;
        if (!wholePage) {
            url = getDomain(url);
        }
        var fullPage = $("fullPage").checked;
        var text = $("comment").value;
        var comments = JSON.parse(localStorage[url] ? localStorage[url] : "[]");
        comments.push({"text": text, "fullPage": fullPage});
        localStorage[url] = JSON.stringify(comments);
        $("content").innerHTML = url;
        $("fullPage").checked = false;
        $("comment").value = "";
        refresh();
    });
}

function pageClickHandler() {
    clickHandler(true);
}

function domainClickHandler() {
    clickHandler(false);
}

function getCommentsFor(token) {
    return JSON.parse(localStorage[token] ? localStorage[token] : "[]");
}

function refresh() {
    function convertToHTML(comments, scope) {
        var content = "";
        for (var i = 0; i < comments.length; i++) {
            var idx = comments.length - i - 1;
            content += "<tr><td>" + comments[idx].text + "</td><td valign='top'><button id=\"" + scope + "_" + idx + "\">x</button></td></tr>";
        }
        return content;
    }

    function remove(idxToRemove, commentsArray) {
        var comments = [];
        for (var j = 0; j < commentsArray.length; j++) {
            if (j != idxToRemove) {
                comments.push(commentsArray[j]);
            }
        }
        return comments;
    }

    chrome.tabs.query({active: true}, function (tab) {
        var url = tab[0].url;
        var domain = getDomain(url);
        var domainComments = getCommentsFor(domain);
        var pageComments = getCommentsFor(url);
        var content = convertToHTML(domainComments, "domain") + convertToHTML(pageComments, "page");
        content = "<table style='font-size:small;'>" + content.replace("\n", "<br />") + "</table>";
        $("content").innerHTML = content;
        $("addToPage").onclick = pageClickHandler;
        $("addToDomain").onclick = domainClickHandler;
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            if (!button.onclick) {
                button.onclick = function (element) {
                    var id = element.srcElement.id;
                    var elems = id.split("_");
                    if (elems[0] == "domain") {
                        localStorage[domain] = JSON.stringify(remove(elems[1] * 1, domainComments));
                        refresh();
                    } else if (elems[0] == "page") {
                        localStorage[url] = JSON.stringify(remove(elems[1] * 1, pageComments));
                        refresh();
                    }
                }
            }
        }
    });
}
window.onload = function () {
    refresh();
};

