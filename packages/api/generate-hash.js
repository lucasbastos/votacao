const bcrypt = require('bcryptjs');

// Altere a senha abaixo para a que você deseja usar
const senha = 'admin123';

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('\n=== HASH GERADO ===');
  console.log('Adicione esta linha no arquivo .env:');
  console.log(`USER_PASSWORD_HASH=${hash}`);
  console.log('\nSenha original:', senha);
  console.log('==================\n');
});
