'use strict';
let language = 'zh';
const langButton = document.getElementById('language');
const interestDialog = document.getElementById('interest-dialog');
const privacyDialog = document.getElementById('privacy-dialog');
const form = document.getElementById('interest-form');
const result = document.querySelector('.form-result');
function setLanguage(next) {
  language = next;
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach(el => {el.innerHTML = el.dataset[next];});
  langButton.textContent = next === 'zh' ? 'EN ↗' : '中文 ↗';
  langButton.setAttribute('aria-label', next === 'zh' ? 'Switch to English' : '切换至中文');
  document.title = next === 'zh' ? '全球女性领导力论坛 · Global Women’s Leadership Forum' : 'Global Women’s Leadership Forum · 全球女性领导力论坛';
  document.querySelector('nav').setAttribute('aria-label', next === 'zh' ? '主导航' : 'Main navigation');
  document.querySelector('.brand').setAttribute('aria-label', next === 'zh' ? '全球女性领导力论坛首页' : 'Global Women’s Leadership Forum home');
  document.querySelector('.hero-art').setAttribute('aria-label', next === 'zh' ? '环绕地球的交织轨道，象征跨越边界的对话' : 'Interwoven orbits around the earth representing dialogue across borders');
  document.querySelector('.filters').setAttribute('aria-label', next === 'zh' ? '筛选活动' : 'Filter gatherings');
  document.querySelectorAll('.event-cta button').forEach((button,i) => button.setAttribute('aria-label', next === 'zh' ? (i ? '了解线上 Webinar 参与意向' : '了解线下圆桌参与意向') : (i ? 'Express interest in a webinar' : 'Express interest in a roundtable')));
  document.querySelectorAll('.close-dialog').forEach(button => button.setAttribute('aria-label', next === 'zh' ? '关闭对话框' : 'Close dialog'));
  document.querySelector('.menu').setAttribute('aria-label', next === 'zh' ? '展开导航' : 'Toggle navigation');
  result.textContent = '';
}
langButton.addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh'));
const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  const open = document.querySelector('nav').classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => {
  document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active', b === button);b.setAttribute('aria-pressed',String(b === button));});
  document.querySelectorAll('[data-format]').forEach(card => {card.hidden = button.dataset.filter !== 'all' && card.dataset.format !== button.dataset.filter;});
}));
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.open === 'privacy') {privacyDialog.showModal();return;}
  form.elements.interest.value = button.dataset.open;
  result.textContent = '';
  interestDialog.showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click', event => {if(event.target === dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
});
interestDialog.addEventListener('close', () => {form.reset();result.textContent = '';});
form.addEventListener('submit', event => {
  event.preventDefault();
  if(!form.reportValidity())return;
  const data = new FormData(form);
  const selected = form.elements.interest.selectedOptions[0].textContent;
  const labels = language === 'zh' ? ['全球女性领导力论坛 — 参与意向单','姓名','邮箱','机构 / 领域','参与方向','议题 / 留言','此文件由本人保存，尚未发送至主办方。正式报名尚未开放。'] : ['Global Women’s Leadership Forum — Interest note','Name','Email','Organization / sector','Interest','Question / message','Saved by the participant. Not sent to the organizer. Registration is not yet open.'];
  const content = `${labels[0]}\n\n${labels[1]}: ${data.get('name')}\n${labels[2]}: ${data.get('email')}\n${labels[3]}: ${data.get('organization') || '—'}\n${labels[4]}: ${selected}\n${labels[5]}: ${data.get('message') || '—'}\n\n${labels[6]}\n`;
  const url = URL.createObjectURL(new Blob(['\ufeff',content],{type:'text/plain;charset=utf-8'}));
  const a = document.createElement('a');a.href=url;a.download=language === 'zh'?'女性领导力论坛-参与意向单.txt':'GWLF-interest-note.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  result.textContent = language === 'zh' ? '参与意向单已生成，请在下载中查看。信息未发送至主办方。' : 'Your interest note is ready in Downloads. Nothing has been sent to the organizer.';
});
