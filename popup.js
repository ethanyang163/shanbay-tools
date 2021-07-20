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

bayFetch('https://apiv3.shanbay.com/bayuser/user').then(function (res) {
  if (res.msg === '登录信息过期') {
    document.querySelector('.login').style.display = 'block';
  } else {
    const avatar = document.querySelector('.avatar');
    avatar.src = res.avatar_url;
    const nickname = document.querySelector('.nickname');
    nickname.innerHTML = res.nickname;
    const tip = document.querySelector('.tip');
    tip.innerHTML =
      '<ul><li>你可以在任意网页右击查词</li><li>去你的扩展程序列表找到【详细信息】->【扩展程序选项】可开启双击查词</li><li>配置更新后刷新所在页面生效</li></ul>';
    document.querySelector('.user-wrap').style.display = 'block';
  }
});
