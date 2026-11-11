(function(){'use strict';
const tool=document.getElementById('home-compare-tool');if(!tool)return;
const form=document.getElementById('hc-form'),summary=document.getElementById('hc-summary'),status=document.getElementById('hc-status');let edited=false;
const val=id=>document.getElementById('hc-'+id).value;
function build(){const trouble=val('trouble'),priority=val('priority'),lines=['【家族で大切にしたいこと】','減らしたい不便：'+trouble,'残したい暮らし・優先すること：'+priority,'費用を比べる期間：'+val('years'),''];
for(const [key,title]of [['stay','住み続けてリフォーム'],['move','住み替え']]){lines.push('【'+title+'】','不便は減る？：'+val(key+'-ease'),'残したい暮らしは続く？：'+val(key+'-life'),'実現できるか：'+val(key+'-feasible'),'費用の確認：'+val(key+'-cost'));if(val(key+'-feasible')!=='専門家・現地で確認済み')lines.push('次に：'+(key==='stay'?'施工店へ構造・配管・管理規約や傷みを確認し、希望の改修と必要な補修を分けて相談する。':'候補の住まいの状態・契約条件と、普段の移動経路を現地で確認する。'));if(val(key+'-cost')!=='初期・毎月毎年・将来の費用を確認済み')lines.push('費用：'+(key==='stay'?'工事・仮住まい・荷物移動、税・保険・返済、今後の補修を同じ期間で整理する。':'購入／賃貸の初期費用・引っ越し、家賃／返済・税・保険・管理費、今後の補修を同じ期間で整理する。'));lines.push('');}
lines.push('【次の一歩】');if(trouble.includes('場所')||trouble.includes('両方'))lines.push('候補地で買い物や通院の往復を試す。今の家に残る場合も、移動の負担を減らす方法を調べる。');else if(trouble.includes('家の中'))lines.push('今の家で不便を減らせる改修を相談し、候補の住まいにも同じ条件を当てはめる。');else if(trouble.includes('管理'))lines.push('使う範囲を絞る改修と、小さな住まいへの転居で、管理の負担を比べる。');else lines.push('最近負担だった一場面と、続けたい楽しみを家族で一つずつ挙げる。');
const checks=[...form.querySelectorAll('input[name="hc-check"]:checked')];if(checks.length){lines.push('相談・見学で確認すること：');checks.forEach(x=>lines.push('・'+x.value));}else lines.push('まず確認したいことを一つ選び、相談先や見学日を決める。');
lines.push('','費用メモ：借入分の工事・購入代金と返済額を二重に足さない。売却は残債・諸費用を引いた手取り見込みと支払時期も確認する。','※選択内容を整理したメモです。可否・安全性・費用を判定するものではありません。');return lines.join('\n');}
function update(){if(edited){status.textContent='選択を変更しました。メモの編集内容は保持しています。反映する場合は「選択内容からメモを作り直す」を押してください。';return;}summary.value=build();status.textContent='選択内容を比較メモに反映しました。';}
form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('change',e=>{if(e.target!==summary)update();});summary.addEventListener('input',()=>{edited=true;status.textContent='メモを編集中です。以降の選択変更では、この文章を上書きしません。';});
document.getElementById('hc-refresh').addEventListener('click',()=>{if(edited&&!window.confirm('編集したメモを、現在の選択内容で上書きしますか？'))return;edited=false;update();});
document.getElementById('hc-reset').addEventListener('click',()=>{if(!window.confirm('選択内容と編集したメモをすべてリセットしますか？'))return;form.reset();edited=false;update();status.textContent='入力をリセットしました。';document.getElementById('hc-trouble').focus();});
function preparePrint(){document.getElementById('hc-print-text').textContent=summary.value;document.body.classList.add('hc-print-mode');let node=tool;while(node&&node!==document.body){const parent=node.parentElement;if(!parent)break;parent.classList.add('hc-print-ancestor');for(const sibling of parent.children){if(sibling!==node)sibling.classList.add('hc-print-hide');}node=parent;}}
function clearPrint(){document.body.classList.remove('hc-print-mode');document.querySelectorAll('.hc-print-hide,.hc-print-ancestor').forEach(x=>x.classList.remove('hc-print-hide','hc-print-ancestor'));}
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',clearPrint);document.getElementById('hc-print').addEventListener('click',()=>{preparePrint();window.print();});update();
})();
