function bayFetch(url, config) {
  if (config && config.body) {
    config.body = JSON.stringify(config.body);
  }
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...config,
  }).then(function (res) {
    return res.json();
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: '扇贝查词',
    id: 'Dict',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  const url = `https://apiv3.shanbay.com/abc/words/senses?vocabulary_content=${info.selectionText}`;
  bayFetch(url).then(function (res) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { res });
    });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const postUrl = 'https://apiv3.shanbay.com/wordscollection/words';
  if (request.word) {
    const url = `https://apiv3.shanbay.com/abc/words/senses?vocabulary_content=${request.word}`;
    bayFetch(url).then(function (res) {
      sendResponse(res);
    });
  }
  if (request.wordId) {
    const url = 'https://apiv3.shanbay.com/wordscollection/words';
    bayFetch(url, {
      method: 'POST',
      body: {
        business_id: 0,
        vocab_id: request.wordId,
      },
    }).then(function (res) {
      sendResponse(res);
    });
  }

  return true;
});
