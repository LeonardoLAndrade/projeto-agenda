const Especialidade = require("../models/especialidade.js");
const Procedimento = require("../models/procedimentos.js");
const Ag_Profissional = require("../models/ag_profissionais.js");
const status = require("http-status");

// Relacionamento: Profissional tem muitas Especialidades
Profissional.belongsToMany(Especialidade, { through: "ProfissionalEspecialidade" });
Especialidade.belongsToMany(Profissional, { through: "ProfissionalEspecialidade" });

// Especialidade tem muitos Procedimentos
Especialidade.belongsToMany(Procedimento, { through: "EspecialidadeProcedimento" });
Procedimento.belongsToMany(Especialidade, { through: "EspecialidadeProcedimento" });



exports.getProfissionaisPorEspecialidade = (req, res, next) => {
  const especialidadeId = req.params.especialidadeId;

  Especialidade.findByPk(especialidadeId, {
    include: {
      model: Profissional,
      through: { attributes: [] } // Não incluir os dados da tabela de junção
    }
  })
    .then((especialidade) => {
      if (especialidade) {
        res.status(status.OK).send(especialidade.Profissionais); // Enviar os profissionais dessa especialidade
      } else {
        res.status(status.NOT_FOUND).send({ message: "Especialidade não encontrada" });
      }
    })
    .catch((error) => next(error));
};

exports.getEspecialidadesPorProfissional = (req, res, next) => {
  const profissionalId = req.params.profissionalId;

  Profissional.findByPk(profissionalId, {
    include: {
      model: Especialidade,
      include: {
        model: Procedimento, // Incluir também os procedimentos da especialidade
        through: { attributes: [] }
      },
      through: { attributes: [] }
    }
  })
    .then((profissional) => {
      if (profissional) {
        res.status(status.OK).send(profissional.Especialidades); // Enviar especialidades com procedimentos
      } else {
        res.status(status.NOT_FOUND).send({ message: "Profissional não encontrado" });
      }
    })
    .catch((error) => next(error));
};

exports.getProcedimentosPorEspecialidade = (req, res, next) => {
  const especialidadeId = req.params.especialidadeId;

  Especialidade.findByPk(especialidadeId, {
    include: {
      model: Procedimento,
      through: { attributes: [] } // Excluir os dados da tabela de junção
    }
  })
    .then((especialidade) => {
      if (especialidade) {
        res.status(status.OK).send(especialidade.Procedimentos); // Enviar os procedimentos dessa especialidade
      } else {
        res.status(status.NOT_FOUND).send({ message: "Especialidade não encontrada" });
      }
    })
    .catch((error) => next(error));
};




// Método para buscar todas as especialidades
exports.getEspecialidades = (req, res, next) => {
  Especialidade.findAll()
    .then((especialidades) => {
      if (especialidades) {
        res.status(status.OK).send(especialidades);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

// Método para buscar todos os procedimentos
exports.getProcedimentos = (req, res, next) => {
  Procedimento.findAll()
    .then((procedimentos) => {
      if (procedimentos) {
        res.status(status.OK).send(procedimentos);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

// Método para buscar todos os profissionais
exports.getAgProfissionais = (req, res, next) => {
  Ag_Profissional.findAll()
    .then((ag_profissionais) => {
      if (ag_profissionais) {
        res.status(status.OK).send(ag_profissionais);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

