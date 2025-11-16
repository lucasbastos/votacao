db = db.getSiblingDB('votacao');

// Criar coleções se não existirem
db.createCollection('jogos');
db.createCollection('episodios');
db.createCollection('votos');
db.createCollection('votosEpisodios');

print('Banco de dados votacao inicializado com sucesso!');
print('Coleções criadas: jogos, episodios, votos, votosEpisodios');
