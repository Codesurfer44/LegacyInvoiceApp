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

    async searchInvoices(query) {
        if (!query || query.trim() === '') {
            return await this.getAll();
        }

        const searchTerm = `%${query}%`;
        const sql = `
            SELECT * FROM invoices 
            WHERE 
                invoiceNumber ILIKE $1 OR
                clientName ILIKE $1 OR
                clientEmail ILIKE $1 OR
                description ILIKE $1 OR
                status ILIKE $1
            ORDER BY createdAt DESC
            LIMIT 100
        `;
        
        const { rows } = await this.pool.query(sql, [searchTerm]);
        return rows;
    }

    async getLastNumber() {
        try {
            // Get the invoice number with the highest numeric suffix
            const { rows } = await this.pool.query(`
                SELECT invoiceNumber
                FROM invoices
                WHERE invoiceNumber ~ '^[A-Za-z]+[0-9]+$'
                ORDER BY 
                    CAST(REGEXP_REPLACE(invoiceNumber, '^[A-Za-z]+', '') AS INTEGER) DESC,
                    createdAt DESC
                LIMIT 1
            `);
            
            if (rows.length === 0) {
                return 0;
            }
            
            // Extract the numeric part from the invoice number (e.g., "001" from "INV001")
            const invoiceNumber = rows[0].invoicenumber;
            const numericPart = invoiceNumber.replace(/^[A-Za-z]+/, '');
            return parseInt(numericPart, 10) || 0;
        } catch (error) {
            console.error('Error in getLastNumber:', error);
            return 0;
        }
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