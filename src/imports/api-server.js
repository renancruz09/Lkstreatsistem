const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

/* ========================
   BANCO DE DADOS
======================== */

const db = new sqlite3.Database("./database.db");

// Ativar foreign keys
db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            estoque INTEGER NOT NULL CHECK (estoque >= 0)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            total REAL NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        )
    `);
});

/* ========================
   ROTAS API
======================== */

// LISTAR PRODUTOS
app.get("/api/produtos", (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// ADICIONAR PRODUTO
app.post("/api/produtos", (req, res) => {
    const { nome, preco, estoque } = req.body;

    const p = parseFloat(preco);
    const e = parseInt(estoque);

    if (!nome || isNaN(p) || isNaN(e) || e < 0 || p < 0) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    db.run(
        "INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)",
        [nome.trim(), p, e],
        function (err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// REALIZAR VENDA (COM TRANSACTION)
app.post("/api/venda", (req, res) => {
    const { produto_id, quantidade } = req.body;
    const qtd = parseInt(quantidade);

    if (isNaN(qtd) || qtd <= 0) {
        return res.status(400).json({ erro: "Quantidade inválida" });
    }

    db.get("SELECT * FROM produtos WHERE id = ?", [produto_id], (err, produto) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
        if (produto.estoque < qtd)
            return res.status(400).json({ erro: "Estoque insuficiente" });

        const total = produto.preco * qtd;

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            db.run(
                "INSERT INTO vendas (produto_id, quantidade, total) VALUES (?, ?, ?)",
                [produto_id, qtd, total],
                function (err) {
                    if (err) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ erro: err.message });
                    }
                }
            );

            db.run(
                "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
                [qtd, produto_id],
                function (err) {
                    if (err) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ erro: err.message });
                    }

                    db.run("COMMIT");
                    res.json({ sucesso: true, total });
                }
            );
        });
    });
});

// RELATÓRIO
app.get("/api/relatorio", (req, res) => {
    db.get("SELECT SUM(total) as faturamento FROM vendas", [], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });

        const faturamento = row && row.faturamento ? row.faturamento : 0;

        res.json({ faturamento });
    });
});

/* ========================
   TRATAMENTO GLOBAL
======================== */

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(