const express = require('express');
const app = express();
const { Pool } = require('pg');
const pool = require('./db');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
    next();
});

app.get('/', (req, res) => {
    res.send('Bem-vindo ao sistema de Agenda de Alunos!');
});

app.get('/alunos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM agenda_alunos');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        res.status(500).json({ message: 'Erro ao listar alunos' });
    }
});

app.post('/alunos', async (req, res) => {
    const { nome, email, data_nascimento, matricula, cpf } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO agenda_alunos (nome, email, data_nascimento, matricula, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, data_nascimento, matricula, cpf]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar aluno:', error);
        res.status(500).json({ message: 'Erro ao adicionar aluno' });
    }
});

app.delete('/alunos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM agenda_alunos WHERE id = $1', [id]);
        res.status(200).json({ message: 'Aluno excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        res.status(500).json({ message: 'Erro ao excluir aluno' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
