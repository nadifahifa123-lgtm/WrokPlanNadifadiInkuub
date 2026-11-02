(() => {
'use strict';
const base = window.WORKPLAN_DATA;
const cached = localStorage.getItem('nadifa-workplan-draft-v1');
let data;
try { data = cached ? JSON.parse(cached) : structuredClone(base); if (!Array.isArray(data.tasks) || data.tasks.length !== base.tasks.length) data=structuredClone(base); }
catch { data = structuredClone(base); }
let editing=false, selectedDay='2026-11-02', editingId=null;
const $ = id=>document.getElementById(id);
const statuses=['Belum dimulai','Dalam proses','Selesai','Terhambat'];
const dates=['2026-11-02','2026-11-03','2026-11-04','2026-11-05','2026-11-06','2026-11-07'];
const dayNames=['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validUrl = u=>{try{const x=new URL(u);return ['https:','http:'].includes(x.protocol)?x.href:'';}catch{return ''}};
const tag = s=> s==='Selesai'?'s-done':s==='Dalam proses'?'s-doing':s==='Terhambat'?'s-blocked':'s-todo';
function persist(){localStorage.setItem('nadifa-workplan-draft-v1',JSON.stringify(data)); $('saveStatus').textContent='Perubahan disimpan lokal; ekspor dan commit agar bos dapat melihatnya.';}
function render(){
 const ts=data.tasks, count=s=>ts.filter(t=>t.status===s).length, done=count('Selesai'), pct=Math.round(done/ts.length*100);
 $('total').textContent=ts.length; $('done').textContent=done; $('doing').textContent=count('Dalam proses'); $('blocked').textContent=count('Terhambat'); $('pct').textContent=pct+'%'; $('bar').style.width=pct+'%';
 const todoP1=ts.filter(t=>t.priority==='P1' && t.status!=='Selesai').slice(0,4);
 $('attention').innerHTML=todoP1.length?todoP1.map(t=>`<div class="attention-item"><b>${esc(t.date.slice(8))} Nov</b>${esc(t.title)}</div>`).join(''):'<p class="muted">Semua pekerjaan P1 selesai.</p>';
 $('days').innerHTML=dates.map((d,i)=>{const a=ts.filter(t=>t.date===d);const k=a.filter(t=>t.status==='Selesai').length;return `<button class="day ${selectedDay===d?'active':''}" data-day="${d}"><small>${dayNames[i]}</small><b>${d.slice(8)}</b><small>${k}/${a.length} selesai</small></button>`}).join('');
 const current=ts.filter(t=>t.date===selectedDay), n=current.filter(t=>t.status==='Selesai').length;
 $('daySummary').innerHTML=`<strong>${dayNames[dates.indexOf(selectedDay)]}, ${selectedDay.slice(8)} November 2026</strong> — ${current.length} agenda, ${n} selesai. <br>${current.map(t=>`• ${esc(t.title)}`).join('<br>')}`;
 const search=$('search').value.toLowerCase(), df=$('dateFilter').value, cf=$('categoryFilter').value, sf=$('statusFilter').value;
 const filtered=ts.filter(t=>(!df||t.date===df)&&(!cf||t.category===cf)&&(!sf||t.status===sf)&&(!search||[t.title,t.output,t.note,t.category].join(' ').toLowerCase().includes(search)));
 $('count').textContent=filtered.length+' tugas';
 $('taskRows').innerHTML=filtered.map(t=>`<tr><td>${esc(t.date.slice(8))} Nov</td><td><div class="tasktitle">${esc(t.title)}</div><div class="taskoutput">Output: ${esc(t.output)}</div>${t.note?`<div class="tasknote">Catatan: ${esc(t.note)}</div>`:''}</td><td>${esc(t.category)}</td><td><span class="pill ${t.priority.toLowerCase()}">${esc(t.priority)}</span></td><td><span class="pill ${tag(t.status)}">${esc(t.status)}</span></td><td>${validUrl(t.proof)?`<a class="link" target="_blank" rel="noopener noreferrer" href="${esc(validUrl(t.proof))}">Buka bukti ↗</a>`:'<span class="muted">—</span>'}</td><td class="editOnly"><button class="smallbtn" data-edit="${t.id}">Ubah</button></td></tr>`).join('')||'<tr><td colspan="7">Tidak ada tugas untuk filter ini.</td></tr>';
 const groups=[...new Set(ts.map(t=>t.category))], sums=groups.map(g=>{const a=ts.filter(t=>t.category===g);return `<li><b>${esc(g)}</b>: ${a.filter(t=>t.status==='Selesai').length}/${a.length} selesai; ${a.filter(t=>t.status==='Dalam proses').length} proses; ${a.filter(t=>t.status==='Terhambat').length} terhambat.</li>`}).join('');
 $('reportBody').innerHTML=`<p><b>Periode:</b> 2–7 November 2026 · <b>Total:</b> ${ts.length} agenda · <b>Selesai:</b> ${done} (${pct}%) · <b>Dalam proses:</b> ${count('Dalam proses')} · <b>Terhambat:</b> ${count('Terhambat')}.</p><h3>Progres per bidang</h3><ul>${sums}</ul><p><b>Kendala yang tercatat:</b> ${ts.filter(t=>t.status==='Terhambat').length?ts.filter(t=>t.status==='Terhambat').map(t=>esc(t.title)+(t.note?' — '+esc(t.note):'')).join('; '):'Belum ada tugas berstatus Terhambat.'}</p><p><b>Catatan:</b> Ini merupakan laporan status berdasarkan input aktual pengguna, bukan verifikasi otomatis atas pekerjaan.</p>`;
 document.querySelectorAll('[data-day]').forEach(el=>el.onclick=()=>{selectedDay=el.dataset.day;render()});
 document.querySelectorAll('[data-edit]').forEach(el=>el.onclick=()=>openEditor(Number(el.dataset.edit)));
}
function openEditor(id){if(!editing)return;editingId=id;const t=data.tasks.find(x=>x.id===id);$('eTitle').value=t.title;$('eOutput').value=t.output;$('eStatus').value=t.status;$('ePriority').value=t.priority;$('eNote').value=t.note||'';$('eProof').value=t.proof||'';$('editor').showModal();}
$('editBtn').onclick=()=>{editing=!editing;document.body.classList.toggle('editing',editing);$('editBtn').textContent=editing?'✓ Selesai Mengedit':'✎ Mode Edit';render();};
$('editForm').onsubmit=e=>{e.preventDefault();const proof=$('eProof').value.trim();if(proof&&!validUrl(proof)){alert('Gunakan tautan http:// atau https:// yang valid.');return;}const t=data.tasks.find(x=>x.id===editingId);Object.assign(t,{title:$('eTitle').value.trim(),output:$('eOutput').value.trim(),status:$('eStatus').value,priority:$('ePriority').value,note:$('eNote').value.trim(),proof});data.updated=new Date().toISOString().slice(0,10);persist();$('editor').close();render();};
$('closeModal').onclick=$('cancelModal').onclick=()=>$('editor').close();
$('printBtn').onclick=()=>window.print();
$('exportBtn').onclick=()=>{const blob=new Blob(['// Data diperbarui dari dashboard Nadifa.\nwindow.WORKPLAN_DATA = '+JSON.stringify(data,null,2)+';\n'],{type:'text/javascript;charset=utf-8'});const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download='data.js';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('resetBtn').onclick=()=>{if(confirm('Hapus seluruh perubahan lokal dan kembali ke data yang diterbitkan?')){localStorage.removeItem('nadifa-workplan-draft-v1');data=structuredClone(base);render();$('saveStatus').textContent='Kembali ke versi publik.';}};
$('copyReport').onclick=async()=>{const lines=[`LAPORAN NADIFA | ${data.period}`,`Selesai: ${data.tasks.filter(t=>t.status==='Selesai').length}/${data.tasks.length}`,...data.tasks.map(t=>`${t.date} | ${t.category} | ${t.status} | ${t.title}${t.note?' | '+t.note:''}${t.proof?' | '+t.proof:''}`)];try{await navigator.clipboard.writeText(lines.join('\n'));$('copyReport').textContent='Tersalin ✓';}catch{alert('Clipboard tidak tersedia di browser ini.');}};
$('dateFilter').innerHTML+=[...dates].map((d,i)=>`<option value="${d}">${dayNames[i]}, ${d.slice(8)} Nov</option>`).join('');
$('categoryFilter').innerHTML+=[...new Set(data.tasks.map(t=>t.category))].map(s=>`<option>${esc(s)}</option>`).join('');
['search','dateFilter','categoryFilter','statusFilter'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
render();
})();
