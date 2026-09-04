const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('fa-IR').format(Math.round(Number(n)||0));
function calc(){
 const contract=+$('contract').value||0, spent=+$('spent').value||0, rem=+$('remaining').value||0;
 const progress=+$('progress').value||0, budget=+$('budget').value||0;
 const final=spent+rem, profit=contract-final, budgetUse=budget?spent/budget*100:0;
 $('profit').textContent=fmt(profit);
 $('cash').textContent=fmt(+$('cashInput').value||0);
 $('loan').textContent=fmt(+$('loanInput').value||0);
 $('receivable').textContent=fmt(+$('receivableInput').value||0);
 $('forecast').innerHTML=`هزینه نهایی پیش‌بینی‌شده: <b>${fmt(final)}</b> تومان<br>
 سود/زیان پیش‌بینی‌شده: <b>${fmt(profit)}</b> تومان<br>
 مصرف بودجه: <b>${fmt(budgetUse)}٪</b> در برابر پیشرفت فیزیکی <b>${fmt(progress)}٪</b>`;
 const alerts=[];
 if(final>budget) alerts.push(`<div class="warning">🟠 احتمال افزایش هزینه: ${fmt(final-budget)} تومان</div>`);
 if(budgetUse>progress+5) alerts.push(`<div class="warning">⚠️ هزینه پروژه نسبت به پیشرفت فیزیکی بیشتر است.</div>`);
 if(profit<0) alerts.push(`<div class="danger">🔴 پروژه در برآورد فعلی زیان‌ده است.</div>`);
 if(!alerts.length) alerts.push(`<div class="ok">🟢 وضعیت هزینه و پیشرفت فعلاً مناسب است.</div>`);
 $('alerts').innerHTML=alerts.join('');
 const cash=+$('cashInput').value||0, income=+$('income').value||0, loan=+$('loanInput').value||0;
 const future=+$('futurePay').value||0, rec=+$('receivableInput').value||0, debt=+$('debt').value||0;
 const available=cash+income+loan+rec, need=future+debt, gap=need-available;
 $('cashflow').innerHTML=gap>0?`🔴 احتمال کمبود نقدینگی: <b>${fmt(gap)}</b> تومان`
 :`🟢 کسری نقدینگی پیش‌بینی نمی‌شود. مازاد احتمالی: <b>${fmt(-gap)}</b> تومان`;
 localStorage.setItem('accountingData',JSON.stringify([...document.querySelectorAll('input')].map(x=>[x.id,x.value])));
}
function load(){try{JSON.parse(localStorage.getItem('accountingData')||'[]').forEach(([id,v])=>{if($(id))$(id).value=v})}catch(e){}calc()}
document.querySelectorAll('input').forEach(x=>x.addEventListener('input',calc));
function addProject(){
 const name=prompt('نام پروژه را وارد کنید:'); if(!name)return;
 const p=document.createElement('div');p.className='project';
 p.innerHTML=`<strong>🏗️ ${name}</strong><span>پروژه فعال</span><div class="bar"><i style="width:0%"></i></div>`;
 $('projects').appendChild(p);
}
let deferred;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('installBtn').hidden=false});
$('installBtn').onclick=async()=>{if(deferred){deferred.prompt();deferred=null}};
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
load();
