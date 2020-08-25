// ==UserScript==
// @name         网易云助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yin
// @match        https://music.163.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/1.8.5/layer.min.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  let musicUrl = '';
  ah.proxy({
    //请求发起前进入
    onRequest: (config, handler) => {
      console.log(config.url)
      handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
      console.log(err.type)
      handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
      console.log(response.response)
      try {
        let res = JSON.parse(response.response)
        if (res.data && res.data instanceof Array && res.data[0].url) {
          console.log(res.data[0].url)
          musicUrl = res.data[0].url
        }
      } catch (e) {
        console.log(e)
      } finally {
        handler.next(response)
      }

    }
  })
  class Iframe {
    context = null

    // 等待iframe 和 指定元素加载完成后返回 iframe 和 指定元素
    static loaded(selector) {
      return new Promise((resolve, reject) => {
        let time = 0;
        let interval = setInterval(() => {
          let iframe = document.querySelector('#g_iframe')
          if (iframe && time < 20) {
            let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            let btnWrap = innerDoc.querySelector(selector)
            if (btnWrap) {
              let obj = {
                document: innerDoc,
                element: btnWrap
              }
              setTimeout(() => { resolve(obj) }, 600)
              clearInterval(interval)
            }
          } else if (time >= 20) {
            reject()
            clearInterval(interval)
          }
          time += 1
        }, 1000)
      })
    }
  }

  class Doc {
    context = null

    static loaded(selector) {
      return new Promise((resolve, reject) => {
        let time = 0;
        let interval = setInterval(() => {
          let btnWrap = document.querySelector(selector)
          if (btnWrap && time < 20) {
            let obj = {
              document: btnWrap
            }
            setTimeout(() => { resolve(obj) }, 600)
            clearInterval(interval)
          } else if (time >= 20) {
            reject()
            clearInterval(interval)
          }
          time += 1
        }, 1000)
      })
    }
  }

  // 获取歌名列表，并复制到剪贴板
  function getCopyList(document) {
    let html = document.querySelectorAll('.m-table .ttc .txt a');
    let clone = []
    html.forEach(n => { clone.push(n.cloneNode(true)); });
    let textList = []
    clone.forEach(n => { n.querySelectorAll('.soil').forEach(s => s.parentNode.removeChild(s)); textList.push(n.innerText) });
    console.log(textList);
    return textList;
  }

  function copyToClipboard(value) {
    const input = document.createElement('input')
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', value)
    document.body.appendChild(input)
    input.select();
    let result = document.execCommand('copy')
    if (result) console.log('copy success')
    document.body.removeChild(input)
  }

  function download({url,name}) {
    let a = document.createElement('a')
    a.setAttribute('download', name)
    a.href = url;
    document.body.appendChild(a);
    a.click()
    document.body.removeChild(a)
  }

  let iframe = new Iframe()

  Iframe.loaded('#flag_play_addto_btn_wrapper').then(({ document, element }) => {
    iframe.context = document;
    element.insertAdjacentHTML('beforeend', `<a id="ex-copy" class="u-btni u-btni-dl" href="javascript:;" style="margin-top:14px" ><i>复制歌单</i></a>`)
    document.querySelector('#ex-copy').addEventListener('click', function(){copyToClipboard(getCopyList(document))})

  }).catch((e) => {
    console.log(e)
  })

  Doc.loaded('.m-playbar.m-playbar-lock').then(({document})=>{
    document.insertAdjacentHTML('beforeend', `<div style="position:absolute;right:0;top:-20px;width:100px;height:53px;"><a id="ex-music" href="javascript:;">下载</a></div>`)
    document.querySelector('#ex-music').addEventListener('click', function(){ download({url:musicUrl,name:''}) })
  }).catch((e) => {
    console.log(e)
  })
})();
