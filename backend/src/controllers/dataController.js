const Especialidade = require("../models/especialidade.js");
const Procedimento = require("../models/procedimentos.js");
const Profissional = require("../models/profissional.js");
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
exports.getProfissionais = (req, res, next) => {
  Profissional.findAll()
    .then((profissionais) => {
      if (profissionais) {
        res.status(status.OK).send(profissionais);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
