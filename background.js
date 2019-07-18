function bayFetch(url, config) {
    if (config && config.body) {
        config.body = JSON.stringify(config.body);
    }
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        ...config
    }).then(function(res) {
        return res.json();
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const postUrl = 'https://apiv3.shanbay.com/wordscollection/words';
    if (request.word) {
        const url = `https://apiv3.shanbay.com/abc/words/senses?vocabulary_content=${
            request.word
        }`;
        bayFetch(url).then(function(res) {
            sendResponse(res);
        });
    }
    if (request.wordId) {
        const url = 'https://apiv3.shanbay.com/wordscollection/words';
        bayFetch(url, {
            method: 'POST',
            body: {
                business_id: 0,
                vocab_id: request.wordId
            }
        });
    }
    if (request.wordIdInt) {
        const url = 'https://www.shanbay.com/api/v1/bdc/learning/';
        bayFetch(url, {
            method: 'POST',
            body: {
                vocabulary_ids: request.wordIdInt
            }
        }).then(function(res) {
            sendResponse(res);
        });
    }

    return true;
});
