const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './quiz.sqlite' 
});


async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados (SQLite) estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

testarConexao();


module.exports = sequelize;