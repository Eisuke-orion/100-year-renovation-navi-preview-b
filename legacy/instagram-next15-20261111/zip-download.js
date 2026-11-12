(()=>{'use strict';const assetVersion='20261113-mortgage-r8-5';const assetUrl=p=>p+(p.includes('?')?'&':'?')+'v='+encodeURIComponent(assetVersion);
const encoder=new TextEncoder();const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
const crc32=bytes=>{let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
const header=(size,fields)=>{const b=new Uint8Array(size),v=new DataView(b.buffer);for(const [offset,value,width]of fields){if(width===2)v.setUint16(offset,value,true);else v.setUint32(offset,value,true);}return b;};
window.RNAVI_NEXT_CREATE_ZIP=async id=>{
const post=window.RNAVI_NEXT15.find(p=>p.id===id);if(!post)throw Error('対象の投稿が見つかりません。');
const entries=[];for(const page of post.pages){const r=await fetch(assetUrl(page.image));if(!r.ok)throw Error('画像を取得できませんでした。再読み込みしてお試しください。');entries.push({name:post.episode_label+'-'+String(page.page).padStart(2,'0')+'.png',bytes:new Uint8Array(await r.arrayBuffer())});}
entries.push({name:post.episode_label+'-caption.txt',bytes:encoder.encode(post.caption)});
const parts=[],central=[];let offset=0,centralSize=0;
for(const entry of entries){const name=encoder.encode(entry.name),bytes=entry.bytes,crc=crc32(bytes);const local=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x0800,2],[14,crc,4],[18,bytes.length,4],[22,bytes.length,4],[26,name.length,2]]);parts.push(local,name,bytes);const dir=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x0800,2],[16,crc,4],[20,bytes.length,4],[24,bytes.length,4],[28,name.length,2],[42,offset,4]]);central.push(dir,name);offset+=30+name.length+bytes.length;centralSize+=46+name.length;}
const end=header(22,[[0,0x06054b50,4],[8,entries.length,2],[10,entries.length,2],[12,centralSize,4],[16,offset,4]]);return new Blob([...parts,...central,end],{type:'application/zip'});
};
document.addEventListener('click',async e=>{const a=e.target.closest('a[href^="#zip="]');if(!a)return;e.preventDefault();if(a.dataset.busy)return;const id=a.getAttribute('href').slice(5),old=a.textContent;a.dataset.busy='true';a.setAttribute('aria-busy','true');a.textContent='ZIPを準備中…';try{const blob=await window.RNAVI_NEXT_CREATE_ZIP(id);const post=window.RNAVI_NEXT15.find(p=>p.id===id),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`Instagram-${post.episode_label}.zip`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);a.textContent=old;}catch(error){a.textContent='保存に失敗しました。もう一度お試しください。';console.error(error.message);}finally{delete a.dataset.busy;a.removeAttribute('aria-busy');}});
})();
