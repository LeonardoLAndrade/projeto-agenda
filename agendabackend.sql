USE agendabackend;

INSERT INTO `especialidades` (`cod_especialidade`, `nome_especialidade`) VALUES
("00", 'BIOMEDICINA'),
("10", 'ENFERMAGEM'),
("20", 'ESTÉTICA E COSMETODOLOGIA'),
("30", 'FISIOTERAPIA'),
("40", 'NUTRIÇÃO'),
("50", 'ODONTOLOGIA'),
("70", 'PSICOLOGIA'),
("80", 'NPJ'),
("90", 'MEDICINA');

INSERT INTO `procedimentos` (`id_procedimento`, `procedimento`, `cod_especialidade`) VALUES
(2, 'COLETA DE SANGUE PARA BIÓPSIA LÍQUIDA', "10"),
(3, 'COLETA DE SANGUE PARA HEMOGRAMA COMPLETO', "10"),
(4, 'COLETA DE SANGUE PARA TESTE DE GLICOSE', "10"),
(5, 'COLETA DE SANGUE PARA PERFIL LIPÍDICO', "10"),
(6, 'COLETA DE SANGUE PARA EXAME DE FUNÇÃO HEPÁTICA', "10"),
(7, 'LIMPEZA DE PELE PROFUNDA', "20"),
(8, 'PEELING QUÍMICO', "20"),
(9, 'MICRODERMOABRASÃO', "20"),
(10, 'APLICAÇÃO DE BOTOX E PREENCHIMENTO', "20"),
(11, 'TRATAMENTO CORPORAL (MASSASGEM MODELADORA)', "20"),
(12, 'TERAPIA MANUAL', "30"),
(13, 'EXERCICÍOS TERAPÊUTICOS', "30"),
(15, 'ELETROTERAPIA', "30"),
(16, 'ULTRASSOM TERAPÊUTICA', "30"),
(17, 'HIDROTERAPIA', "30"),
(18, 'AVALIAÇÃO NUTRICIONAL', "40"),
(19, 'PLANEJAMENTO ALIMENTAR PERSONALIZADO', "40"),
(20, 'ACONCELHAMENTO NUTRICIONAL E EDUCAÇÃO ALIMENTAR', "40"),
(21, 'SUPORTE NUTRICIONAL CLINICO', "40"),
(22, 'MONITORAMENTO E ACOMPANHAMENTO', "40"),
(23, 'LIMPEZA DENTÁRIA PROFUNDA (PROFILAXIA)', "50"),
(24, 'OBTURAÇÕES (RESTAURADORAS)', "50"),
(25, 'TRATAMENTO DE CANAL (ENDODONTIA)', "50"),
(26, 'EXODONTIA (EXTRAÇÃO DENTÁRIA)', "50"),
(27, 'IMPLANTE DENTÁRIOS', "50"),
(28, 'ANÁLISES CLÍNICAS', "00"),
(29, 'DIAGNÓSTICO POR IMAGEM', "00"),
(30, 'BIOLOGIA MOLECULAR E GENÉTICA', "00"),
(31, 'ANÁLISES TOXICOLÓGICAS', "00"),
(32, 'BANCO DE SANGUE E HEMOTERAPIA', "00"),
(33, 'PSICOTERAPIA', "70"),
(34, 'AVALIAÇÃO PSICOLÓGIA', "70"),
(35, 'INTERVENÇÃO EM CRISES', "70"),
(36, 'ACONSELHAMENTO PSICOLÓGICO', "70"),
(37, 'PSICOEDUCAÇÃO', "70"),
(38, 'ATENDIMENTO AO PÚBLICO', "80"),
(39, 'ELABORAÇÃO DE PETIÇÕES E DOCUMENTOS JURÍDICOS', "80"),
(40, 'ACOMPANHAMENTO PROCESSUAL', "80"),
(41, 'MEDIAÇÃO E CONCILIAÇÃO', "80"),
(42, 'ORIENTAÇÃO E ACESSORIA JURÍDICA', "80"),
(43, 'CONSULTA MÉDICA', "90"),
(44, 'PRESCRIÇÃO DE MEDICAMENTOS', "90"),
(45, 'REALIZAÇÃO DE CIRURGIA', "90"),
(46, 'EXAMES DIAGNÓSTICOS', "90"),
(47, 'PROCEDIMENTOS CLÍNICOS', "90");

INSERT INTO `ag_profissionais` (`id_profissional`, `nome_profissional`, `cod_especialidade`) VALUES
(2, 'ANNA GOMES DE OLIVEIRA', "10"),
(3, 'LUCAS SANTOS ANDRADE', "10"),
(4, 'LEONARDO PEREIRA DOS ANJOS', "10"),
(5, 'ALICE NOBREGA DE ALCÂNTARA', "20"),
(6, 'LARISSA NUNES DA SILVA', "20"),
(7, 'DIEGO RIBEIRO COSTA', "20"),
(8, 'JULIANA PEREIRA LEMES', "30"),
(9, 'BRUNO ALMEIDA PINHO', "30"),
(10, 'MARIA SILVA MARTINS', "30"),
(11, 'ISABELA RODRIGUES DOS SANTOS', "40"),
(12, 'MARIANA DA SILVA', "40"),
(13, 'FAGNER RODRIGES DE ANDRADE', "40"),
(14, 'ANDRÉ LIMA DOS SANTOS', "50"),
(15, 'BRUNO ALMEIDA DA SILVA', "50"),
(16, 'GUILHERME VIEIRA DE ARAUJO', "50"),
(17, 'PEDRO SOUSA ', "00"),
(18, 'CAMILA MEDEIROS ', "00"),
(19, 'SAMIRA PEREIRA FERREIRA', "00"),
(20, 'ANGELA DE ASSIS', "70"),
(21, 'LEANDRO DOS SANTOS', "70"),
(22, 'JOÃO GUILHERME LEMES', "70"),
(23, 'LEONARDO MIRANDO DA SILVA', "80"),
(24, 'WILLIAN OLIVEIRA SILVA', "80"),
(25, 'CAROLINA FERNANDES', "80"),
(26, 'JAIR MESSIAS SILVA', "90"),
(27, 'ANGELO MATHEUS MARTINEZ', "90"),
(28, 'ROBERT PETERSON JUNIOR', "90");