// ==UserScript==
// @name         网易云助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yin
// @match        https://music.163.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    class Iframe {
        context = null

        // 等待iframe 和 指定元素加载完成后返回 iframe 和 指定元素
        static loaded(selector) {
            return new Promise((resolve,reject)=>{
                let time = 0;
                let interval = setInterval(()=>{
                let iframe = document.querySelector('#g_iframe')
                if(iframe && time < 20) {
                    let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                    let btnWrap = innerDoc.querySelector(selector)
                    if(btnWrap){
                        let obj = {
                            document: innerDoc,
                            element: btnWrap
                        }
                        setTimeout(()=>{resolve(obj)},600)
                        clearInterval(interval)
                    }
                } else if(time >= 20) {
                    reject()
                    clearInterval(interval)
                }
                time += 1
                },1000)
              })
        }
        
    }

    // 获取歌名列表，并复制到剪贴板
    function getCopyList(document) {
      let html = document.querySelectorAll('.m-table .ttc .txt a');
      let clone = []
      html.forEach(n=>{clone.push(n.cloneNode(true));});
      let textList = []
      clone.forEach(n=>{n.querySelectorAll('.soil').forEach(s=>s.parentNode.removeChild(s));textList.push(n.innerText)});
      console.log(textList);
      return textList;
    }

    let iframe = new Iframe()

    Iframe.loaded('#flag_play_addto_btn_wrapper').then(({document,element})=>{
        iframe.context = document;
        element.insertAdjacentHTML('beforeend',`<a id="ex-copy" class="u-btni u-btni-dl" href="javascript:;" style="margin-top:14px" ><i>复制歌单</i></a>`)
        document.querySelector('#ex-copy').addEventListener('click', getCopyList(document))

        const input = document.createElement('input')
        input.setAttribute('readonly','readonly');
        input.setAttribute('value', getCopyList(iframe.context))
        iframe.context.body.appendChild(input)
        input.select();
        let result = document.execCommand('copy')
        if(result) console.log('copy success')
        iframe.context.body.removeChild(input)
    }).catch((e)=>{
        console.log(e)
    })

    
})();
