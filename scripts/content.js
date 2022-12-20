// Copyright 2022 Google LLC
//
const wrapAsyncFunction = (listener) => (request, sender, sendResponse) => {
  // the listener(...) might return a non-promise result (not an async function), so we wrap it with Promise.resolve()
  Promise.resolve(listener(request, sender)).then(sendResponse);
  return true; // return true to indicate you want to send a response asynchronously
};

chrome.runtime.onMessage.addListener(
  wrapAsyncFunction(async (request, sender) => {
    const pageBody = document.querySelector('body');
    var searchBody = pageBody.textContent;

    //searchBody.replace(/''/g,'<span class="highlight-val">'+v+'</span>');

    var glossary = await fetchGlossary(request);
    var results = [];

    glossary.forEach((g) => {
      const searchHits = searchBody.search(`${g.Term}`);
      if (searchHits >= 0) {
        results.push(g);
      }
    });

    // do search here
    // return 'faked' search results for now
    return results;
  })
);

async function fetchGlossary(request) {
  console.log(request.glossaryurl);
  const response = await fetch(request.glossaryurl);
  const glossary = await response.json();
  return glossary;
}
