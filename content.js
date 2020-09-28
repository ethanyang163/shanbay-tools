const WORD_ENUMS = {
  'n.': '名词',
  'pron.': '代词',
  'adj.': '形容词',
  'v.': '动词',
  'vt.': '动词',
  'adv.': '副词',
  'conj.': '连词',
  'prep.': '介词',
  'auxv.': '助动词',
  'art.': '冠词',
  'article.': '冠词',
  'abbr.': '缩写',
  'num.': '量词',
  'defa.': '默认',
  'aux. v.': '助动词',
  'phrase.': '短语',
  'mod. v.': '情态动词',
  'int.': '未知', // come
  'infinmarker.': '不定词标记', // to
  '.': '未知', // Gatsby
};

function removeWordModal() {
  const modal = document.querySelector('.modal-s');
  if (modal) {
    modal.remove();
  }
}

function getWordViewOffset(wordView, x, y) {
  const rect = wordView.getBoundingClientRect();
  let top = y;
  let left = x;
  if (y + rect.height > window.innerHeight) {
    top = window.innerHeight - rect.height - 16;
  }
  if (x + rect.width > window.innerWidth) {
    left = window.innerWidth - rect.width - 16;
  }
  return {
    top: top + document.documentElement.scrollTop,
    left: left + document.documentElement.scrollLeft,
  };
}

function postionElement(element, event) {
  const position = getWordViewOffset(element, event.clientX, event.clientY);
  element.style.top = `${position.top}px`;
  element.style.left = `${position.left}px`;
}

function wordView(e, wordModel) {
  const { id: wordId, definitions, id_int: wordIdInt } = wordModel;
  const wordModal = document.createElement('div');
  document.addEventListener('click', event => {
    if (
      event.target.className !== 'modal-s' &&
      event.target.className !== 'collect'
    ) {
      removeWordModal();
    }
  });
  wordModal.classList.add('modal-s');
  if (wordModel.msg) {
    const errMsg = document.createElement('div');
    errMsg.classList.add('error');
    if (wordModel.msg === 'Unauthorized') {
      errMsg.innerHTML =
        '<a href="https://web.shanbay.com/web/account/login" target="_blank">去扇贝网登录</a>';
    }
    if (wordModel.msg === 'Word not found') {
      wordModal.style.alignItems = 'center';
      const image = new Image(200, 150);
      image.src = chrome.extension.getURL('images/404.png');
      wordModal.appendChild(image);
      errMsg.innerHTML = '没有在扇贝网中查到该词';
    }
    wordModal.appendChild(errMsg);
    document.body.appendChild(wordModal);
    postionElement(wordModal, e);
  } else {
    const wordContent = document.createElement('div');
    wordContent.classList.add('word');
    wordContent.innerHTML = wordModel.content;
    wordModal.appendChild(wordContent);
    const phoneticSymbol = document.createElement('div');
    phoneticSymbol.classList.add('phonetic');
    phoneticSymbol.innerHTML =
      wordModel.audios[0].us.ipa && `/${wordModel.audios[0].us.ipa}/`;
    wordModal.appendChild(phoneticSymbol);
    const cnUl = document.createElement('div');
    cnUl.classList.add('ul');
    wordModal.appendChild(cnUl);
    for (let i = 0; i < definitions.cn.length; i++) {
      const li = document.createElement('div');
      li.classList.add('li');
      cnUl.appendChild(li);
      li.innerHTML = `【<b>${WORD_ENUMS[definitions.cn[i].pos]}</b>】 ${
        definitions.cn[i].def
      }`;
    }
    const enUl = document.createElement('div');
    wordModal.appendChild(enUl);
    enUl.classList.add('ul');
    for (let i = 0; i < definitions.en.length; i++) {
      const li = document.createElement('div');
      li.classList.add('li');
      enUl.appendChild(li);
      li.innerHTML = `<em><b>${definitions.en[i].pos}</b></em> ${definitions.en[i].def}`;
    }
    const button = document.createElement('div');
    button.classList.add('collect');
    button.innerHTML = '+添加到扇贝生词本';
    wordModal.appendChild(button);

    document.body.appendChild(wordModal);

    postionElement(wordModal, e);

    document.querySelector('.collect').addEventListener('click', event => {
      if (typeof chrome.app.isInstalled !== 'undefined') {
        chrome.runtime.sendMessage({ wordId, wordIdInt }, function (response) {
          button.remove();
          const a = document.createElement('a');
          a.innerHTML = '已加入扇贝生词本，去扇贝网学习';
          a.href = `https://web.shanbay.com/wordsweb/#/detail/${response.vocab_id}`;
          a.setAttribute('target', '_blank');
          wordModal.appendChild(a);
        });
      }
    });
  }
}

function handleDbclick(e) {
  const word = window.getSelection().toString();
  if (/^[A-Za-z']+$/.test(word)) {
    chrome.runtime.sendMessage({ word }, function (response) {
      wordView(e, response);
    });
  }
}

chrome.storage.sync.get(
  {
    isDbclickOn: false,
  },
  function (items) {
    if (items.isDbclickOn) {
      document.body.addEventListener('dblclick', handleDbclick);
    }
  }
);

let ev = null;

document.body.addEventListener('contextmenu', function (e) {
  ev = e;
});

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
  wordView(ev, msg.res);
});
