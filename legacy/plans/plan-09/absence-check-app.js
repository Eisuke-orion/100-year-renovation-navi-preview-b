/* No analytics, network requests, accounts or personal-detail fields. */
(function () {
  'use strict';
  const root = document.getElementById('absence-check-app');
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const key = 'blr-absence-check-v1:' + location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const phases = {leave: '出発前', visit: '見回り', return: '帰宅前'};
  const tasks = {
    leave: [
      ['l-lock', '玄関・窓の戸締まり', '勝手口、浴室・トイレの小窓、2階の窓も確かめます。換気のためでも、窓は閉めて出かけましょう。'],
      ['l-outside', '合鍵・脚立などを片付ける', '屋外の合鍵を回収し、脚立やはしごを片付けます。見回りを頼む人には、鍵を直接渡しましょう。'],
      ['l-delivery', '郵便・新聞・定期便の受け取り方', '停止や回収を手配し、チラシの回収も頼みます。不在届で郵便物を預かってもらえるのは最長30日。長く空けるときは郵便局に相談しましょう。'],
      ['l-food', '食品・ごみ・冷蔵庫', '傷みやすい食品とごみを片付けます。冷蔵庫をどうするか決め、設備の説明書も確認しましょう。'],
      ['l-utilities', '電源・水道・ガス', '使い続ける設備と、止める設備を確認します。洗濯機の給水栓は閉め、使わない家電は説明書どおりに扱います。ガスメーターの操作は契約先に確認してください。'],
      ['l-next', '見回りの日と担当を決める', '見回りの日・担当者・鍵・異常時の連絡先を家族で確認します。マンションは、長期不在の届出方法も管理会社に聞いておきましょう。']
    ],
    visit: [
      ['v-outside', '家の外を見て、配達物を回収', '庭・外壁・窓・鍵を外から確認。こじ開けられた形跡があれば家に入らず、安全な場所から110番へ。屋根など高い場所の確認は業者に任せます。'],
      ['v-inside', '壁や天井の変化を見る', '染み、湿り、においを確かめます。写真は前回と同じ場所を撮ると見比べやすくなります。このアプリには写真を保存できません。'],
      ['v-air', '天候と安全を確かめて換気', '人がいる間に窓を開け、押入れにも風を通します。雨や強風で難しいときは無理をせず、「あとで確認」にして次の対応を相談しましょう。'],
      ['v-water', '水まわりを確かめる', '台所・洗面・浴室・トイレの漏れや湿りを確認。通水してよいか分からない場合は、設備の設定と管理方法を先に確認してください。'],
      ['v-close', '開けた窓を施錠し、設定を戻す', '水道・電源は、家族で決めた設定に戻します。玄関を閉めたあと、外もひと回りして確かめましょう。'],
      ['v-report', '家族へ報告する', '「変わりなし」でも、写真と一言を家族へ。異常があれば対応を相談し、次の見回り日を決めましょう。']
    ],
    return: [
      ['r-contract', '電気・水道・ガスの再開', '開始日と、立ち会いが必要かを確認します。止めていた契約がなければ「対象外」を選べます。'],
      ['r-equipment', '説明書を見ながら設備を試す', '水抜きした設備は、再び使う手順を説明書で確認します。水漏れや異音がないか、お湯や暖房が使えるかを確かめます。異常があれば使用を止め、相談してください。'],
      ['r-life', '冷蔵庫・トイレ・寝具の準備', '換気をして、帰宅した日から使えるように準備します。冷蔵庫を再び使うときは、機種の説明書に従ってください。'],
      ['r-route', '通り道・段差・夜の明かり', '玄関から寝室・トイレまでの通路を空けます。帰ってからの歩き方や暮らしに合わせ、必要なものを家族で確かめましょう。']
    ]
  };
  const ids = Object.values(tasks).flat().map((t) => t[0]);
  const defaults = () => ({version: 1, phase: 'leave', nextDate: '', water: 'unknown', fridge: 'unknown', checks: {}, cursors: {leave:0,visit:0,return:0}, savedAt: ''});
  let state = defaults();
  let dirty = false;
  let storageError = false;
  let notice = '';
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2000-01-01' || value > '2100-12-31') return false;
    const [y,m,d] = value.split('-').map(Number);
    const dt = new Date(y,m-1,d);
    return dt.getFullYear() === y && dt.getMonth() === m-1 && dt.getDate() === d;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== 1 || typeof saved.checks !== 'object' || saved.checks === null) throw new Error('invalid saved record');
      state.phase = Object.prototype.hasOwnProperty.call(phases, saved.phase) ? saved.phase : 'leave';
      state.water = ['unknown','usable','winterized'].includes(saved.water) ? saved.water : 'unknown';
      state.fridge = ['unknown','keep','off','none'].includes(saved.fridge) ? saved.fridge : 'unknown';
      state.nextDate = typeof saved.nextDate === 'string' && validDate(saved.nextDate) ? saved.nextDate : '';
      ids.forEach((id) => {if (['done','skip','later'].includes(saved.checks[id])) state.checks[id] = saved.checks[id];});
      Object.keys(phases).forEach((phase) => {const n = saved.cursors && saved.cursors[phase]; state.cursors[phase] = Number.isInteger(n) && n >= 0 && n <= tasks[phase].length ? n : 0;});
      state.savedAt = typeof saved.savedAt === 'string' && Number.isFinite(Date.parse(saved.savedAt)) ? saved.savedAt : '';
      notice = '保存した記録を読み込みました。';
    }
  } catch (e) {storageError = true; notice = '保存した記録を読み込めませんでした。今の画面ではチェックできます。必要な記録は別に控えてください。';}
  function count(phase) {
    const list = tasks[phase];
    const done = list.filter((t) => state.checks[t[0]] === 'done').length;
    const skip = list.filter((t) => state.checks[t[0]] === 'skip').length;
    return {done, skip, remaining: list.length - done - skip, total: list.length};
  }
  function description(task) {
    if (task[0] === 'l-food') {
      return '傷みやすい食品は使い切り、ごみは収集日に合わせて出します。' + ({unknown:'冷蔵庫を使い続けるか、止めるかも決めます。',keep:'冷蔵庫用の電源は残しておきます。',off:'冷蔵庫は食品・製氷用の水・氷を片付け、清掃して乾かします。止め方は説明書に従ってください。',none:'食品やごみが残っていないか確かめます。'}[state.fridge]);
    }
    if (task[0] === 'v-water') {
      return '台所・洗面・浴室・トイレで、漏れや湿りを確かめます。' + ({unknown:'水を流す前に、設備の設定と管理方法を確認してください。分かるまでは「あとで確認」にしておきましょう。',usable:'異常がなければ水を流し、排水の様子を見ながら排水トラップの水も補います。漏れや異常があれば通水を止め、相談してください。',winterized:'水抜き・止水中は、通常の通水をしないでください。凍結対策を崩さず、決めた管理方法と説明書に沿って確かめます。'}[state.water]);
    }
    return task[2];
  }
  function updateDate() {
    const el = $('ac-date-status');
    el.dataset.overdue = 'false';
    if (!state.nextDate) {el.textContent = 'まだ決まっていません'; return;}
    const now = new Date();
    const today = [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
    if (state.nextDate < today) {el.textContent = '予定日を過ぎています。次の予定を確認しましょう。'; el.dataset.overdue = 'true';}
    else if (state.nextDate === today) el.textContent = '今日が見回り予定日です';
    else el.textContent = new Date(state.nextDate + 'T12:00:00').toLocaleDateString('ja-JP',{month:'long',day:'numeric',weekday:'short'}) + ' に見回り予定';
  }
  function saveStatus() {
    const timestamp = state.savedAt ? new Date(state.savedAt).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
    $('ac-save-status').textContent = notice || (dirty ? '未保存の変更があります。ページを閉じたり再読み込みしたりすると消えます。' : timestamp ? '保存済み：' + timestamp : 'まだ保存していません。');
    $('ac-save-status').dataset.error = String(storageError);
  }
  function markDirty() {dirty = true; notice = ''; saveStatus();}
  function element(tag, text, className) {
    const el = document.createElement(tag); if(text) el.textContent = text; if(className) el.className = className; return el;
  }
  function button(text, action, className) {
    const el = element('button',text,className); el.type = 'button'; el.addEventListener('click',action); return el;
  }
  function goTo(index) {state.cursors[state.phase] = index; markDirty(); render(); const focus = $('ac-task-heading') || $('ac-results'); focus.focus({preventScroll:true}); focus.scrollIntoView({block:'nearest',behavior:'instant'});}
  function answer(task, status) {state.checks[task[0]] = status; goTo(state.cursors[state.phase] + 1);}
  function render() {
    root.querySelectorAll('[data-phase]').forEach((b) => {b.setAttribute('aria-pressed',String(b.dataset.phase === state.phase));});
    const c = count(state.phase);
    const index = state.cursors[state.phase];
    const atEnd = index >= tasks[state.phase].length;
    $('ac-step-label').textContent = phases[state.phase] + (atEnd ? 'の振り返り' : 'の確認　' + (index + 1) + ' / ' + c.total);
    $('ac-remaining').textContent = '残り ' + c.remaining + ' 項目';
    $('ac-progress').max = c.total; $('ac-progress').value = c.done + c.skip;
    $('ac-equipment-note').textContent = {unknown:'水道・凍結対策は未確認です。水を流してよい状態か、先に確かめてください。',usable:'水を流せる設定です。漏れや異常があれば通水を止め、相談してください。',winterized:'水抜き・止水中です。見回りのときも、決めた凍結対策・管理方法に従ってください。'}[state.water];
    const container = $('ac-task-list'); container.replaceChildren();
    container.hidden = atEnd; $('ac-results').hidden = !atEnd; $('ac-date-block').hidden = !atEnd;
    $('ac-previous').disabled = index === 0;
    $('ac-review').textContent = atEnd ? '最初の項目を見直す' : 'ここまでの確認を見る';
    if (atEnd) renderResults();
    else {
      const task = tasks[state.phase][index];
      const status = state.checks[task[0]] || 'pending';
      const card = element('div','', 'ac-task'); card.dataset.task = task[0]; card.dataset.status = status;
      const badge = element('p',{done:'✓ 確認済み',skip:'対象外',pending:'これから確認',later:'あとで確認'}[status] || 'これから確認','ac-task-state');
      const heading = element('h3',task[1]); heading.id = 'ac-task-heading'; heading.tabIndex = -1;
      const desc = element('p',description(task),'ac-task-description');
      card.append(badge,heading,desc);
      if (['l-utilities','v-water','r-equipment'].includes(task[0])) {
        const caution = element('div','', 'ac-caution');
        caution.append(element('strong','電源や水道は、まとめて止めないでください。'),element('p','24時間換気、防犯設備、給湯器の凍結予防などに電源が必要な場合があります。説明書と家ごとの管理方法を優先してください。'));
        const link = element('a','設備について記事で読む'); link.href = '#section-2'; caution.append(link); card.append(caution);
      }
      const actions = element('div','', 'ac-answer-actions');
      actions.append(button('✓ 確認した',() => answer(task,'done'),'ac-primary'),button('あとで確認',() => answer(task,'later')),button('この項目は対象外',() => answer(task,'skip'),'ac-skip'));
      card.append(actions,element('p','迷ったら「あとで確認」。','ac-small'));
      container.append(card);
    }
    updateDate(); saveStatus();
  }
  function renderResults() {
    const box = $('ac-results'); box.replaceChildren();
    const c = count(state.phase);
    const remaining = tasks[state.phase].filter((task) => !['done','skip'].includes(state.checks[task[0]]));
    const title = c.remaining === 0 ? (c.done ? 'この場面のチェックが終わりました。' : 'すべて「対象外」になっています。') : 'まだ確認していない項目';
    box.append(element('h3',title),element('p','確認済み ' + c.done + ' ／ 対象外 ' + c.skip + ' ／ 残り ' + c.remaining,'ac-result-count'));
    if (remaining.length) {
      box.append(element('p','残りは、家族や専門家に相談しながら確かめましょう。'));
      const list = element('ul','', 'ac-result-list');
      remaining.forEach((task) => {const item = element('li'); item.append(button(task[1] + ' →',() => goTo(tasks[state.phase].indexOf(task)))); list.append(item);}); box.append(list);
    } else box.append(element('p','「対象外」にした項目も、この家に当てはまらないか見直しておきましょう。'));
    const next = element('div','', 'ac-next-action');
    next.append(element('strong','次にすること'));
    let message;
    if (state.phase === 'return') message = '帰宅日と必要なものを家族に伝え、準備しましょう。異常があった設備は、使う前に専門家へ相談してください。';
    else if (!state.nextDate) message = '次の見回りは、誰がいつ行きますか？ 決まった日を下にメモできます。';
    else message = '次の見回り日を家族に伝え、担当者・鍵・連絡先も確かめておきましょう。';
    if (state.water === 'unknown') message += ' 水道・凍結対策は未確認です。水を流したり設備を動かしたりする前に、管理方法を確認してください。';
    if (state.water === 'winterized') message += ' 水抜き・止水中の設備は、管理方法も引き継いでください。';
    next.append(element('p',message)); box.append(next);
    const done = tasks[state.phase].filter((task) => ['done','skip'].includes(state.checks[task[0]]));
    if (done.length) {
      const detail = element('details','', 'ac-result-review'); detail.append(element('summary','確認済み・対象外を見直す'));
      const list = element('ul','', 'ac-result-list');
      done.forEach((task) => {const item = element('li'); item.append(button((state.checks[task[0]] === 'done' ? '✓ ' : '対象外：') + task[1],() => goTo(tasks[state.phase].indexOf(task)))); list.append(item);}); detail.append(list); box.append(detail);
    }
  }
  function syncInputs() {['water','fridge'].forEach((name) => {$('ac-' + name).value = state[name];}); $('ac-next-date').value = state.nextDate;}
  root.querySelectorAll('[data-phase]').forEach((button) => {button.addEventListener('click',() => {if(state.phase !== button.dataset.phase){state.phase = button.dataset.phase; markDirty(); render();}});});
  $('ac-previous').addEventListener('click',() => {goTo(Math.max(0,state.cursors[state.phase]-1));});
  $('ac-review').addEventListener('click',() => {goTo(state.cursors[state.phase] >= tasks[state.phase].length ? 0 : tasks[state.phase].length);});
  $('ac-next-date').addEventListener('change',(event) => {const value = event.target.value; if(value && !validDate(value)){event.target.setCustomValidity('2000年から2100年の有効な日付を選んでください。'); event.target.reportValidity(); return;} event.target.setCustomValidity(''); state.nextDate = value; markDirty(); updateDate(); if (state.cursors[state.phase] >= tasks[state.phase].length) renderResults();});
  ['water','fridge'].forEach((name) => {$('ac-' + name).addEventListener('change',(event) => {state[name] = event.target.value; (name === 'water' ? ['l-utilities','v-water','r-equipment'] : ['l-food','r-life']).forEach((id) => {delete state.checks[id];}); markDirty(); notice = '設定を変えたため、関係する項目は未確認に戻りました。変更を残すには保存してください。'; render();});});
  $('ac-save').addEventListener('click',() => {
    if (!$('ac-next-date').checkValidity()) {state.cursors[state.phase] = tasks[state.phase].length; render(); $('ac-next-date').reportValidity(); return;}
    try {const next = {...state,savedAt:new Date().toISOString()}; localStorage.setItem(key,JSON.stringify(next)); state = next; dirty = false; storageError = false; notice = ''; saveStatus();}
    catch(e){storageError = true; notice = 'このブラウザーでは保存できませんでした。画面のチェックは続けられます。必要な記録は別に控えてください。'; saveStatus();}
  });
  $('ac-reset-phase').addEventListener('click',() => {
    if(!window.confirm('「' + phases[state.phase] + '」のチェックと対象外をすべて未確認に戻します。ほかの場面・設備設定・次の予定日は残ります。やり直しますか？')) return;
    tasks[state.phase].forEach((task) => {delete state.checks[task[0]];}); state.cursors[state.phase] = 0; markDirty(); notice = 'この場面を未確認に戻しました。次の予定日も確かめて、変更を保存してください。'; render();
  });
  $('ac-delete').addEventListener('click',() => {
    if(!window.confirm('3つの場面のチェック、設備設定、予定日と、このアプリの保存データをすべて消します。元に戻せません。最初から始めますか？')) return;
    try{localStorage.removeItem(key);}catch(e){notice = '保存データを削除できませんでした。ブラウザーの設定を確認してください。今の記録は残しています。'; storageError = true; saveStatus(); return;}
    state = defaults(); dirty = false; storageError = false; $('ac-next-date').setCustomValidity(''); syncInputs(); notice = 'このアプリの保存データと画面の記録を消しました。'; render();
  });
  window.addEventListener('beforeunload',(event) => {if (dirty) {event.preventDefault(); event.returnValue = '';}});
  window.addEventListener('storage',(event) => {if(event.key === key){notice = '別のタブで保存データが変更されました。この画面を保存すると上書きされます。別のタブの記録を使う場合は、再読み込みしてください。'; saveStatus();}});
  syncInputs(); render(); $('ac-controls').hidden = false; $('ac-loading').hidden = true;
})();
