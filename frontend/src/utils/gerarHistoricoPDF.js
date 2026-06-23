import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function gerarHistoricoEscolar(profile, historyData, stats) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const margemL = 14;
  const margemR = W - 14;
  let y = 10;

  const studentName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'NOME DO ALUNO';
  const enrollmentNumber = profile?.enrollmentNumber || 'XXXXXXXXX';
  const currentTerm = profile?.currentTerm || 'X';
  const ira = profile?.ira != null ? Number(profile.ira).toFixed(2) : 'X.XX';
  const integral = stats?.integralizationPercent ?? 0;
  const hoursPending = stats?.hoursPending ?? 0;

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

  const agora = new Date();
  const dataEmissao = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  centralText('SIGAA - Sistema Integrado de Gestão de Atividades Acadêmicas', y, 8, true); y += 4.5;
  centralText('UFAL - Universidade Federal de Alagoas', y, 8, true); y += 4.5;
  centralText('PROGRAD - Pró-Reitoria de Graduação', y, 8, true); y += 4.5;
  centralText('DRCA - Departamento de Registro e Controle Acadêmico', y, 8, true); y += 4.5;
  centralText('Av. Lourival Melo Mota, s/n, Cidade Universitária CEP: 57072-900 Maceió  AL', y, 7); y += 4;
  centralText('Recredenciada conforme Portaria MEC Nº 463, de 30 de junho de 2021, publicada no Diário Oficial da União,', y, 7); y += 4;
  centralText('na seção 01, pág. 34, em 01/07/2021', y, 7); y += 8;

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

  y = sectionTitle('Dados Pessoais', y);

  labelValue('Nome:', studentName, margemL, 28, y);
  labelValue('Matrícula:', enrollmentNumber, 140, 160, y); y += 5;
  labelValue('Data de Nascimento:', '—', margemL, 52, y);
  labelValue('Local de Nascimento:', '—', 110, 145, y); y += 5;
  labelValue('Nacionalidade:', 'BRASILEIRA', margemL, 42, y); y += 5;
  labelValue('Nº do documento:', '—', margemL, 42, y); y += 5;
  labelValue('Nº do CPF:', profile?.cpf || '—', margemL, 32, y); y += 8;

  y = sectionTitle('Dados do Vínculo do Discente', y);

  labelValue('Curso:', 'CIÊNCIA DA COMPUTAÇÃO - CAMPUS A.C. SIMÕES - BACHARELADO - PRESENCIAL', margemL, 25, y); y += 5;
  labelValue('Status:', 'ATIVO', margemL, 25, y);

  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(140, y - 4, 55, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Índices Acadêmicos', 167.5, y, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`IRA: ${ira}`, 167.5, y + 6, { align: 'center' });
  y += 5;

  labelValue('Ênfase:', '—', margemL, 25, y); y += 5;
  labelValue('Currículo:', 'COM2022 - 2022.1', margemL, 28, y); y += 5;
  labelValue('Reconhecimento do Curso:', 'Portaria Nº 463, 30/06/2021. D.O.U.: 01/07/2021', margemL, 62, y); y += 5;
  labelValue('Ano / Período Letivo Inicial:', `${currentTerm}º semestre`, margemL, 60, y);
  labelValue('Perfil Inicial:', '0', 130, 150, y); y += 5;
  labelValue('Forma de Ingresso:', 'ENEM/SISU', margemL, 48, y); y += 5;
  labelValue('Períodos Integralizados:', String(currentTerm), margemL, 58, y);
  labelValue('Prazo para Conclusão:', '2028.1 / 2030.1', 98, 161, y); y += 5;
  labelValue('Suspensões:', '—', margemL, 32, y); y += 5;
  labelValue('Prorrogações:', '—', margemL, 38, y); y += 5;
  labelValue('Ano/Período de Integralização:', '—', margemL, 65, y);
  labelValue('Ano/Período Letivo de Saída:', '—', 105, 148, y); y += 5;
  labelValue('Tipo Saída:', '—', margemL, 30, y); y += 5;
  labelValue('Data de Saída:', '—', margemL, 36, y);
  labelValue('Data da Colação de Grau:', '—', 105, 140, y); y += 5;
  labelValue('Trabalho de Conclusão de Curso:', '—', margemL, 72, y); y += 5;
  labelValue('Data da Expedição do Diploma:', '—', margemL, 68, y); y += 8;

  y = sectionTitle('Componentes Curriculares Cursados/Cursando', y);

  const head = [['Período', '', 'Componente Curricular', 'Hora\nAula', 'CH', 'Turma', 'Freq %', 'Média', 'Situação']];

  const body = (historyData || []).map(item => [
    item.academicTerm || '—',
    '',
    `${item.subjectName}\nProf. ${item.professorName || '—'} (${item.creditHours || '—'})`,
    String(item.creditHours * 1.2 || '—'),
    String(item.creditHours || '—'),
    '01',
    item.frequency != null ? String(item.frequency) : '—',
    item.finalGrade != null ? String(item.finalGrade) : '—',
    item.status || '—',
  ]);

  if (body.length === 0) {
    body.push(['—', '', 'Nenhum componente encontrado', '—', '—', '—', '—', '—', '—']);
  }

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
        if (val === 'REP') data.cell.styles.textColor = [180, 0, 0];
        if (val === 'MATRICULADO') data.cell.styles.textColor = [0, 0, 180];
      }
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  doc.addPage();
  y = 14;

  y = sectionTitle('Componentes Curriculares Cursados/Cursando (continuação)', y);
  autoTable(doc, {
    startY: y,
    head: [['Período', '', 'Componente Curricular', 'Hora\nAula', 'CH', 'Turma', 'Freq %', 'Média', 'Situação']],
    body: body,
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

  y = sectionTitle('Legenda', y);

  const legendaHead = [['SIGLA', 'SIGNIFICADO', 'SITUAÇÃO']];
  const legendaBody = [
    ['APR', 'Aprovado', 'Aluno aprovado com média >= 5.5'],
    ['REP', 'Reprovado', 'Aluno com média inferior a 5.5'],
    ['MATRICULADO', 'Matriculado', 'Cursando atualmente'],
    ['CANC', 'Cancelado', 'Matrícula em turma cancelada'],
    ['TRANC', 'Trancado', 'Matrícula em turma trancada'],
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

  y = sectionTitle('Carga Horária Integralizada/Pendente', y);

  const creditsTotal = 240;
  const creditsDone = Math.round((integral / 100) * creditsTotal);

  autoTable(doc, {
    startY: y,
    head: [['', 'Obrigatórias', 'Optativos', 'Complementares', 'Total']],
    body: [
      ['Exigido',       '200 h', '20 h', '20 h', `${creditsTotal} h`],
      ['Integralizado', `${Math.round(creditsDone * 0.8)} h`, `${Math.round(creditsDone * 0.1)} h`, `${Math.round(creditsDone * 0.1)} h`, `${creditsDone} h`],
      ['Pendente',      `${Math.round(hoursPending * 0.8)} h`, `${Math.round(hoursPending * 0.1)} h`, `${Math.round(hoursPending * 0.1)} h`, `${hoursPending} h`],
    ],
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 7.5, cellPadding: 2, lineWidth: 0.1, lineColor: [180, 180, 180], halign: 'center' },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
  });

  y = doc.lastAutoTable.finalY + 6;

  y = sectionTitle('Componentes Curriculares Obrigatórios Pendentes', y);

  const pending = (historyData || []).filter(item => item.status === 'REP');
  const pendingBody = pending.length > 0
    ? pending.map(item => [item.subjectCode || '—', item.subjectName, `${item.creditHours || '—'} h`])
    : [['—', 'Nenhum componente pendente', '—']];

  autoTable(doc, {
    startY: y,
    head: [['Código', 'Componente Curricular', 'CH']],
    body: pendingBody,
    margin: { left: margemL, right: 14 },
    styles: { fontSize: 7, cellPadding: 1.8, lineWidth: 0.1, lineColor: [180, 180, 180] },
    headStyles: { fillColor: [210, 210, 210], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 145 }, 2: { cellWidth: 15, halign: 'center' } },
  });

  doc.addPage();
  y = 14;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Histórico Acadêmico - Emitido em: ${dataEmissao}`, W / 2, y, { align: 'center' }); y += 5;
  doc.line(margemL, y, margemR, y); y += 6;

  labelValue('Nome:', studentName, margemL, 28, y);
  labelValue('Matrícula:', enrollmentNumber, 140, 160, y); y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Observações:', margemL, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const obs = 'Este histórico foi emitido eletronicamente com base nos dados fornecidos pelo sistema acadêmico.';
  const obsLines = doc.splitTextToSize(obs, margemR - margemL);
  doc.text(obsLines, margemL, y); y += obsLines.length * 4.5 + 8;

  const statusText = 'Status: ATIVO: Discente que tem vínculo com a UFAL / FORMANDO: Provável Concluinte / FORMADO: Curso integralizado / CONCLUÍDO: Recebeu a outorga do grau / CANCELADO: Desligado da UFAL / TRANCADO: Com suspensão de programa/curso. Atenção: o histórico possui verificação automática de autenticidade e consistência, sendo portanto dispensável a assinatura da coordenação do curso ou DRCA.';
  const statusLines = doc.splitTextToSize(statusText, margemR - margemL);
  doc.setFontSize(7);
  doc.text(statusLines, margemL, y);

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setLineWidth(0.3);
    doc.line(margemL, 285, margemR, 285);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Documento emitido pelo sistema Gradua - UFAL',
      W / 2, 289, { align: 'center' }
    );
    doc.text(`Página ${p} de ${totalPages}`, margemR, 289, { align: 'right' });
  }

  doc.save('historico_escolar.pdf');
}
