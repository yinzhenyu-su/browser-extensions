// ==UserScript==
// @name         网易云助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yin
// @match        https://music.163.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let innerDoc = null;
    let loaded = new Promise((resolve,reject)=>{
        let time = 0;
        let interval = setInterval(()=>{
        let iframe = document.querySelector('#g_iframe')
        if(iframe && time < 20) {
            let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            let btnWrap = innerDoc.querySelector("#flag_play_addto_btn_wrapper")
            if(btnWrap){
                let obj = {
                    document: innerDoc,
                    btnWrap: btnWrap
                }
                setTimeout(()=>{resolve(obj)},3000)
                clearInterval(interval)
            }
        } else if(time >= 20) {
            reject()
            clearInterval(interval)
        }
        time += 1
        },1000)
    })

    let copyList = ()=>{
      // 获取歌名列表，并复制到剪贴板
      let html = innerDoc.querySelector('.m-table .ttc .txt a');
      let clone = html.map(n=>n.cloneNode(true));
      copy(clone.map(n=>{n.querySelectorAll('.soil').forEach(s=>s.parentNode.removeChild(s));return n.innerText}))
    }

    loaded.then(({document,btnWrap})=>{
        innerDoc = document;
        btnWrap.insertAdjacentHTML('beforeend',`<a id="ex-copy" class="u-btni u-btni-dl" href="javascript:;" onclick="javascript:copyList()"><i>保存歌单</i></a>`)
    }).catch(()=>{
        console.log('not found')
    })

})();
