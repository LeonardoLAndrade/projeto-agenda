const Especialidade = require("../models/especialidade.js");
const Procedimento = require("../models/procedimentos.js");
const Ag_Profissional = require("../models/ag_profissionais.js");
const status = require("http-status");

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
