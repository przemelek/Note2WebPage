var state = {"domainComments": [], "pageComments": []};

function getDomain(url) {
    if (url.indexOf("//") != -1) {
        url = url.substring(url.indexOf("//") + 2);
        if (url.indexOf("/") != -1) {
            url = url.substring(0, url.indexOf("/"));
        }
    }
    return url;
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.cmd == "getComments") {
            sendResponse(state);
        }
    }
);

function updateBadge(tabId) {
    chrome.tabs.get(tabId, function (tab) {
        var url = tab.url;
        var domain = getDomain(url);
        var domainComments = JSON.parse(localStorage[domain] ? localStorage[domain] : "[]");
        var pageComments = JSON.parse(localStorage[url] ? localStorage[url] : "[]");
        state.domainComments = domainComments;
        state.pageComments = pageComments;
        var count = domainComments.length + pageComments.length;
        var text = count > 0 ? "" + count : "";
        chrome.browserAction.setBadgeText({"text": text});
        chrome.browserAction.setBadgeBackgroundColor({"color": "red"});
    });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    updateBadge(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.highlighted) {
        updateBadge(tabId);
    }
});
