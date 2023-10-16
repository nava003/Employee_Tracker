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
        database: 'company_db',
        multipleStatements: true
    },
    console.log('Successfully connected to company_db database.\n')
);

const questions = [
    {
        type: "list",
        name: "mainMenu",
        message: "Please select the following options:",
        choices: [
        'View all Departments',
        'View a Department Budget',
        'Add a Department',
        'Delete a Department',
        new inquirer.Separator(),
        'View all Roles',
        'Add a Role',
        'Delete a Role',
        new inquirer.Separator(),
        'View all Employees',
        'View Employees by Manager',
        'View Employees by Department',
        'Update an Employee Role',
        'Update Managers',
        'Add an Employee',
        'Delete an Employee',
        new inquirer.Separator(),
        'Exit',
        new inquirer.Separator(),
    ],
    },
    {
        type: "list",
        name: "deptMenu",
        message: "Select the following Department Options:",
        choices: ['Go Back'],
        when: (dAnswer) => dAnswer.mainMenu === 'View all Departments',
    },
    {
        type: "list",
        name: "roleMenu",
        message: "Select the following Role Options:",
        choices: ['Go Back'],
        when: (rAnswer) => rAnswer.mainMenu === 'View all Roles',
    },
    {
        type: "list",
        name: "empMenu",
        message: "Select the following Employee Options:",
        choices: ['Go Back'],
        when: (eAnswer) => eAnswer.mainMenu === 'View all Employees',
    },
    {
        type: "confirm",
        name: "confirmExit",
        message: "Do you wish to exit?",
        when: (ext) => ext.mainMenu === 'Exit',
    }
];

function init() {
    let compDB = fs.readFileSync('./db/schema.sql', 'utf8', (err) => err ? console.error(err) : console.log("Schema successfully read."));
    db.query(`${compDB}`, (err) => err ? console.error(err) : console.log("Schema successfully executed."));

    compDB = fs.readFileSync('./db/seeds.sql', 'utf8', (err) => err ? console.log(err) : console.log("Seeds successfully read."));
    db.query(`${compDB}`, (err) => err ? console.error(err) : console.log("Seeds successfully executed."));
    
    console.log(`
    ____________________________________________________________
    |                                                          |
    |   _____                    _                             |
    |  | ____| _ __ ___   _ __  | |  ___   _   _   ___   ___   |
    |  |  _|  | '_ \` _ \\ | '_ \\ | | / _ \\ | | | | / _ \\ / _ \\  |
    |  | |___ | | | | | || |_) || || (_) || |_| ||  __/|  __/  |
    |  |_____||_| |_| |_|| .__/ |_| \\___/  \\__, | \\___| \\___|  |
    |   _____            |_|    _          |___/               |
    |  |_   _|_ __  __ _   ___ | | __ ___  _ __                |
    |    | | | '__|/ _\` | / __|| |/ // _ \\| '__|               |
    |    | | | |  | (_| || (__ |   <|  __/| |                  |
    |    |_| |_|   \\__,_| \\___||_|\\_\\\\___||_|                  |
    |                                                          |
    |__________________________________________________________|
    `);

    inquirer.prompt(questions)
        .then((data) => {
            if (!data.confirmExit) {
                init();
            }

            
        }
    );

    console.log(`
    ____________________________________________________________
    |                                                          |
    |     ____                    _  _                   _     |
    |    / ___|  ___    ___    __| || |__   _   _   ___ | |    |
    |   | |  _  / _ \  / _ \  / _\` || '_ \\ | | | | / _ \\| |    |
    |   | |_| || (_) || (_) || (_| || |_) || |_| ||  __/|_|    |
    |    \\____| \\___/  \\___/  \\__,_||_.__/  \\__, | \\___|(_)    |
    |                                       |___/              |
    |                                                          |
    |__________________________________________________________|
    `);

}

init();