// Import requirements
const express = require('express');
const inquirer = require('inquirer');
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

const questions = [
    {
        type: "list",
        name: "mainMenu",
        message: "Please select the following options:",
        choices: ['View all Departments', 'View all Roles', 'View all Employees\n',
        'View Employees by Manager', 'View Employees by Department\n',
        'View a Department Budget\n',
        'Add a Department', 'Add a Role', 'Add an Employee\n',
        'Update an Employee Role', 'Update Managers\n',
        'Delete a Department', 'Delete a Role', 'Delete an Employee\n'],
    },
    {},
    {},
    {},
    {},
];

console.log(`
_______________________________________________________
|                                                     |
|    _____                 _                          |
|   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    |
|   |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\   |
|   | |___| | | | | | |_) | | (_) | |_| |  __/  __/   |
|   |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|   |
|                   |_|            |___/              |
|    __  __                                           |
|   |  \\/  | __ _ _ __   __ _  __ _  ___ _ __         |
|   | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|        |
|   | |  | | (_| | | | | (_| | (_| |  __/ |           |
|   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|           |
|                             |___/                   |
|                                                     |
|_____________________________________________________|
`);

inquirer.prompt(questions).then((data) => {
    console.log(data);
})