# ALFA3 — Landing page

Site em HTML, CSS e JavaScript puro, sem framework ou etapa de build. Abra `index.html` no navegador. Para servir localmente: `python3 -m http.server 8000`, depois acesse `http://localhost:8000`.

## Implementado

- Layout responsivo, abertura preta e dourada, composição editorial original em CSS, navegação fixa e menu móvel com suporte a Escape.
- Quatro modalidades, seleção preservada ao clicar no cartão, método, equipe, localização, FAQ nativo acessível, chamada final e rodapé.
- Conteúdo centralizado em `config.js`, incluindo professores, fundadoras, turmas, condições, contatos, imagens, campanha e documentos.
- Componentes de professores completos, filtro por modalidade quando há cinco ou mais profissionais, fundadoras sem necessidade de fotos individuais.
- Mapa carregado somente após clique, quando endereço confirmado e URL incorporável válida estiverem configurados.
- Links e botão flutuante de WhatsApp somente com número real; botão oculto enquanto a matrícula estiver na tela.
- Interface de matrícula em três etapas; revisão, validação por campo, responsável para menor de 18 anos, consentimento opcional e prevenção de cliques repetidos.
- Cliente HTTP preparado para API, tempo limite, tratamento de falhas e chave de idempotência preservada na tentativa seguinte se os dados não mudarem.
- Nenhum dado pessoal é persistido no navegador. Nenhum envio é simulado.

## Estado real da matrícula

**A coleta está desativada. Não existe banco de dados, API ou área administrativa autenticada nesta entrega estática.** HTML/CSS/JavaScript executados no navegador não protegem dados ou autenticação por si só. O visitante pode escolher uma modalidade; não pode preencher dados pessoais nem enviar matrícula enquanto a integração estiver ausente.

As etapas de aluno e revisão foram implementadas, mas sua integração real depende de um serviço no servidor. Alterar `enabled` sozinho não torna o sistema pronto: turmas, endpoint, documentos e regras também são necessários. Configuração no navegador não substitui verificação no servidor.

## Edição

- `brand.logoLight`: arquivo oficial apropriado para fundo preto. O arquivo oficial recebido (`assets/logo.png`) está aplicado no cabeçalho e rodapé. O CSS enquadra a imagem quadrada, ocultando somente as margens pretas externas, sem alterar o arquivo nem distorcer a marca. Ao substituir por uma versão sem margens, ajustar `.brand-image` no CSS.
- `brand.heroPhoto` e `heroPhotoAlt`: fotografia autorizada. Substitui o painel editorial; nenhuma pessoa fictícia foi usada.
- `founders.photo` / `photoAlt`: foto conjunta das três fundadoras. `profiles`: nome, função, especialidades, biografia e foto individual opcional. Textos vazios não são exibidos como marcadores ao público.
- `teachers`: cada professor requer nome, foto, disciplinas, modalidades (IDs dos cursos), especialidades e apresentação. Perfis incompletos ficam ocultos.
- `classes`: cada turma usa `id`, `modality`, `name`, `shift`, `start`, `duration`, `available`, `disciplines`, `conditions` e `price`. Somente `available: true` com identificação, modalidade reconhecida e turno é exibida. Aulas isoladas precisam de `disciplines` para permitir continuar.
- Preços: `monthly` e `cash` são opcionais. Para parcelamento, preencher `installments`, `installmentValue` e `total` juntos. Não declarar ausência de juros sem confirmação. Na falta de valores, exibe consulta de condições.
- `campaign`: mantém-se desativada até informar modalidades participantes, base e duração do desconto, condições de redação, critério dos 30 alunos e condições completas. Sem contagem regressiva ou vagas inventadas.
- `location`: preencher endereço, bairro, cidade, UF, referência, horários, link de rota e URL `/maps/embed...` do Google. Definir `confirmed: true` só após confirmar os dados.
- `contacts.whatsapp`: código do país + DDD + número, por exemplo estrutura `55DDNUMERO` (não publicar número fictício). Instagram deve ser uma URL completa. E-mail deve ser válido.
- `enrollment`: URLs dos documentos reais, regra de confirmação, próximo passo definido pela instituição e endpoint de gravação.
- Usar imagens locais otimizadas em WebP/AVIF quando fornecidas. Fontes de sistema evitam dependências e carregamento externo. Squada One pode ser incorporada localmente após receber os arquivos e conferir o manual; não é simulada por outra fonte.

## Contrato de integração pendente

`POST` JSON para `enrollment.endpoint`, preferencialmente na mesma origem sob HTTPS. Cabeçalho `Idempotency-Key`: UUID por tentativa lógica. O servidor deve validar todos os campos, idade, responsável, turma disponível, disciplina, consentimentos e condições; as informações comerciais nunca devem ser confiadas ao cliente. Registrar as versões reais dos termos, aviso, data de aceite e opção de marketing.

Somente após commit durável no banco, responder com sucesso HTTP e:

```json
{"persisted": true, "status": "Recebida", "protocol": "PROTOCOLO-GERADO-PELO-SERVIDOR"}
```

O protocolo deve ser único. Repetições da mesma chave e conteúdo devem retornar o registro existente; a mesma chave com conteúdo diferente deve falhar. O servidor deve cuidar de limites de tamanho, validação, controle de abuso e nunca expor listagens de alunos em rotas públicas. Nenhuma chave privada pertence a `config.js`.

Área administrativa ainda a implementar no servidor: autenticação individual, autorização por função, sessão segura, consulta paginada, filtro por modalidade e estados `Recebida`, `Em análise`, `Confirmada`, além de auditoria das alterações. A transição para `Confirmada` deve aplicar a regra real da instituição, não apenas um clique ou sucesso do formulário.

## Pendências para publicação com matrícula

1. Manual oficial da marca em PDF e eventuais versões adicionais do logotipo. A logo `assets/logo.png` já foi recebida e aplicada.
2. Fotos autorizadas do espaço/alunos/equipe e foto conjunta das fundadoras; nomes, funções, especialidades e biografias.
3. Dados e fotos reais dos professores, com modalidades e disciplinas.
4. Endereço completo, bairro, cidade/UF, referência, horário, URL do mapa e rota.
5. WhatsApp, Instagram, e-mail e horários oficiais.
6. Turmas realmente disponíveis, turno, início, duração, disciplinas e edital dos intensivos.
7. Preços finais e totais do parcelamento. As faixas internas do briefing não foram publicadas nem usadas como oferta.
8. Regras completas da campanha; manter desativada até aprovação.
9. Aviso de privacidade, termos de matrícula, regra de pagamento/confirmacão e orientação do próximo passo.
10. Hospedagem/API/banco protegido, área administrativa autenticada e testes de integração antes de ativar coleta.

## Validação

Verificação de sintaxe JavaScript com `node --check script.js` e `node --check config.js`; inspeção de referências internas do HTML. A revisão visual automatizada não foi executada: ferramenta de navegador indisponível nesta sessão e tentativa de obter Playwright bloqueada por falha de rede (`ENOTFOUND`). A validação real de gravação, autorização e idempotência depende da API inexistente. Não há alegação de testes de gravação em produção.

Antes da ativação, testar com dados claramente fictícios: maior e menor de idade, aniversário de 18 anos, erros de e-mail e telefone, correções entre etapas, turmas indisponíveis, timeout após commit, clique repetido, repetição idempotente, falha do banco e acesso administrativo sem autenticação. Revisar teclado e telas de 320, 390, 768 e 1440 px.

Referência consultada para organização comercial: https://aprovatotal.com.br/. Textos e composição são próprios da ALFA3; resultados e depoimentos da referência não foram reproduzidos.

## Imagem da abertura

`assets/estudantes-hero.png`: imagem original gerada com a ferramenta integrada de geração de imagens. Representa dois estudantes fictícios em uma cena publicitária; não representa alunos reais nem resultados da ALFA3. Configuração em `brand.heroPhoto`, `heroPhotoAlt` e `heroIllustrative`; legenda pública “Imagem ilustrativa.”. Composição responsiva preserva os corpos inteiros. Prompt completo em `assets/estudantes-hero.prompt.txt`.

## Animação da abertura

Entrada gradual do título, texto e ações, imagem com entrada suave e duas oscilações verticais de 9 px, e um reflexo breve no botão principal. Efeitos em CSS, sem bibliotecas, com duração total inferior a cinco segundos e sem repetição contínua. Desativados quando o dispositivo solicita movimento reduzido. O foco de teclado torna as ações imediatamente visíveis.

## Carrossel das fundadoras

Fotos recebidas e aplicadas: `assets/MENINAS.png`, `assets/Francisca.jpeg`, `assets/Erivania.jpeg` e `assets/Jaciandra.jpeg` (respeitar maiúsculas nos caminhos). A primeira apresentação mostra as três juntas; em seguida, Francisca, Erivania e Jaciandra. Navegação circular manual por setas e botões de nomes, com teclado, anúncio acessível e transição que respeita movimento reduzido. Fotografias exibidas inteiras, com altura natural e sem distorção. A apresentação conjunta recebe uma coluna mais larga no desktop; no celular, a altura acompanha a proporção de cada arquivo.

Preencher `founders.profiles[].bio` e `specialties` em `config.js` quando as descrições forem fornecidas. Nomes e papel de cofundadora já informados são exibidos; biografias vazias são omitidas, sem texto inventado. Não há troca automática.

Layout do carrossel: coluna esquerda exclusiva para fotografia; texto, seleção por nome, contador e setas reunidos na coluna direita. No celular, a foto aparece acima do texto e dos controles.

## Demonstração do cadastro

`enrollment.demo: true` libera as três etapas apenas para teste, sem exigir turma. Há aviso persistente, dados fictícios pré-preenchidos, revisão e conclusão explicitamente identificada como teste. O modo demo retorna antes de qualquer chamada HTTP, não grava dados, não gera protocolo e não solicita aceite de documentos inexistentes. Pode-se reiniciar o teste. Desativar `demo` antes da ativação real; a coleta real continua dependendo da integração protegida.

## Fluxo atualizado: pré-matrícula

O formulário registra interesse por modalidade, sem exigir turma ou turno. Após o recebimento real, a equipe entra em contato para apresentar as condições e efetivar a matrícula. Nenhuma vaga, pagamento ou matrícula é confirmada pelo simples envio. Textos e regras centralizados em `config.js`. O modo de teste continua ativo, sem persistência, envio ou contato da equipe.
