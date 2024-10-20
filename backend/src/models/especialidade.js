const Sequelize = require("sequelize");
const sequelize = require("../database/database.js");

const Especialidade = sequelize.define(
  "especialidade",
  {
    cod_especialidade: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    nome_especialidade: {
      allowNull: false,
      type: Sequelize.STRING(40),
      validate: {
        len: [3, 40],
      },
    },
  },
  {
    timestamps: false, // não adicionar os campos createdAt e updatedAt automaticamente
  }
);

module.exports = Especialidade;
