import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function gerarHistoricoEscolar() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const margemL = 14;
  const margemR = W - 14;
  let y = 10;

  /* ---- helpers ---- */
  const centralText = (text, yPos, size = 8, bold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(text, W / 2, yPos, { align: 'center' });
  };

  const sectionTitle = (text, yPos) => {
    doc.setFillColor(230, 230, 230);
    doc.rect(margemL, yPos, margemR - margemL, 6, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(text, W / 2, yPos + 4.2, { align: 'center' });
    return yPos + 8;
  };

  const labelValue = (label, value, xL, xV, yPos) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, xL, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), xV, yPos);
  };

  /* ---- CABEÇALHO ---- */
  const agora = new Date();
  const dataEmissao = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  centralText('SIGAA - Sistema Integrado de Gestão de Atividades Acadêmicas', y, 8, true); y += 4.5;
  centralText('UFAL - Universidade Federal de Alagoas', y, 8, true); y += 4.5;
  centralText('PROGRAD - Pró-Reitoria de Graduação', y, 8, true); y += 4.5;
  centralText('DRCA - Departamento de Registro e Controle Acadêmico', y, 8, true); y += 4.5;
  centralText('Av. Lourival Melo Mota, s/n, Cidade Universitária CEP: 57072-900 Maceió  AL', y, 7); y += 4;
  centralText('Recredenciada conforme Portaria MEC Nº 463, de 30 de junho de 2021, publicada no Diário Oficial da União,', y, 7); y += 4;
  centralText('na seção 01, pág. 34, em 01/07/2021', y, 7); y += 8;

  /* título do documento */
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margemL, y, margemR, y);
  y += 1;
  doc.setFillColor(255, 255, 200);
  doc.rect(margemL, y, margemR - margemL, 7, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Histórico Acadêmico - Emitido em: ${dataEmissao}`, W / 2, y + 5, { align: 'center' });
  y += 9;
  doc.line(margemL, y, margemR, y);
  y += 5;

  /* ---- DADOS PESSOAIS ---- */
  y = sectionTitle('Dados Pessoais', y);

  labelValue('Nome:', 'NOME DO ALUNO', margemL, 28, y);
  labelValue('Matrícula:', 'XXXXXXXXX', 140, 160, y); y += 5;
  labelValue('Data de Nascimento:', 'DD/MM/AAAA', margemL, 52, y);
  labelValue('Local de Nascimento:', '-/-', 110, 145, y); y += 5;
  labelValue('Nacionalidade:', 'BRASILEIRA', margemL, 42, y); y += 5;
  labelValue('Nº do doc. com órgão expedidor:', 'XXXXXXXXX, (UF/AL)', margemL, 75, y); y += 5;
  labelValue('Nº do CPF:', 'XXX.XXX.XXX-XX', margemL, 32, y); y += 8;

  /* ---- DADOS DO VÍNCULO ---- */
  y = sectionTitle('Dados do Vínculo do Discente', y);

  labelValue('Curso:', 'NOME DO CURSO - CAMPUS - BACHARELADO - PRESENCIAL', margemL, 25, y); y += 5;
  labelValue('Status:', 'ATIVO', margemL, 25, y);

  /* box IRA */
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(140, y - 4, 55, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Índices Acadêmicos', 167.5, y, { align: 'center' });
  doc.setFontSize(10);
  doc.text('IRA: X.XX', 167.5, y + 6, { align: 'center' });
  y += 5;

  labelValue('Ênfase:', '-', margemL, 25, y); y += 5;
  labelValue('Currículo:', 'COM000 - XXXX.X', margemL, 28, y); y += 5;
  labelValue('Reconhecimento do Curso:', 'Portaria Nº XXX, DD/MM/AAAA. D.O.U.: DD/MM/AAAA', margemL, 62, y); y += 5;
  labelValue('Ano / Período Letivo Inicial:', 'XXXX.X', margemL, 60, y);
  labelValue('Perfil Inicial:', '0', 130, 150, y); y += 5;
  labelValue('Forma de Ingresso:', 'ENEM/SISU', margemL, 48, y); y += 5;
  labelValue('Períodos Integralizados:', 'X', margemL, 58, y);
  labelValue('Prazo para Conclusão (Padrão / Máximo):', 'XXXX.X / XXXX.X', 98, 161, y); y += 5;
  labelValue('Suspensões:', 'XXXX.X', margemL, 32, y); y += 5;
  labelValue('Prorrogações:', 'X períodos letivos', margemL, 38, y); y += 5;
  labelValue('Ano/Período de Integralização:', '-', margemL, 65, y);
  labelValue('Ano/Período Letivo de Saída:', '-', 105, 148, y); y += 5;
  labelValue('Tipo Saída:', '-', margemL, 30, y); y += 5;
  labelValue('Data de Saída:', '-', margemL, 36, y);
  labelValue('Data da Colação de Grau:', '-', 105, 140, y); y += 5;
  labelValue('Trabalho de Conclusão de Curso:', '-', margemL, 72, y); y += 5;
  labelValue('Data da Expedição do Diploma:', '-', margemL, 68, y); y += 8;

  /* ---- COMPONENTES CURSADOS ---- */
  y = sectionTitle('Componentes Curriculares Cursados/Cursando', y);

  const head = [['Ano/Período\nLetivo', '', 'Componente Curricular', 'Hora\nAula', 'CH', 'Turma', 'Freq %', 'Média', 'Situação']];
  const body = [
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '100,0', '0,00', 'APR'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '100,0', '7,00', 'APR'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '172', '144', '01', '100,0', '8,00', 'APR'],
    ['XXXX.X', 'e', 'NOME DA DISCIPLINA EQUIVALENTE\nProf. NOME DO PROFESSOR (XXh)', '72', '60', '01', '100,0', '9,00', 'APR'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '90,0', '8,00', 'APR'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '100,0', '7,78', 'APR'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '76,0', '7,00', 'APR'],
    ['XXXX.X', 'e', 'NOME DA DISCIPLINA EQUIVALENTE\nProf. NOME DO PROFESSOR (XXh)', '72', '60', '01', '94,0', '8,25', 'APR'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '100,0', '-', 'MATRICULADO'],
    ['XXXX.X', '', 'NOME DA DISCIPLINA\nProf. NOME DO PROFESSOR (XXh)', '86', '72', '01', '100,0', '-', 'MATRICULADO'],
  ];

  autoTable(doc, {
    startY: y,
    head,
    body,
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 6.5, cellPadding: 1.5, lineWidth: 0.1, lineColor: [180, 180, 180] },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' },
      1: { cellWidth: 5, halign: 'center' },
      2: { cellWidth: 90 },
      3: { cellWidth: 11, halign: 'center' },
      4: { cellWidth: 10, halign: 'center' },
      5: { cellWidth: 11, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 12, halign: 'center' },
      8: { cellWidth: 15, halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 8) {
        const val = data.cell.raw;
        if (val === 'APR') data.cell.styles.textColor = [0, 128, 0];
        if (val === 'REPN') data.cell.styles.textColor = [180, 0, 0];
        if (val === 'MATRICULADO') data.cell.styles.textColor = [0, 0, 180];
      }
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  /* ---- PÁGINA 2: LEGENDA + CARGA HORÁRIA + PENDENTES ---- */
  doc.addPage();
  y = 14;

  /* última linha de componentes (overflow example) */
  y = sectionTitle('Componentes Curriculares Cursados/Cursando (continuação)', y);
  autoTable(doc, {
    startY: y,
    head: [['Ano/Período\nLetivo', '', 'Componente Curricular', 'Hora\nAula', 'CH', 'Turma', 'Freq %', 'Média', 'Situação']],
    body: [
      ['XXXX.X', 'e', 'NOME DA DISCIPLINA EQUIV.\nProf. NOME DO PROFESSOR (XXh)', '72', '60', '02', '100,0', '-', 'TRANCADO'],
    ],
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 6.5, cellPadding: 1.5, lineWidth: 0.1, lineColor: [180, 180, 180] },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' }, 1: { cellWidth: 5, halign: 'center' },
      2: { cellWidth: 90 }, 3: { cellWidth: 11, halign: 'center' },
      4: { cellWidth: 10, halign: 'center' }, 5: { cellWidth: 11, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' }, 7: { cellWidth: 12, halign: 'center' },
      8: { cellWidth: 15, halign: 'center' },
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  /* ---- LEGENDA ---- */
  y = sectionTitle('Legenda', y);

  const legendaHead = [['SIGLA', 'SIGNIFICADO', 'SITUAÇÃO']];
  const legendaBody = [
    ['APR', 'Aprovado por média', 'Aluno aprovado com média maior ou igual a 7.0'],
    ['APRM', 'Aprovado por média final', 'Aluno aprovado com média final mínima igual a 5,5 após realização da prova final'],
    ['CANC', 'Cancelado', 'Matrícula em turma cancelada'],
    ['DISP', 'Dispensado', 'Aproveitou o componente e foi dispensado'],
    ['MATR', 'Matriculado na turma', ''],
    ['REC', 'Em recuperação', 'Aluno que fará reposição'],
    ['REP', 'Reprovado por média', 'Aluno com média inferior a 5,5'],
    ['REPF', 'Reprovado por falta', 'Reprovado por não atender os critérios de assiduidade'],
    ['REPMF', 'Reprovado por média e falta', 'Aluno com média inferior a 5,5 além de não atender aos critérios de assiduidade'],
    ['TRANC', 'Trancado', 'Matrícula em turma trancada'],
    ['TRANS', 'Transferido', 'Fez o componente em outra instituição e a aproveitou na instituição'],
    ['INCORP', 'Incorporado', 'Fez o componente durante mobilidade estudantil'],
    ['CUMP', 'Cumpriu', 'Fez o componente em outro curso anterior e aproveitou no curso atual'],
  ];

  autoTable(doc, {
    startY: y,
    head: legendaHead,
    body: legendaBody,
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 6.5, cellPadding: 1.5, lineWidth: 0.1, lineColor: [180, 180, 180] },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 45 }, 2: { cellWidth: 119 } },
  });

  y = doc.lastAutoTable.finalY + 6;

  /* ---- CARGA HORÁRIA ---- */
  y = sectionTitle('Carga Horária Integralizada/Pendente', y);

  autoTable(doc, {
    startY: y,
    head: [['', 'Obrigatórias', 'Optativos', 'Complementares', 'Total']],
    body: [
      ['Exigido',       'XXXX h', 'XXX h', 'XXX h', 'XXXX h'],
      ['Integralizado', 'XXX h',  '0 h',   '0 h',   'XXX h'],
      ['Pendente',      'XXXX h', 'XXX h', 'XXX h', 'XXXX h'],
    ],
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 7.5, cellPadding: 2, lineWidth: 0.1, lineColor: [180, 180, 180], halign: 'center' },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
  });

  y = doc.lastAutoTable.finalY + 6;

  /* ---- COMPONENTES PENDENTES ---- */
  y = sectionTitle('Componentes Curriculares Obrigatórios Pendentes: XX', y);

  autoTable(doc, {
    startY: y,
    head: [['Código', 'Componente Curricular', 'CH']],
    body: [
      ['COMP000', 'NOME DA DISCIPLINA PENDENTE 1', '72 h'],
      ['COMP001', 'NOME DA DISCIPLINA PENDENTE 2 - Matriculado', '72 h'],
      ['COMP002', 'NOME DA DISCIPLINA PENDENTE 3', '72 h'],
      ['COMP003', 'NOME DA DISCIPLINA PENDENTE 4', '72 h'],
      ['COMP004', 'NOME DA DISCIPLINA PENDENTE 5 - Matriculado', '75 h'],
      ['COMP005', 'NOME DA DISCIPLINA PENDENTE 6', '75 h'],
      ['COMP006', 'NOME DA DISCIPLINA PENDENTE 7', '72 h'],
      ['COMP007', 'NOME DA DISCIPLINA PENDENTE 8', '72 h'],
      ['COMP008', 'NOME DA DISCIPLINA PENDENTE 9', '72 h'],
      ['COMP009', 'NOME DA DISCIPLINA PENDENTE 10', '72 h'],
      ['TCC0000', 'TCC', '180 h'],
      ['ENADE',   'ENADE CONCLUINTE PENDENTE', '0 h'],
    ],
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 7, cellPadding: 1.8, lineWidth: 0.1, lineColor: [180, 180, 180] },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 145 }, 2: { cellWidth: 15, halign: 'center' } },
  });

  /* ---- PÁGINA 3: EQUIVALÊNCIAS + OBSERVAÇÕES ---- */
  doc.addPage();
  y = 14;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Histórico Acadêmico - Emitido em: ${dataEmissao}`, W / 2, y, { align: 'center' }); y += 5;
  doc.line(margemL, y, margemR, y); y += 6;

  labelValue('Nome:', 'NOME DO ALUNO', margemL, 28, y);
  labelValue('Matrícula:', 'XXXXXXXXX', 140, 160, y); y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Equivalências:', margemL, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Cumpriu COMP000 - DISCIPLINA A (72h) através de ECOM000 - DISCIPLINA A (60h)', margemL, y); y += 4.5;
  doc.text('Cumpriu COMP001 - DISCIPLINA B (72h) através de ECOM001 - DISCIPLINA B (60h)', margemL, y); y += 4.5;
  doc.text('Cumpriu COMP002 - DISCIPLINA C (72h) através de ECOM002 - DISCIPLINA C (60h)', margemL, y); y += 4.5;
  doc.text('Cumpriu COMP003 - DISCIPLINA D (72h) através de ECOM003 - DISCIPLINA D (60h)', margemL, y); y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Observações:', margemL, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const obs = '- Observação de exemplo decorrente de alguma resolução aplicável ao histórico do discente conforme normativas institucionais vigentes.';
  const obsLines = doc.splitTextToSize(obs, margemR - margemL);
  doc.text(obsLines, margemL, y); y += obsLines.length * 4.5 + 8;

  /* nota de status */
  const statusText = 'Status: FORMANDO: Provável Concluinte / FORMADO: Curso integralizado / CONCLUÍDO: Recebeu a outorga do grau / CANCELADO: Desligado da UFAL / EXCLUÍDO: Não tem vínculo com a UFAL / TRANCADO: Com suspensão de programa/curso no semestre letivo / ATIVO: Discente que tem vínculo com a UFAL / CADASTRADO: Candidato provável ingressante na UFAL. Atenção: o histórico possui verificação automática de autenticidade e consistência, sendo portanto dispensável a assinatura da coordenação do curso ou DRCA. Favor, ler as instruções no rodapé.';
  const statusLines = doc.splitTextToSize(statusText, margemR - margemL);
  doc.setFontSize(7);
  doc.text(statusLines, margemL, y);

  /* ---- RODAPÉ em todas as páginas ---- */
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setLineWidth(0.3);
    doc.line(margemL, 285, margemR, 285);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Para verificar a autenticidade deste documento entre em: http://sigaa.sig.ufal.br/sigaa/documentos/ informando a matrícula, data de emissão e o código de verificação: XXXXXXXXXX',
      W / 2, 289, { align: 'center' }
    );
    doc.text(`Página ${p} de ${totalPages}`, margemR, 289, { align: 'right' });
  }

  doc.save('historico_escolar.pdf');
}
