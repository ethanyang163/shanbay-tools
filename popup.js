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

bayFetch('https://apiv3.shanbay.com/bayuser/user').then(function(res) {
    if (res.msg === '缺少user_id参数') {
        document.querySelector('.login').style.display = 'block';
    } else {
        const avatar = document.querySelector('.avatar');
        avatar.src = res.avatar_url;
        const nickname = document.querySelector('.nickname');
        nickname.innerHTML = res.nickname;
        const tip = document.querySelector('.tip');
        tip.innerHTML = '你可以在任意网页双击查词';
        document.querySelector('.user-wrap').style.display = 'block';
    }
});
