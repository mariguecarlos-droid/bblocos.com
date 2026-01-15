require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    console.log("--- Configurando Banco de Dados ---");

    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    };

    try {
        const connection = await mysql.createConnection(config);
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contatos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                telefone VARCHAR(20) NOT NULL UNIQUE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createTableQuery);
        console.log("✅ Tabela 'contatos' criada (ou verificada) com sucesso!");

        await connection.end();
    } catch (err) {
        console.error("❌ Erro ao configurar banco:", err.message);
    }
}

setupDatabase();
