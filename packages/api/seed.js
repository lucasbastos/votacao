const fs = require('fs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:senha123@localhost:27017/votacao?authSource=admin';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    
    const db = client.db('votacao');
    
    // Verificar se já existem dados
    const jogosCount = await db.collection('jogos').countDocuments();
    const episodiosCount = await db.collection('episodios').countDocuments();
    
    if (jogosCount > 0 || episodiosCount > 0) {
      console.log('Banco de dados já contém dados. Pulando seed.');
      return;
    }
    
    // Ler e inserir jogos
    const jogosData = JSON.parse(fs.readFileSync('/app/jogos_2025.json', 'utf8'));
    if (jogosData && jogosData.length > 0) {
      await db.collection('jogos').insertMany(jogosData);
      console.log(`${jogosData.length} jogos inseridos com sucesso!`);
    }
    
    // Ler e inserir episódios
    const episodiosData = JSON.parse(fs.readFileSync('/app/episodios.json', 'utf8'));
    if (episodiosData && episodiosData.length > 0) {
      await db.collection('episodios').insertMany(episodiosData);
      console.log(`${episodiosData.length} episódios inseridos com sucesso!`);
    }
    
    console.log('Database seed concluído!');
  } catch (error) {
    console.error('Erro ao fazer seed do database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
