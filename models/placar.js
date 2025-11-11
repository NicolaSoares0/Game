const { DataTypes } = require('sequelize');
const sequelize = require('../DataBase/placarBD'); 

const Placar = sequelize.define('placar', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  acertos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalQuestoes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  porcentagem: {
    type: DataTypes.FLOAT
  }
});

Placar.sync()
  .then(() => {
    console.log('Tabela "Placar" sincronizada com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar tabela "Placar":', error);
  });

module.exports = Placar;