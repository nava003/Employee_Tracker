// Import requirements
const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');

// Opening a connection to a mysql database named company_db.
const db = mysql.createConnection(
    {
        host: 'localhost' || '127.0.0.1',
        user: 'root',
        password: '`5YDX#OO_&2r/L6}Nz',
        database: 'company_db',
        multipleStatements: true
    },
    console.log('Successfully connected to company_db database.')
);

const dbPromise = db.promise();

const uestions = [
    {
        type: "input",
        name: "newDept",
        message: "Insert new Department name:",
        when: (dAns) => dAns.mainMenu === 'Add a Department',
    },
    {
        type: "input",
        name: "delDept",
        message: "Insert the name of the Department to delete:",
        when: (rAnswer) => rAnswer.mainMenu === 'Delete a Department',
    },
    {
        type: "input",
        name: "addEmp",
        message: "Select the following Employee Options:",
        choices: ['Go Back'],
        when: (eAnswer) => eAnswer.mainMenu === 'View all Employees',
    },
];

function init() {
    let compDB = fs.readFileSync('./db/schema.sql', 'utf8');
    db.query(`${compDB}`);

    compDB = fs.readFileSync('./db/seeds.sql', 'utf8');
    db.query(`${compDB}`);
    
    console.log(`____________________________________________________________
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

    runInquirer();
};

async function runInquirer() {
    const data = await inquirer.prompt(
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
                'Add an Employee',
                'Update an Employee Role',
                'Update Managers',
                'Delete an Employee',
                new inquirer.Separator(),
                'Exit',
                new inquirer.Separator(),
            ],
        }
    )
    
    switch (data.mainMenu) {
        case 'View all Departments':
            db.query('SELECT * FROM departments', (err, results) => {
                // const dbResult = results.map();
                console.table(results);
                // console.table(dbResult);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View a Department Budget':
            let [rows, fields] = await dbPromise.query('SELECT name FROM departments');
            // console.log(rows);
            const deptNames = rows.map(res => res.name);
            // console.log(mapNames);
            const deptData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'deptList',
                    message: 'Select a Department to view its budget:',
                    choices: deptNames,
                }
            )
            
            db.query(`SELECT departments.name, SUM(roles.salary) AS dept_budget
            FROM departments, employees, roles
            WHERE name = ?
                AND departments.id = roles.department_id
                AND roles.id = employees.role_id
            GROUP BY name`,
            deptData.deptList, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View all Roles':
            db.query(`SELECT roles.id, roles.title, departments.name, roles.salary
            FROM roles, departments
            WHERE departments.id = roles.department_id`, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View all Employees':
            db.query('SELECT * FROM employees', (err, results) => {
                console.log(results);
            });
            break;

        case 'View Employees by Manager':
            db.query('', (err, results) => {

            })
            break;

        case 'View Employees by Department':
            db.query('', (err, results) => {
                
            })
            break;

        case 'Add a Department':
            db.query('', (err, results) => {
                
            })
            break;

        case 'Add a Role':
            db.query('', (err, results) => {
                
            })
            break;

        case 'Add an Employee':
            db.query('', (err, results) => {
                
            })
            break;
        case 'Update an Employee Role':
            db.query('', (err, results) => {
                
            })
            break;

        case 'Update Managers':
            db.query('', (err, results) => {
                
            })
            break;

        case 'Delete a Department':
            db.query('', (err, results) => {
                
            })
            break;
        case 'Delete a Role':
            db.query('', (err, results) => {
                
            })
            break;

        case 'Delete an Employee':
            db.query('', (err, results) => {
                
            })
            break;

        default:
            break;
    }

    if (data.mainMenu === 'Exit') {
        console.log(`____________________________________________________________
|                                                          |
|     ____                    _  _                   _     |
|    / ___|  ___    ___    __| || |__   _   _   ___ | |    |
|   | |  _  / _ \\  / _ \\  / _\` || '_ \\ | | | | / _ \\| |    |
|   | |_| || (_) || (_) || (_| || |_) || |_| ||  __/|_|    |
|    \\____| \\___/  \\___/  \\__,_||_.__/  \\__, | \\___|(_)    |
|                                       |___/              |
|                                                          |
|__________________________________________________________|`);
        process.exit();
    }
};

init();