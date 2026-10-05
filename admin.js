'use strict';
(() => {
  const config = window.ALFA3_CONFIG;
  const client = window.supabase.createClient(config.supabase.url, config.supabase.publishableKey);
  const $ = s => document.querySelector(s);
  let rows = [];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
  const render = () => {
    const term = $('#search').value.trim().toLowerCase(); const status = $('#status-filter').value;
    const filtered = rows.filter(row => (status === 'all' || row.status === status) && [row.fullName,row.email,row.phone,row.modality,row.city].join(' ').toLowerCase().includes(term));
    $('#admin-message').textContent = `${filtered.length} registro(s) encontrado(s).`;
    $('#students-list').innerHTML = filtered.length ? filtered.map(row => `<article class="student-card"><div><span class="status-pill ${row.status === 'Matriculada' ? 'is-enrolled' : ''}">${escape(row.status)}</span><h2>${escape(row.fullName)}</h2><p>${escape(row.modality || 'Modalidade não informada')} · ${formatDate(row.birthDate)}</p><p>${escape(row.email)} · ${escape(row.phone)}</p><p>${escape(row.city || '')} / ${escape(row.state || '')}</p></div><div class="student-actions"><a class="button button-outline" target="_blank" rel="noopener" href="https://wa.me/${String(row.phone || '').replace(/\D/g, '').replace(/^/, '55')}">WhatsApp ↗</a>${row.status !== 'Matriculada' ? `<button class="button confirm-enrollment" data-id="${escape(row.id)}">Confirmar matrícula</button>` : '<strong class="confirmed">Matrícula confirmada</strong>'}</div></article>`).join('') : '<div class="admin-card"><p>Nenhum aluno encontrado.</p></div>';
  };
  async function load() { const { data, error } = await client.from('enrollments').select('*').order('created_at', { ascending: false }); if (error) { $('#admin-message').textContent = 'Não foi possível carregar os registros. Verifique as políticas RLS.'; return; } rows = data || []; render(); }
  $('#login-form').addEventListener('submit', async event => { event.preventDefault(); $('#login-error').textContent = ''; const { error } = await client.auth.signInWithPassword({ email: $('#admin-email').value, password: $('#admin-password').value }); if (error) $('#login-error').textContent = 'E-mail ou senha inválidos.'; else show(); });
  $('#toggle-password').addEventListener('click', () => { const input = $('#admin-password'); const visible = input.type === 'text'; input.type = visible ? 'password' : 'text'; $('#toggle-password').setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha'); });
  $('#forgot-password').addEventListener('click', async () => { const email = $('#admin-email').value.trim(); if (!email) { $('#login-error').textContent = 'Informe seu e-mail para receber o link de recuperação.'; return; } const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}${location.pathname}` }); $('#login-error').textContent = error ? 'Não foi possível enviar o link.' : 'Link de recuperação enviado para seu e-mail.'; });
  async function show() { $('#login-card').hidden = true; $('#dashboard').hidden = false; await load(); }
  $('#logout').addEventListener('click', async () => { await client.auth.signOut(); $('#dashboard').hidden = true; $('#login-card').hidden = false; });
  $('#search').addEventListener('input', render); $('#status-filter').addEventListener('change', render);
  $('#students-list').addEventListener('click', async event => { const button = event.target.closest('.confirm-enrollment'); if (!button || !confirm('Confirmar a matrícula deste aluno?')) return; button.disabled = true; const { error } = await client.from('enrollments').update({ status: 'Matriculada' }).eq('id', button.dataset.id); if (error) { alert('Não foi possível confirmar a matrícula.'); button.disabled = false; } else await load(); });
  client.auth.getSession().then(({ data }) => { if (data.session) show(); });
})();
