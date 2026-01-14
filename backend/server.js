const express = require('express');
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Dynamic Import for MySQL to prevent crash if not installed
let mysql;
try {
    mysql = require('mysql2/promise');
} catch (e) {
    console.warn("⚠️ Módulo 'mysql2' não encontrado. Instale com 'npm install mysql2' para suporte a MySQL.");
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// --- Database Configuration (Universal: Postgres, MySQL, SQLite) ---
let query; // Function to execute queries (unified interface)
let dbType; // 'postgres', 'mysql', 'sqlite'

async function initializeDatabase() {
    const dbUrl = process.env.DATABASE_URL || '';
    
    // 1. PostgreSQL Strategy
    if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
        dbType = 'postgres';
        console.log("Ambiente: PostgreSQL detectado.");
        
        const pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false }
        });

        query = async (text, params) => {
            return pool.query(text, params);
        };

        // Create Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contatos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL UNIQUE
            )
        `).then(() => console.log("✅ Tabela 'contatos' (Postgres) pronta."))
          .catch(err => console.error("❌ Erro Postgres:", err.message));
    }
    
    // 2. MySQL Strategy (Common for Hostinger)
    else if (
        (dbUrl.startsWith('mysql://')) || 
        (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
    ) {
        if (!mysql) {
            console.error("❌ Erro Crítico: Configuração MySQL detectada, mas o módulo 'mysql2' não está instalado.");
            console.log("ℹ️ Tentando fallback para SQLite para manter o servidor online...");
            // Fallback continues to SQLite block below if we don't return here.
            // Let's force fallback by not entering this block if mysql is missing.
        } else {
            dbType = 'mysql';
            console.log("Ambiente: MySQL detectado.");

            let connectionConfig;
            if (dbUrl.startsWith('mysql://')) {
                connectionConfig = dbUrl;
            } else {
                connectionConfig = {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD || process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT || 3306
                };
            }

            try {
                const pool = mysql.createPool(connectionConfig);
                
                // Test connection
                await pool.getConnection();

                query = async (text, params) => {
                    // Convert Postgres syntax ($1, $2...) to MySQL/SQLite syntax (?, ?...)
                    const mysqlQuery = text.replace(/\$\d+/g, '?');
                    const [rows, fields] = await pool.execute(mysqlQuery, params);
                    return { rows }; 
                };

                // Create Table
                await pool.execute(`
                    CREATE TABLE IF NOT EXISTS contatos (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(255) NOT NULL,
                        telefone VARCHAR(20) NOT NULL UNIQUE
                    )
                `);
                console.log("✅ Tabela 'contatos' (MySQL) pronta.");
                return; // Exit function, success
            } catch (err) {
                console.error("❌ Erro MySQL:", err.message);
                console.log("ℹ️ Falha na conexão MySQL. Tentando fallback para SQLite...");
            }
        }
    }
    
    // 3. SQLite Strategy (Fallback / Local)
    dbType = 'sqlite';
    console.log("Ambiente: Local (SQLite).");

    const db = new sqlite3.Database(path.join(__dirname, 'local_database.db'), (err) => {
        if (err) console.error("❌ Erro SQLite:", err.message);
    });

    query = (text, params = []) => {
        return new Promise((resolve, reject) => {
            const sqliteQuery = text.replace(/\$\d+/g, '?');
            
            if (text.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sqliteQuery, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            } else {
                db.run(sqliteQuery, params, function (err) {
                    if (err) reject(err);
                    else resolve({ rows: [{ id: this.lastID, ...params }] }); 
                });
            }
        });
    };

    db.run(`
        CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL UNIQUE
        )
    `, (err) => {
        if (err) console.error("❌ Erro ao criar tabela SQLite:", err.message);
        else console.log("✅ Tabela 'contatos' (SQLite) pronta.");
    });
}

// Initialize DB immediately
initializeDatabase();

// --- Routes ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.post('/cadastrar', async (req, res) => {
    const { nome, telefone } = req.body;

    if (!nome || !telefone) {
        return res.status(400).json({ message: 'Nome e Telefone são obrigatórios.' });
    }

    // Using PG syntax ($1, $2) - the 'query' wrapper handles conversion for MySQL/SQLite
    const sql = `INSERT INTO contatos (nome, telefone) VALUES ($1, $2)`;

    try {
        await query(sql, [nome, telefone]);
        console.log(`Novo contato: ${nome} - ${telefone}`);
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' });

    } catch (err) {
        // Handle Unique Constraint Violation (covers PG code '23505' and general SQL errors)
        const errorMsg = err.message || '';
        if (err.code === '23505' || err.code === 'ER_DUP_ENTRY' || errorMsg.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Este telefone já está cadastrado.' });
        }
        console.error("Erro no cadastro:", err);
        return res.status(500).json({ message: 'Erro interno ao tentar realizar o cadastro.' });
    }
});

app.get('/contatos', async (req, res) => {
    try {
        const result = await query('SELECT * FROM contatos ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro ao buscar contatos:", err.message);
        res.status(500).json({ message: 'Erro ao buscar contatos.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend rodando na porta ${port}`);
});