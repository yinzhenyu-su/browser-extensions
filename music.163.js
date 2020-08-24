// 获取歌名列表，并复制到剪贴板
let html = $$('.m-table .ttc .txt a');
let clone = html.map(n=>n.cloneNode(true));
copy(clone.map(n=>{n.querySelectorAll('.soil').forEach(s=>s.parentNode.removeChild(s));return n.innerText}))
