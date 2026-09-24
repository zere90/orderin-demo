const fmt = n => n.toLocaleString('ru-RU').replace(/,/g,' ') + ' ₸';
const PRODUCTS0 = [
  {id:'honey', name:'Honey cake (Medovik)', price:8500, stock:4, max:6},
  {id:'napo', name:'Napoleon cake', price:9000, stock:3, max:6},
  {id:'mac', name:'Macarons, box of 12', price:6000, stock:10, max:12},
  {id:'roll', name:'Cinnamon rolls, 6 pcs', price:3500, stock:2, max:10},
  {id:'chees', name:'Cheesecake slice', price:1800, stock:12, max:15}
];
const THREADS0 = [
  {id:'dana', name:'Dana K.', handle:'@dana.k', ch:'ig', color:'#B23A7A', time:'10:42', unread:true, kind:'order',
   msgs:[{f:'in',t:'Hi! Is the honey cake available for Saturday? 🙏',tm:'10:41'},{f:'in',t:'I need 1, delivery to Mangilik El 20, apt 45',tm:'10:42'}],
   ai:{items:[{p:'honey',q:1}], when:'Sat, 27 Sep', how:'Delivery · Mangilik El 20, apt 45', conf:96}},
  {id:'arman', name:'Arman', handle:'+7 701 ••• 45 67', ch:'wa', color:'#1F8A4C', time:'10:15', unread:true, kind:'order',
   msgs:[{f:'in',t:'Сәлеметсіз бе! 2 коробки макарон на завтра, заберу сам в 18:00',tm:'10:15'}],
   ai:{items:[{p:'mac',q:2}], when:'Thu, 25 Sep, 18:00', how:'Pickup', conf:93, lang:'Kazakh + Russian'}},
  {id:'madi', name:'Madi', handle:'@madi_art', ch:'ig', color:'#4B4FD6', time:'09:58', unread:true, kind:'question',
   msgs:[{f:'in',t:'How much is delivery to the Left Bank?',tm:'09:58'}],
   reply:'Hi Madi! Delivery to the Left Bank is 1 000 ₸, free for orders over 15 000 ₸. Would you like to order something?'},
  {id:'tomiris', name:'Tomiris B.', handle:'@tomiris.b', ch:'ig', color:'#A86B00', time:'Yesterday', unread:false, kind:'order',
   msgs:[{f:'in',t:'can I get a napoleon + 2 packs of cinnamon rolls on friday? will pick up',tm:'21:07'}],
   ai:{items:[{p:'napo',q:1},{p:'roll',q:2}], when:'Fri, 26 Sep', how:'Pickup', conf:91}},
  {id:'aigerim', name:'Aigerim', handle:'+7 747 ••• 12 09', ch:'wa', color:'#177A6B', time:'Yesterday', unread:false, kind:'feedback',
   msgs:[{f:'out',t:'Your Napoleon cake is on the way 🚗',tm:'16:02'},{f:'in',t:'Got it, it was delicious, thank you!!',tm:'19:30'}]}
];
let S;
function reset(){
  S = {tab:'inbox', open:null, filter:'all',
    products: structuredClone(PRODUCTS0), threads: structuredClone(THREADS0),
    orders:[{id:'A-1038', who:'Aigerim', ch:'wa', items:[{p:'napo',q:1}], status:'done', when:'Wed, 24 Sep'},
            {id:'A-1039', who:'Samal', ch:'ig', items:[{p:'chees',q:4}], status:'wait', when:'Thu, 25 Sep'}],
    seq:1040, revenue:{today:9000, base:9000}, aiHandled:7, progress:new Set()};
  render();
}
function P(id){return S.products.find(p=>p.id===id)}
function sum(items){return items.reduce((a,i)=>a+P(i.p).price*i.q,0)}
function mark(k){S.progress.add(k)}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>el.classList.remove('on'),2200)}
const chChip = ch => ch==='ig' ? '<span class="chip ch-ig">Instagram</span>' : '<span class="chip ch-wa">WhatsApp</span>';
const initials = n => n.split(' ').map(w=>w[0]).join('').slice(0,2);

function render(){
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected', b.dataset.tab===S.tab && !S.open ? 'true':'false'));
  const unread=S.threads.filter(t=>t.unread).length;
  const bi=document.getElementById('b-inbox'); bi.textContent=unread; bi.hidden=!unread;
  const pend=S.orders.filter(o=>o.status==='wait').length;
  const bo=document.getElementById('b-orders'); bo.textContent=pend; bo.hidden=!pend;
  const top=document.getElementById('topbar'), sc=document.getElementById('screen');
  if(S.open){ renderChat(top,sc) }
  else ({inbox:renderInbox,orders:renderOrders,stock:renderStock,today:renderToday})[S.tab](top,sc);
  // guide
  const order=['open','create','pay','stock','today']; let nowSet=false;
  document.querySelectorAll('#steps li').forEach(li=>{
    const k=li.dataset.k; li.className='';
    if(S.progress.has(k)) li.classList.add('done');
    else if(!nowSet){li.classList.add('now');nowSet=true}
  });
}
function renderInbox(top,sc){
  top.innerHTML=`<div><div class="t">Inbox</div><div class="sub">Aru Bakes · 2 channels connected</div></div><span class="chip ch-ai">AI on</span>`;
  const f=S.filter;
  const list=S.threads.filter(t=>f==='all'||(f==='orders'&&t.kind==='order'&&!t.done)||t.ch===f);
  sc.innerHTML=`<div class="filters">${[['all','All'],['orders','Orders only'],['ig','Instagram'],['wa','WhatsApp']].map(([k,l])=>`<button aria-pressed="${f===k}" data-f="${k}">${l}</button>`).join('')}</div>
  <div style="margin-top:8px">${list.map(t=>{
    const last=t.msgs[t.msgs.length-1];
    let tag='';
    if(t.done) tag=`<span class="chip ${t.done==='paid'?'ch-paid':'ch-wait'}">${t.done==='paid'?'Paid':'Awaiting payment'}</span>`;
    else if(t.kind==='order') tag='<span class="chip ch-new">AI: new order</span>';
    else if(t.kind==='question') tag=`<span class="chip ch-ai">${t.replied?'AI replied':'AI: question, reply ready'}</span>`;
    else tag='<span class="chip ch-mute">Feedback</span>';
    return `<button class="thread ${t.unread?'unread':''}" data-open="${t.id}">
      <div class="av" style="background:${t.color}">${initials(t.name)}</div>
      <div style="min-width:0"><div class="nm">${t.name}</div><div class="pv">${last.f==='out'?'You: ':''}${last.t}</div><div class="meta-row">${chChip(t.ch)}${tag}</div></div>
      <div class="tm">${t.time}</div></button>`}).join('') || '<p class="empty">Nothing here.</p>'}</div>`;
  sc.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{S.filter=b.dataset.f;render()});
  sc.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{const t=S.threads.find(x=>x.id===b.dataset.open);t.unread=false;S.open=t.id;if(t.id==='dana')mark('open');render();sc.scrollTop=0});
}
function renderChat(top,sc){
  const t=S.threads.find(x=>x.id===S.open);
  top.innerHTML=`<div style="display:flex;align-items:center"><button class="back" aria-label="Back to inbox" id="back">‹</button><div><div class="t" style="font-size:18px">${t.name}</div><div class="sub">${t.handle}</div></div></div>${chChip(t.ch)}`;
  let h=`<div class="msgs">`+t.msgs.map(m=>m.sys?`<div class="sys">${m.t}</div>`:`<div class="b ${m.f}">${m.t}<small>${m.tm}</small></div>`).join('');
  if(t.kind==='order' && !t.done){
    const a=t.ai, tot=sum(a.items);
    const short=a.items.filter(i=>P(i.p).stock<i.q);
    h+=`<div class="aicard" aria-label="AI detected order">
      <div class="hd"><strong>Order detected</strong><span class="chip ch-ai">AI · ${a.conf}% sure</span></div>
      ${a.lang?`<div class="conf">Understood from ${a.lang}</div>`:''}
      <div class="items">${a.items.map((i,ix)=>`<div class="it"><span>${P(i.p).name}</span><div class="qty"><button data-q="${ix}" data-d="-1" aria-label="Less">−</button><span>${i.q}</span><button data-q="${ix}" data-d="1" aria-label="More">+</button></div><span class="amt">${fmt(P(i.p).price*i.q)}</span></div>`).join('')}</div>
      <dl class="kv"><dt>When</dt><dd>${a.when}</dd><dt>How</dt><dd>${a.how}</dd></dl>
      ${short.map(i=>`<div class="warn">Only ${P(i.p).stock} ${P(i.p).name} left in stock</div>`).join('')}
      <div class="total"><span>Total</span><span>${fmt(tot)}</span></div>
      <button class="btn" id="create">Create order and send Kaspi payment link</button>
    </div>`;
  }
  if(t.done==='wait'){
    h+=`<div class="aicard"><div class="hd"><strong>Order ${t.orderId}</strong><span class="chip ch-wait">Awaiting payment</span></div>
      <div class="conf">Stock is reserved. OrderIN will mark the order as paid when the Kaspi payment arrives.</div>
      <button class="btn ok" id="paid">Customer paid (simulate)</button></div>`;
  }
  if(t.kind==='question' && !t.replied){
    h+=`<div class="aicard"><div class="hd"><strong>Suggested reply</strong><span class="chip ch-ai">AI draft</span></div>
      <div style="font-size:14px">${t.reply}</div>
      <div class="row2"><button class="btn sec" id="edit">Edit</button><button class="btn" id="send">Send</button></div></div>`;
  }
  h+='</div>';
  sc.innerHTML=h;
  top.querySelector('#back').onclick=()=>{S.open=null;render()};
  sc.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const it=t.ai.items[+b.dataset.q];it.q=Math.max(1,it.q+ +b.dataset.d);render()});
  const c=sc.querySelector('#create'); if(c) c.onclick=()=>createOrder(t);
  const p=sc.querySelector('#paid'); if(p) p.onclick=()=>payOrder(S.orders.find(o=>o.id===t.orderId));
  const s=sc.querySelector('#send'); if(s) s.onclick=()=>{t.msgs.push({f:'out',t:t.reply,tm:'now'});t.replied=true;S.aiHandled++;toast('Reply sent to Instagram');render()};
  const e=sc.querySelector('#edit'); if(e) e.onclick=()=>toast('In the full app you can edit the draft before sending');
  sc.scrollTop=sc.scrollHeight;
}
function createOrder(t){
  const id='A-'+(S.seq++); const tot=sum(t.ai.items);
  S.orders.unshift({id, who:t.name, ch:t.ch, items:structuredClone(t.ai.items), status:'wait', when:t.ai.when, thread:t.id});
  t.done='wait'; t.orderId=id;
  t.msgs.push({f:'out',t:`Thank you! Your order ${id}: ${t.ai.items.map(i=>P(i.p).name+' × '+i.q).join(', ')}. Total ${fmt(tot)}.<br>Pay with Kaspi: <span class="link">orderin.demo/pay/${id}</span>`,tm:'now'});
  t.msgs.push({sys:true,t:'Payment link sent · stock reserved'});
  S.aiHandled++; if(t.id==='dana') mark('create');
  toast(`Order ${id} created, link sent`); render();
}
function payOrder(o){
  if(!o||o.status!=='wait') return;
  o.status='paid';
  o.items.forEach(i=>{P(i.p).stock=Math.max(0,P(i.p).stock-i.q)});
  const tot=sum(o.items); S.revenue.today+=tot;
  const t=S.threads.find(x=>x.id===o.thread);
  if(t){t.done='paid';t.msgs.push({sys:true,t:`Kaspi payment received · ${fmt(tot)}`});t.msgs.push({f:'out',t:'Payment received, thank you! We will message you when it is ready 🎂',tm:'now'});}
  if(o.thread==='dana') mark('pay');
  toast(`Payment received: ${fmt(tot)}`); render();
}
function renderOrders(top,sc){
  top.innerHTML=`<div><div class="t">Orders</div><div class="sub">Created from chats, no manual typing</div></div>`;
  const groups=[['wait','Awaiting payment','ch-wait'],['paid','Paid, to prepare','ch-paid'],['done','Delivered','ch-mute']];
  sc.innerHTML=groups.map(([k,l,c])=>{
    const os=S.orders.filter(o=>o.status===k);
    return `<div class="sec-h"><span>${l}</span><span>${os.length}</span></div>`+(os.length?os.map(o=>`<div class="card">
      <div class="top"><span class="who">${o.who} · ${o.id}</span><span class="num">${fmt(sum(o.items))}</span></div>
      <div class="what">${o.items.map(i=>P(i.p).name+' × '+i.q).join(', ')}</div>
      <div class="meta-row">${chChip(o.ch)}<span class="chip ${c}">${l}</span><span class="chip ch-mute">${o.when}</span></div>
      ${k==='wait'?`<div class="acts"><button class="btn ok" data-pay="${o.id}">Mark as paid</button><button class="btn sec" data-remind="${o.id}">Send reminder</button></div>`:''}
      ${k==='paid'?`<div class="acts"><button class="btn sec" data-done="${o.id}">Mark delivered</button></div>`:''}
    </div>`).join(''):'<p class="empty">No orders.</p>');
  }).join('');
  sc.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>payOrder(S.orders.find(o=>o.id===b.dataset.pay)));
  sc.querySelectorAll('[data-remind]').forEach(b=>b.onclick=()=>toast('Payment reminder sent'));
  sc.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{S.orders.find(o=>o.id===b.dataset.done).status='done';toast('Marked as delivered');render()});
}
function renderStock(top,sc){
  if(S.progress.has('pay')) mark('stock');
  top.innerHTML=`<div><div class="t">Stock</div><div class="sub">Updates when an order is paid</div></div>`;
  sc.innerHTML=`<div class="sec-h"><span>Products</span><span>in stock</span></div>`+S.products.map(p=>{
    const r=p.stock/p.max, cls=p.stock===0?'out':p.stock<=2?'low':'';
    return `<div class="card stock"><div><div class="nm">${p.name}</div><div class="pr">${fmt(p.price)}</div></div>
      <div class="qty"><button data-s="${p.id}" data-d="-1" aria-label="Less ${p.name}">−</button><span>${p.stock}</span><button data-s="${p.id}" data-d="1" aria-label="More ${p.name}">+</button></div>
      <div class="bar ${cls}"><i style="width:${Math.max(4,r*100)}%"></i></div>
      ${p.stock===0?'<span class="chip ch-new">Sold out · AI tells customers</span>':p.stock<=2?'<span class="chip ch-wait">Low stock</span>':''}</div>`}).join('')+
    `<div class="insight"><b>AI tip:</b> Cinnamon rolls sold out 3 times this month. Baking 4 more packs on Fridays could add about 14 000 ₸ a week.</div>`;
  sc.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const p=P(b.dataset.s);p.stock=Math.max(0,p.stock+ +b.dataset.d);render()});
}
function renderToday(top,sc){
  mark('today');
  top.innerHTML=`<div><div class="t">Today</div><div class="sub">Thursday, 24 September</div></div>`;
  const paid=S.orders.filter(o=>o.status!=='wait').length, wait=S.orders.filter(o=>o.status==='wait');
  const week=[42,38,55,47,61,72, S.revenue.today/1000];
  const days=['Fri','Sat','Sun','Mon','Tue','Wed','Today'];
  const max=80, W=320, H=130, bw=30, gap=(W-7*bw)/6;
  const bars=week.map((v,i)=>{const h=v/max*(H-22);const x=i*(bw+gap);return `<rect x="${x}" y="${H-20-h}" width="${bw}" height="${h}" rx="5" fill="${i===6?'var(--accent)':'var(--line)'}"/><text x="${x+bw/2}" y="${H-5}" text-anchor="middle" font-size="10" fill="var(--ink-3)" font-family="Figtree, sans-serif">${days[i]}</text>`}).join('');
  sc.innerHTML=`<div class="kpis">
    <div class="kpi hero"><div class="l">Paid today</div><div class="v">${fmt(S.revenue.today)}</div><div class="s">${paid} paid orders</div></div>
    <div class="kpi"><div class="l">Awaiting payment</div><div class="v">${fmt(wait.reduce((a,o)=>a+sum(o.items),0))}</div><div class="s">${wait.length} orders</div></div>
    <div class="kpi"><div class="l">Messages sorted by AI</div><div class="v">${S.aiHandled}</div><div class="s">≈ ${Math.round(S.aiHandled*4)} min saved</div></div>
  </div>
  <div class="chart"><div class="sec-h" style="padding:0 0 8px"><span>Sales, thousand ₸</span><span>last 7 days</span></div>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sales for the last 7 days">${bars}</svg></div>
  <div class="insight"><b>AI summary:</b> 3 chats were orders, 1 was a delivery question. No messages left unanswered today. Samal has not paid order A-1039 for 20 hours; a reminder is recommended.</div>`;
}
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{S.open=null;S.tab=b.dataset.tab;render();document.getElementById('screen').scrollTop=0});
document.getElementById('reset').onclick=()=>{reset();toast('Demo reset')};
reset();
