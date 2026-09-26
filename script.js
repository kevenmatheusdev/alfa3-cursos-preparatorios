'use strict';
(() => {
  const config = window.ALFA3_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const url = (value) => { if (typeof value !== 'string' || !value.trim()) return ''; try { const parsed = new URL(value, location.href); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''; } catch { return ''; } };
  const media = (src, alt, className = '') => `<img src="${escape(url(src))}" alt="${escape(alt)}" class="${className}" loading="lazy" width="600" height="450">`;
  const currency = value => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(value);
  const conditions = item => {
    if (!item) return 'Consulte as condições da turma.';
    const price = item.price || {};
    const parts = [item.conditions];
    if (Number.isFinite(price.monthly)) parts.push(`${currency(price.monthly)} por mês.`);
    if (Number.isFinite(price.cash)) parts.push(`${currency(price.cash)} à vista.`);
    if (Number.isInteger(price.installments) && price.installments > 0 && Number.isFinite(price.installmentValue) && Number.isFinite(price.total)) parts.push(`${price.installments} parcelas de ${currency(price.installmentValue)}. Total: ${currency(price.total)}.`);
    return parts.filter(Boolean).join(' ') || 'Consulte as condições da turma.';
  };
  const available = config.classes.filter(item => item.available === true && item.id && item.name && item.shift && config.courses.some(course => course.id === item.modality));
  const enrollment = config.enrollment;
  const demo = enrollment.demo === true;
  const ready = !demo && enrollment.enabled === true && url(enrollment.endpoint) && url(enrollment.privacyUrl) && url(enrollment.termsUrl) && enrollment.confirmationRule && enrollment.nextStep;
  const paths = { book: '<path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15"/>', building: '<path d="m3 8 9-5 9 5H3ZM5 10v8m5-8v8m4-8v8m5-8v8M3 21h18"/>', bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-8z"/>', pen: '<path d="m15 4 5 5M4 20l5-1L21 7l-4-4L5 15zM4 20h16"/>' };
  $('#year').textContent = new Date().getFullYear();
  $('#year').closest('.footer-bottom').insertAdjacentHTML('beforeend', '<span class="creator-credit">Criado por <a href="https://portfoliokevenmatheus.vercel.app/" target="_blank" rel="noopener noreferrer">Keven Matheus Desenvolvedor</a></span>');
  $('#course-grid').innerHTML = config.courses.map(course => `<article class="course-card course-card-featured" aria-labelledby="course-title-${escape(course.id)}"><div class="course-top"><span class="course-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${paths[course.icon] || paths.book}</svg></span><p class="course-tag">${escape(course.tag)}</p><span class="course-number" aria-hidden="true">${escape(course.number)}</span></div><h3 id="course-title-${escape(course.id)}">${escape(course.title)}</h3><p class="course-description">${escape(course.description)}</p><div class="course-details"><div class="course-audience"><span class="course-label">PARA QUEM</span><p>${escape(course.audience)}</p></div><div class="course-subjects"><span class="course-label">SUA PREPARAÇÃO</span><ul>${course.subjects.map(subject => `<li>${escape(subject)}</li>`).join('')}</ul></div></div><div class="course-footer"><p class="course-price"><span>INVESTIMENTO</span>Consulte as condições <br>da turma</p><a href="#matricula" class="button" data-course="${escape(course.id)}" aria-label="Fazer pré-matrícula em ${escape(course.title)}">Fazer pré-matrícula <span aria-hidden="true">↗</span></a></div></article>`).join('');
  config.courses.forEach(course => $('#modality').add(new Option(course.title, course.id)));
  'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ').forEach(state => $('#state').add(new Option(state, state)));
  const menuButton = $('.menu-toggle');
  function closeMenu() { $('#menu').classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); }
  menuButton.addEventListener('click', () => { const open = $('#menu').classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
  $$('#menu a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#menu').classList.contains('open')) {closeMenu(); menuButton.focus();} });
  if (config.brand.logoLight) $$('.brand-image img').forEach(img => { img.src = url(config.brand.logoLight); });
  if (config.brand.heroPhoto && config.brand.heroPhotoAlt) { $('#hero-media').outerHTML = `<figure class="hero-visual" id="hero-media"><img class="hero-photo" src="${escape(url(config.brand.heroPhoto))}" alt="${escape(config.brand.heroPhotoAlt)}" width="1280" height="1280" fetchpriority="high" decoding="async">${config.brand.heroIllustrative ? '<figcaption>Imagem ilustrativa.</figcaption>' : ''}</figure>`; }
  const founders = config.founders;
  const founderSlides = [];
  if (founders.photo) founderSlides.push({ name: 'As fundadoras', photo: founders.photo, alt: founders.photoAlt || 'As fundadoras da ALFA3', group: true });
  founders.profiles.filter(person => person.name && (person.photo || founders.photo)).forEach(person => founderSlides.push({ ...person, photo: person.photo || founders.photo, alt: person.photo ? `Retrato de ${person.name}, cofundadora da ALFA3` : founders.photoAlt }));
  if (founderSlides.length) {
    let founderIndex = 0;
    const selectors = $('.founder-selectors');
    selectors.innerHTML = founderSlides.map((person, index) => `<button type="button" data-founder="${index}" aria-controls="founder-slide" aria-label="Mostrar ${escape(person.name)}">${escape(person.shortName || person.name)}</button>`).join('');
    $('.founder-controls').hidden = founderSlides.length < 2;
    const renderFounder = (index, announce = true) => {
      founderIndex = (index + founderSlides.length) % founderSlides.length;
      const person = founderSlides[founderIndex];
      $('#founder-slide').innerHTML = `<div class="founder-photo-frame${person.group ? ' founder-photo-group' : ''}"><img src="${escape(url(person.photo))}" alt="${escape(person.alt || person.name)}" width="${person.group ? '1536' : '1024'}" height="${person.group ? '1024' : '1536'}" loading="lazy" decoding="async"></div><div class="founder-copy"><p class="eyebrow">${person.group ? 'NOSSA ESSÊNCIA' : 'QUEM ESTÁ COM VOCÊ'}</p><h3>${person.group ? 'Três mulheres.<br>Um mesmo propósito.' : escape(person.name)}</h3>${!person.group && person.role ? `<p class="founder-role">${escape(person.role)}</p>` : ''}${person.specialties ? `<p class="founder-specialties">${escape(person.specialties)}</p>` : ''}${person.group || person.bio ? `<p class="founder-bio">${person.group ? 'Uma preparação próxima começa com pessoas comprometidas com o seu aprendizado.' : escape(person.bio)}</p>` : ''}${person.group ? '<div class="values"><span>Simplicidade</span><span>Excelência</span><span>Compromisso</span></div>' : ''}<span class="founder-signature" aria-hidden="true">ALFA3 <span>↗</span></span></div>`;
      $$('.founder-selectors button').forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === founderIndex)));
      $('#founder-counter').textContent = `${String(founderIndex + 1).padStart(2, '0')} / ${String(founderSlides.length).padStart(2, '0')}`;
      if (announce) $('#founder-status').textContent = `${person.name}. Apresentação ${founderIndex + 1} de ${founderSlides.length}.`;
    };
    $('#founder-prev').addEventListener('click', () => renderFounder(founderIndex - 1));
    $('#founder-next').addEventListener('click', () => renderFounder(founderIndex + 1));
    selectors.addEventListener('click', event => { const button = event.target.closest('[data-founder]'); if (button) renderFounder(Number(button.dataset.founder)); });
    $('.founders-carousel').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || !event.target.closest('.founder-controls')) return;
      event.preventDefault(); renderFounder(founderIndex + (event.key === 'ArrowRight' ? 1 : -1));
    });
    renderFounder(0, false);
  }
  const teachers = config.teachers.filter(person => person.name && person.photo && person.subjects?.length && person.modalities?.length && person.specialties && person.bio);
  if (teachers.length) {
    $('#professores').hidden = false;
    config.courses.forEach(course => $('#teacher-filter').add(new Option(course.title, course.id)));
    $('#teacher-filter').hidden = teachers.length < 5; $('.filter-label').hidden = teachers.length < 5;
    const renderTeachers = () => { const filtered = teachers.filter(person => !$('#teacher-filter').value || person.modalities.includes($('#teacher-filter').value)); $('#teacher-grid').innerHTML = filtered.length ? filtered.map(person => `<article>${media(person.photo, person.photoAlt || person.name)}<h3>${escape(person.name)}</h3><p><strong>${escape(person.subjects.join(' • '))}</strong></p><p>${escape(person.specialties)}</p><p>${escape(person.bio)}</p></article>`).join('') : '<p>Nenhum professor cadastrado nesta modalidade.</p>'; };
    renderTeachers(); $('#teacher-filter').addEventListener('change', renderTeachers);
  }
  const campaign = config.campaign;
  if (campaign.enabled && campaign.courses.length && campaign.courses.every(id => config.courses.some(course => course.id === id)) && campaign.discountBase && campaign.discountDuration && campaign.writingConditions && campaign.countingRule && campaign.conditions) {
    $('#campanha').hidden = false;
    $('#campaign-conditions').textContent = [`Cursos participantes: ${campaign.courses.map(id => config.courses.find(course => course.id === id).title).join(', ')}.`, `Base do desconto: ${campaign.discountBase}. Duração: ${campaign.discountDuration}.`, `Redação: ${campaign.writingConditions}.`, `Critério dos 30 alunos: ${campaign.countingRule}.`, campaign.conditions].join('\n');
  }
  const address = config.location;
  if (address.confirmed && address.address && address.city && address.state) {
    $('#location-details').innerHTML = `<p class="body-copy"><strong>${escape(address.address)}</strong><br>${escape([address.neighborhood, address.city, address.state].filter(Boolean).join(' · '))}</p>${address.reference ? `<p>${escape(address.reference)}</p>` : ''}${address.hours ? `<p class="body-copy">${escape(address.hours)}</p>` : ''}${url(address.mapsUrl) ? `<a class="button button-outline" href="${escape(url(address.mapsUrl))}" target="_blank" rel="noopener noreferrer">Como chegar ↗</a>` : ''}`;
    if (address.photo) $('#map').innerHTML = media(address.photo, 'Unidade ALFA3');
    if (url(address.embedUrl) && /^https:\/\/(www\.)?google\.com\/maps\//.test(address.embedUrl)) {
      $('#map').innerHTML = '<button type="button" class="button button-outline" id="load-map">Carregar mapa do Google Maps ↗</button>';
      $('#load-map').addEventListener('click', () => { $('#map').innerHTML = `<iframe src="${escape(url(address.embedUrl))}" title="Localização da ALFA3 no Google Maps" loading="lazy" referrerpolicy="no-referrer" allowfullscreen></iframe>`; });
    }
    $$('#duvidas details').at(-1).querySelector('p').textContent = `${address.address}, ${address.city}/${address.state}. ${address.hours || ''}`;
  }
  const contacts = config.contacts;
  const contactLinks = [];
  const whatsapp = contacts.whatsapp.replace(/\D/g, '');
  if (/^55\d{10,11}$/.test(whatsapp)) {
    const href = `https://wa.me/${whatsapp}`;
    contactLinks.push(`<a href="${href}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>`);
    const float = document.createElement('a'); float.className = 'whatsapp-float'; float.href = href; float.target = '_blank'; float.rel = 'noopener noreferrer'; float.textContent = 'Dúvidas? WhatsApp ↗'; document.body.append(float);
    new IntersectionObserver(entries => { float.hidden = entries[0].isIntersecting; }, {threshold:0}).observe($('#matricula'));
  }
  if (url(contacts.instagram)) contactLinks.push(`<a href="${escape(url(contacts.instagram))}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>`);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacts.email)) contactLinks.push(`<a href="mailto:${escape(contacts.email)}">${escape(contacts.email)}</a>`);
  if (contactLinks.length) $('#contact-links').innerHTML = contactLinks.join('') + (contacts.hours ? `<p>${escape(contacts.hours)}</p>` : '');
  [['privacyUrl','Privacidade'],['termsUrl','Termos de pré-matrícula']].forEach(([key,label]) => { if (url(enrollment[key])) $('#legal-links').insertAdjacentHTML('beforeend', `<a href="${escape(url(enrollment[key]))}" target="_blank" rel="noopener">${label}</a>`); });
  function chosenClass() { return available.find(item => item.id === $('#classroom').value && item.modality === $('#modality').value); }
  function updateDiscipline() {
    const item = chosenClass(); const subjects = item?.disciplines || [];
    $('#discipline-wrap').hidden = $('#modality').value !== 'reforco' || !subjects.length;
    $('#discipline').required = !$('#discipline-wrap').hidden;
    $('#discipline').innerHTML = '<option value="">Selecione uma disciplina</option>';
    subjects.forEach(subject => $('#discipline').add(new Option(subject, subject)));
    $('#class-conditions').textContent = item ? [item.start ? `Início: ${item.start}.` : '', item.duration ? `Duração: ${item.duration}.` : '', conditions(item)].filter(Boolean).join(' ') : '';
    $('#next-course').disabled = !((demo || ready) && config.courses.some(course => course.id === $('#modality').value));
  }
  function updateClasses() {
    const options = available.filter(item => item.modality === $('#modality').value);
    $('#classroom').innerHTML = `<option value="">${options.length ? 'Selecione a turma e o turno' : 'Turmas em definição'}</option>`;
    options.forEach(item => $('#classroom').add(new Option(`${item.name} — ${item.shift}`, item.id)));
    $('#classroom').disabled = $('#classroom-wrap').hidden || !options.length; updateDiscipline();
    $('#enrollment-notice').hidden = Boolean(!demo && ready);
  }
  $('#modality').addEventListener('change', updateClasses); $('#classroom').addEventListener('change', updateDiscipline);
  $$('[data-course]').forEach(link => link.addEventListener('click', () => { if (sending) return; $('#modality').value = link.dataset.course; updateClasses(); showStep(1, false); }));
  let currentStep = 1; let sending = false; let requestKey = null;
  function showStep(step, focus = true) {
    if (step > 1 && !ready && !demo) return;
    currentStep = step;
    $$('[data-step]').forEach(fieldset => { const active = Number(fieldset.dataset.step) === step; fieldset.hidden = !active; fieldset.disabled = !active; });
    $$('.progress li').forEach((item, index) => { if (index + 1 === step) item.setAttribute('aria-current','step'); else item.removeAttribute('aria-current'); });
    if (focus) { const legend = $(`[data-step="${step}"] legend`); legend.tabIndex = -1; legend.focus(); }
  }
  function error(input, message) { input.setAttribute('aria-invalid', message ? 'true' : 'false'); const target = $(`#${input.id}-error`); if (target) {target.textContent = message; input.setAttribute('aria-describedby', target.id);} }
  function validate(step) {
    let valid = true;
    $$(`[data-step="${step}"] input, [data-step="${step}"] select`).forEach(input => {
      if (input.disabled || (input.closest('#guardian-fields') && $('#guardian-fields').hidden) || (input.id === 'discipline' && $('#discipline-wrap').hidden)) return;
      let message = '';
      if (input.required && (input.type === 'checkbox' ? !input.checked : !input.value.trim())) message = input.type === 'checkbox' ? 'Leia e aceite os termos para continuar.' : 'Preencha este campo.';
      else if (input.value && !input.validity.valid) message = input.type === 'email' ? 'Informe um e-mail válido.' : 'Confira o valor informado.';
      else if (['phone','guardianPhone'].includes(input.id) && input.value && !/^\d{10,11}$/.test(input.value.replace(/\D/g,''))) message = 'Informe um telefone com DDD (10 ou 11 dígitos).';
      else if (['fullName','guardianName'].includes(input.id) && input.value && input.value.trim().split(/\s+/).length < 2) message = 'Informe o nome completo.';
      else if (input.id === 'birthDate' && input.value && (input.value > today() || age(input.value) > 120)) message = 'Informe uma data de nascimento válida.';
      error(input, message); if (message) valid = false;
    });
    if (!valid) $(`[data-step="${step}"] [aria-invalid="true"]`)?.focus();
    return valid;
  }
  function today() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function age(value) { const birth = new Date(`${value}T12:00:00`); const now = new Date(); return now.getFullYear() - birth.getFullYear() - (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate()) ? 1 : 0); }
  $('#birthDate').max = today();
  function updateGuardian() { const minor = $('#birthDate').value && age($('#birthDate').value) < 18; $('#guardian-fields').hidden = !minor; $$('#guardian-fields input').forEach(input => {input.required = Boolean(minor); input.disabled = !minor; if (!minor) input.value = '';}); }
  $('#birthDate').addEventListener('change', updateGuardian);
  $('#next-course').addEventListener('click', () => { if ((demo || ready) && validate(1)) {showStep(2); updateGuardian();} });
  function data() { const result = {}; $$('#enrollment-form input, #enrollment-form select').forEach(input => { if (input.name && !(input.closest('#guardian-fields') && $('#guardian-fields').hidden)) result[input.name] = input.type === 'checkbox' ? input.checked : input.value.trim(); }); return result; }
  function review() {
    const values = data(); const item = chosenClass();
    const rows = [['Modalidade', config.courses.find(course => course.id === values.modality)?.title], ['Turma / turno', item && !demo ? `${item.name} / ${item.shift}` : ''], ['Disciplina', values.discipline], ['Condições', demo ? 'Demonstração — sem contratação ou reserva de vaga.' : 'A equipe apresentará as condições no contato para efetivar a matrícula.'], ['Aluno', values.fullName], ['Nascimento', values.birthDate.split('-').reverse().join('/')], ['WhatsApp', values.phone], ['E-mail', values.email], ['Cidade / UF', `${values.city} / ${values.state}`], ['Escolaridade', values.education], ['Responsável', values.guardianName], ['Vínculo', values.guardianRelation], ['Contato do responsável', values.guardianPhone]];
    $('#review').innerHTML = `<dl>${rows.filter(([,value]) => value).map(([label,value]) => `<div class="review-row"><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
    $('#confirmation-rule').textContent = demo ? 'Na pré-matrícula real, nossa equipe entrará em contato para efetivar a matrícula. Neste teste, nenhum dado será enviado ou salvo e não haverá contato da equipe.' : enrollment.confirmationRule;
    if (!demo) { $('#terms-link').href = url(enrollment.termsUrl); $('#privacy-link').href = url(enrollment.privacyUrl); }
  }
  $('#next-student').addEventListener('click', () => { if (validate(2)) {review(); showStep(3);} });
  $$('[data-back]').forEach(button => button.addEventListener('click', () => { if (!sending) {showStep(Number(button.dataset.back)); if (currentStep === 2) updateGuardian();} }));
  $('#enrollment-form').addEventListener('input', event => { if (event.target.id) error(event.target, ''); requestKey = null; });
  $('#enrollment-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (demo) {
      if (currentStep !== 3 || sending || !validate(3)) return;
      $('#enrollment-form').hidden = true; $('.progress').hidden = true;
      $('#success').innerHTML = '<span class="success-icon" aria-hidden="true">✓</span><h3>Teste concluído</h3><p>Você percorreu as etapas de demonstração. Nenhum dado foi enviado ou salvo. Não foi realizada uma matrícula nem gerado um protocolo.</p><button type="button" class="button" id="restart-demo">Testar novamente</button>';
      $('#success').hidden = false; $('#success').focus();
      $('#restart-demo').addEventListener('click', () => {
        $('#success').hidden = true; $('#enrollment-form').hidden = false; $('.progress').hidden = false;
        $('#enrollment-form').reset(); fillDemo(); updateClasses(); updateGuardian(); showStep(1);
      });
      return;
    }
    if (!ready || sending || currentStep !== 3 || !config.courses.some(course => course.id === $('#modality').value) || !validate(3)) return;
    sending = true; requestKey ||= crypto.randomUUID();
    const submit = $('#submit-enrollment'); submit.textContent = 'Enviando solicitação…';
    const payload = data();
    const controls = $$('#enrollment-form input, #enrollment-form select, #enrollment-form button'); const previousDisabled = controls.map(control => control.disabled); controls.forEach(control => {control.disabled = true;});
    $('#submit-error').textContent = '';
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url(enrollment.endpoint), {method:'POST', headers:{'Content-Type':'application/json', 'Idempotency-Key':requestKey}, credentials:'same-origin', signal:controller.signal, body:JSON.stringify({...payload, privacyVersion:enrollment.privacyUrl, termsVersion:enrollment.termsUrl})});
      if (!response.ok) throw new Error('request');
      const result = await response.json();
      if (result.persisted !== true || result.status !== 'Recebida' || typeof result.protocol !== 'string' || !result.protocol.trim()) throw new Error('invalid-response');
      $('#enrollment-form').hidden = true; $('.progress').hidden = true; $('#success').hidden = false;
      $('#protocol').textContent = `Protocolo: ${result.protocol}`; $('#next-instructions').textContent = enrollment.nextStep; $('#success').focus();
      $('#enrollment-form').reset(); requestKey = null;
    } catch {
      $('#submit-error').textContent = 'Não foi possível confirmar o recebimento. Seus dados continuam no formulário. Tente novamente; a mesma solicitação será identificada para evitar duplicação.';
    } finally {
      clearTimeout(timeout); sending = false; controls.forEach((control,index) => {control.disabled = previousDisabled[index];}); submit.textContent = 'Enviar pré-matrícula ↗';
    }
  });
  function fillDemo() {
    const example = {fullName:'Aluno Fictício de Teste', birthDate:'2000-01-15', phone:'(00) 00000-0000', email:'aluno.teste@example.com', city:'Cidade de Teste', state:'PB', education:'Ensino médio completo'};
    Object.entries(example).forEach(([id, value]) => { $(`#${id}`).value = value; });
  }
  if (demo) {
    const banner = document.createElement('p');
    banner.className = 'notice demo-banner';
    banner.textContent = 'MODO DE TESTE • Use somente dados fictícios. Nada será enviado ou salvo.';
    $('.enrollment-form-heading').after(banner);
    $('#enrollment-notice').innerHTML = '<span aria-hidden="true">ⓘ</span><div><strong>Demonstração da pré-matrícula</strong><p>Escolha uma modalidade para testar as etapas. O formulário seguinte já vem com dados fictícios.</p></div>';
    $('#terms').required = false; $('#terms').closest('label').hidden = true;
    $('#marketing').closest('label').hidden = true;
    $('#submit-enrollment').textContent = 'Concluir teste →';
    fillDemo();
  }
  updateGuardian(); updateClasses();
})();
