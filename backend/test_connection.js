require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log("--- Teste de Conexão MySQL ---");
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Port: ${process.env.DB_PORT || 3306}`);

    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        connectTimeout: 10000 // 10 seconds timeout
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log("✅ Conexão bem-sucedida!");
        
        // Test query
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log("✅ Query de teste executada. Resultado:", rows[0].solution);

        await connection.end();
    } catch (err) {
        console.error("❌ Falha na conexão:");
        console.error("Código:", err.code);
        console.error("Mensagem:", err.message);
        
        if (err.code === 'ETIMEDOUT') {
            console.log("\nDica: Verifique se o IP deste servidor está permitido na seção 'Remote MySQL' do painel da Hostinger.");
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("\nDica: Verifique se o usuário ou senha estão corretos.");
        } else if (err.code === 'ENOTFOUND') {
            console.log("\nDica: Verifique se o 'DB_HOST' está correto.");
        }
    }
}

testConnection();
