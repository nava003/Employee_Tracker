// Import requirements
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

// Initialize port and instance for Express.js
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware to parse application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
    {
        host: 'localhost' || '127.0.0.1',
        user: 'root',
        password: '`5YDX#OO_&2r/L6}Nz',
        database: 'company_db'
    },
    console.log('Successfully connected to company_db database.\n')
);

