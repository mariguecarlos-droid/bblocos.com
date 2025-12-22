const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Conecta ao banco de dados PostgreSQL usando a connection string do Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verifica a conexão e cria a tabela
pool.query(`
    CREATE TABLE IF NOT EXISTS contatos (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL UNIQUE
    )
`).then(() => {
    console.log("Tabela 'contatos' pronta.");
}).catch(err => {
    console.error("Erro ao criar a tabela:", err.message);
});


// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// --- Rota de Cadastro ---
app.post('/cadastrar', async (req, res) => {
    const { nome, telefone } = req.body;

    if (!nome || !telefone) {
        return res.status(400).json({ message: 'Nome e Telefone são obrigatórios.' });
    }

    const sql = `INSERT INTO contatos (nome, telefone) VALUES ($1, $2) RETURNING id`;

    try {
        const result = await pool.query(sql, [nome, telefone]);
        const newId = result.rows[0].id;
        console.log(`Novo contato cadastrado com ID: ${newId}`);
        
        res.status(201).json({ 
            message: 'Cadastro realizado com sucesso!',
            contatoId: newId 
        });

    } catch (err) {
        if (err.code === '23505') { // Código de erro para violação de unicidade no PostgreSQL
            console.error("Erro de cadastro: Telefone já existe.", telefone);
            return res.status(409).json({ message: 'Este telefone já está cadastrado.' });
        }
        console.error("Erro ao inserir no banco de dados:", err.message);
        return res.status(500).json({ message: 'Erro interno ao tentar realizar o cadastro.' });
    }
});

// --- Rota para Listar Contatos ---
app.get('/contatos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contatos ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro ao buscar contatos:", err.message);
        res.status(500).json({ message: 'Erro ao buscar contatos.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor backend rodando na porta ${port}`);
});