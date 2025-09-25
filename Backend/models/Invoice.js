/*
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class InvoiceModel {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));
        this.init();
    }

    init() {
        this.db.run(`CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoiceNumber TEXT UNIQUE NOT NULL,
            clientName TEXT NOT NULL,
            clientEmail TEXT,
            amount DECIMAL(10,2) NOT NULL,
            description TEXT,
            invoiceDate TEXT,
            dueDate TEXT,
            currency TEXT DEFAULT 'USD',
            status TEXT DEFAULT 'Pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }

    async create(invoice) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO invoices (
                invoiceNumber, clientName, clientEmail, amount, 
                description, invoiceDate, dueDate, currency
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            this.db.run(sql, [
                invoice.invoiceNumber,
                invoice.clientName,
                invoice.clientEmail,
                invoice.amount,
                invoice.description,
                invoice.invoiceDate,
                invoice.dueDate,
                invoice.currency || 'USD'
            ], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...invoice });
            });
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM invoices ORDER BY createdAt DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async getById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM invoices WHERE id = ?', [parseInt(id, 10)], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async getByNumber(invoiceNumber) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM invoices WHERE invoiceNumber = ?',
                [invoiceNumber],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    async getLastNumber() {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT MAX(CAST(invoiceNumber AS INTEGER)) as lastNumber FROM invoices',
                [],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row && row.lastNumber ? row.lastNumber : 0);
                }
            );
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM invoices WHERE id = ?';
            this.db.run(sql, [parseInt(id, 10)], function(err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = new InvoiceModel();

*/

const { Pool } = require('pg');
require('dotenv').config();

class InvoiceModel {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
        this.init();
    }

    async init() {
        const sql = `
            CREATE TABLE IF NOT EXISTS invoices (
                id SERIAL PRIMARY KEY,
                invoiceNumber TEXT UNIQUE NOT NULL,
                clientName TEXT NOT NULL,
                clientEmail TEXT,
                amount NUMERIC(10,2) NOT NULL,
                description TEXT,
                invoiceDate DATE,
                dueDate DATE,
                currency TEXT DEFAULT 'USD',
                status TEXT DEFAULT 'Pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await this.pool.query(sql);
    }

    async create(invoice) {
        const sql = `
            INSERT INTO invoices (
                invoiceNumber, clientName, clientEmail, amount, 
                description, invoiceDate, dueDate, currency
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            invoice.invoiceNumber,
            invoice.clientName,
            invoice.clientEmail,
            invoice.amount,
            invoice.description,
            invoice.invoiceDate,
            invoice.dueDate,
            invoice.currency || 'USD'
        ];
        const { rows } = await this.pool.query(sql, values);
        return rows[0];
    }

    async getAll() {
        const { rows } = await this.pool.query(
            'SELECT * FROM invoices ORDER BY createdAt DESC'
        );
        return rows;
    }

    async getById(id) {
        const { rows } = await this.pool.query(
            'SELECT * FROM invoices WHERE id = $1',
            [id]
        );
        return rows[0];
    }

    async getByNumber(invoiceNumber) {
        const { rows } = await this.pool.query(
            'SELECT * FROM invoices WHERE invoiceNumber = $1',
            [invoiceNumber]
        );
        return rows[0];
    }

    async getLastNumber() {
        const { rows } = await this.pool.query(
            `SELECT MAX(CAST(invoiceNumber AS INTEGER)) as lastNumber FROM invoices`
        );
        return rows[0]?.lastnumber || 0;
    }

    async delete(id) {
        const { rowCount } = await this.pool.query(
            'DELETE FROM invoices WHERE id = $1',
            [id]
        );
        return { changes: rowCount };
    }
}

module.exports = new InvoiceModel();
