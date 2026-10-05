/* Conteúdo editável. Campos vazios nunca representam informações confirmadas.
   Não coloque senhas, chaves privadas ou dados de alunos neste arquivo público. */
window.ALFA3_CONFIG = {
  // Chave publicável: pode ser usada no navegador. Nunca coloque aqui uma secret/service_role key.
  supabase: {
    url: 'https://qwnvrubsxrbibtdeauaz.supabase.co',
    publishableKey: 'sb_publishable_3wStjoXwJvLbLtwxarx2iw_EwiKJHPY'
  },
  brand: { logoLight: 'assets/logo.png', logoDark: '', heroPhoto: 'assets/estudantes-hero.png', heroPhotoAlt: 'Cena ilustrativa de dois estudantes pulando e comemorando, com roupas amarelas e fundo preto.', heroIllustrative: true },
  courses: [
    { id: 'enem', number: '01', tag: 'SEU CAMINHO PARA A UNIVERSIDADE', title: 'Pré-vestibular / ENEM', description: 'Uma base forte para transformar dedicação em novas possibilidades.', audience: 'Para estudantes do 3º ano e egressos.', subjects: ['Linguagens e Matemática', 'Ciências e Redação'], duration: '', icon: 'book' },
    { id: 'concursos', number: '02', tag: 'PREPARE O SEU PRÓXIMO CAPÍTULO', title: 'Concursos — Básico', description: 'Conhecimento para dar os primeiros passos rumo ao serviço público.', audience: 'Para estudantes e profissionais.', subjects: ['Português, Matemática e Informática', 'Atualidades e Direito Constitucional/Administrativo'], duration: '', icon: 'building' },
    { id: 'intensivos', number: '03', tag: 'FOCO NO QUE VEM PELA FRENTE', title: 'Intensivos', description: 'Preparação direcionada a concursos com editais abertos.', audience: 'Para quem tem um edital no horizonte.', subjects: ['Conteúdos conforme o edital', 'Preparação de 3 a 4 meses'], duration: '3 a 4 meses', icon: 'bolt' },
    { id: 'reforco', number: '04', tag: 'MAIS ATENÇÃO AO QUE VOCÊ PRECISA', title: 'Aulas Isoladas / Reforço', description: 'Espaço para fortalecer sua base e avançar em uma disciplina.', audience: 'Para quem busca apoio específico.', subjects: ['Foco na matéria de seu interesse', 'Acompanhamento próximo'], duration: '', icon: 'pen' }
  ],
  // Exemplo de estrutura, sem turma fictícia publicada:
  // {id, modality, name, shift, start, duration, available:true, disciplines:[], conditions,
  // price: {monthly, cash, installments, installmentValue, total}}. Valores em reais.
  classes: [],
  founders: { photo: 'assets/MENINAS.png', photoAlt: 'As três fundadoras da ALFA3 juntas', profiles: [
    {
      name: 'Francisca André dos Santos Rolim', shortName: 'Francisca',
      role: 'Sócia-fundadora da ALFA3',
      specialties: 'Gestão Pedagógica e Comunicação',
      bio: 'Pedagoga pela Universidade Federal de Campina Grande (UFCG), especialista em Neuropsicopedagogia pela UNIP (Patos-PB) e pós-graduanda em Docência do Ensino Superior pela Faculdade Católica de Cajazeiras. Possui também formação técnica em Enfermagem, Agente Comunitário de Saúde e Cuidadora de Idosos.\n\nServidora pública concursada, atua há 12 anos na saúde municipal como Agente Comunitária de Saúde. Concilia essa trajetória com a docência em cursos técnicos e a experiência no ensino profissionalizante pelo Centro de Formação Tecnológica do Estado do Ceará (CENTEC-CE).\n\nCom experiência no atendimento ao público, comunicação interpessoal e engajamento social, atua na ALFA3 no direcionamento pedagógico e na articulação com os estudantes.',
      photo: 'assets/Francisca.jpeg'
    },
    {
      name: 'Erivânia Vieira Rodrigues', shortName: 'Erivânia',
      role: 'Sócia-fundadora da ALFA3',
      specialties: 'Educação Física, Saúde Bucal e Enfermagem',
      bio: 'Bacharel em Educação Física, técnica em Saúde Bucal e em Enfermagem, é pós-graduanda em Docência do Ensino Superior. Sua trajetória na saúde é dedicada ao cuidado integral, à prevenção e à promoção da saúde e do bem-estar, com ética, responsabilidade e acolhimento humanizado.\n\nA integração entre suas formações proporciona uma visão ampla do cuidado, desde a orientação para hábitos de vida saudáveis e movimento até a assistência direta, compreendendo cada pessoa em sua totalidade.\n\nNa pós-graduação em Docência do Ensino Superior, busca aprimorar sua atuação na educação para compartilhar conhecimento e contribuir com a formação de novos profissionais.',
      photo: 'assets/Erivania.jpeg'
    },
    {
      name: 'Jaciandra', shortName: 'Jaciandra',
      role: 'Sócia-fundadora da ALFA3',
      specialties: 'Serviço Social, Gestão de Projetos Sociais e Políticas Públicas',
      bio: 'Assistente social formada pela Faculdade Santa Maria, com especialização em Gestão de Projetos Sociais e Políticas Públicas pela Unicorp Faculdades. Atua com comprometimento na promoção da inclusão, da igualdade e do desenvolvimento comunitário.\n\nCom experiência em atendimento social, coordenação acadêmica, orientação familiar e atuação como Conselheira Tutelar Suplente, construiu uma trajetória marcada pela escuta ativa, pela ética profissional e pelo cuidado com cada pessoa atendida.\n\nAtualmente pós-graduanda em Docência do Ensino Superior, amplia sua atuação para a formação de professores, coordenadores e gestores educacionais, levando o olhar social para dentro das escolas e comunidades.',
      photo: 'assets/Jaciandra.jpeg'
    }
  ] },
  // {name, subjects:[], modalities:[], specialties, bio, photo, photoAlt}
  teachers: [],
  campaign: { enabled: false, courses: [], discountBase: '', discountDuration: '', writingConditions: '', countingRule: '', conditions: '' },
  location: { confirmed: false, address: '', neighborhood: '', city: '', state: '', reference: '', hours: '', mapsUrl: '', embedUrl: '', photo: '' },
  contacts: { whatsapp: '83 98142-8978', instagram: '', email: '', hours: '' },
  enrollment: {
    // Ativar SOMENTE após integrar e auditar persistência, proteção e administração.
    demo: false, enabled: true, endpoint: '', privacyUrl: '#', termsUrl: '#', confirmationRule: 'Esta é uma pré-matrícula. A equipe entrará em contato para apresentar as condições e efetivar a matrícula. O envio não garante vaga nem confirma pagamento.', nextStep: 'Nossa equipe entrará em contato pelos dados informados para orientar você e efetivar a matrícula.'
  }
};
