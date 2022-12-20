const sendMessageId = document.getElementById("sendmessageid");
const statusDiv = document.getElementById("status");
const results = document.getElementById("results");

if (sendMessageId) {
    sendMessageId.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    glossaryurl: chrome.runtime.getURL("data/glossary.json"),
                    tabId: tabs[0].id
                },
                function(response) {
                    // use the reponse to create results items
                    // <dt><a href="#">adverse event</a></dt>
                    // <dd>Any health problem that happens during the study.</dd>
                    // 
                    if (results.children.length > 0) {
                        results.removeChild(results.querySelector("dl"));
                    }
                    if (response && response.length > 0) {
                        const resultList = document.createElement("dl");
                        statusDiv.textContent = `Found ${response.length} result${response.length > 1 ? "s" : ""}!`;
                        for (var i = 0; i < response.length; i++) {
                            // create the item title
                            const itemTitle = document.createElement("dt");
                            const titleLink = document.createElement("a");
                            titleLink.target = "_blank";
                            titleLink.href = "#";
                            titleLink.textContent = response[i].Term;
                            itemTitle.appendChild(titleLink);

                            // create the item desc
                            const itemDesc = document.createElement("dd");
                            itemDesc.textContent = response[i].Definition;

                            // append to the dl
                            resultList.appendChild(itemTitle);
                            resultList.appendChild(itemDesc);
                        }
                        results.appendChild(resultList);
                    }
                }
            );            
        });
    };
}