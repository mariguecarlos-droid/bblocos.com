require('dotenv').config();
const mysql = require('mysql2/promise');

async function viewContacts() {
    console.log("--- Consultando Contatos no Banco de Dados ---");

    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    };

    try {
        const connection = await mysql.createConnection(config);
        
        // Check if table exists first to avoid ugly error
        const [tables] = await connection.execute("SHOW TABLES LIKE 'contatos'");
        if (tables.length === 0) {
            console.log("⚠️ A tabela 'contatos' ainda não existe.");
            console.log("ℹ️ Inicie o servidor (npm start) uma vez para que ela seja criada automaticamente.");
        } else {
            const [rows] = await connection.execute('SELECT * FROM contatos');
            if (rows.length === 0) {
                console.log("📭 A tabela 'contatos' está vazia.");
            } else {
                console.log(`✅ Encontrados ${rows.length} contato(s):`);
                console.table(rows);
            }
        }

        await connection.end();
    } catch (err) {
        console.error("❌ Erro ao buscar contatos:", err.message);
    }
}

viewContacts();
