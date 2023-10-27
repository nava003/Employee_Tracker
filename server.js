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
                'View a Department\'s Budget',
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
                'Update an Employee\'s Role',
                'Update an Employee\'s Manager',
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
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View a Department\'s Budget':
            let [vdbRows, vdbFields] = await dbPromise.query('SELECT name FROM departments');
            const vdbNames = vdbRows.map(res => res.name);
            const vdbData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'deptList',
                    message: 'Select a Department to view its budget:',
                    choices: vdbNames,
                }
            )
            
            db.query(`SELECT departments.name, SUM(roles.salary) AS dept_budget
            FROM departments
            JOIN roles ON departments.id = roles.department_id
            JOIN employees ON roles.id = employees.role_id
            WHERE name = ?
            GROUP BY name`,
            vdbData.deptList, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View all Roles':
            db.query(`SELECT roles.id, roles.title, departments.name AS department_name, roles.salary
            FROM roles
            LEFT JOIN departments
                ON departments.id = roles.department_id`, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View all Employees':
            db.query(`SELECT e1.id, e1.first_name, e1.last_name, r1.title, d1.name AS department_name, r1.salary,
                CONCAT(e2.first_name, ' ', e2.last_name) AS manager
            FROM employees e1
            LEFT JOIN employees e2
                ON e1.manager_id = e2.id
            LEFT JOIN roles r1
                ON r1.id = e1.role_id
            LEFT JOIN departments d1
                ON d1.id = r1.department_id`, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View Employees by Manager':
            let [vemRows, vemFields] = await dbPromise.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager_name
            FROM employees
            WHERE manager_id IS NULL`);
            const vemNames = vemRows.map(res => res.manager_name);
            const vemData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'manList',
                    message: 'Select a Manager to view their employees:',
                    choices: vemNames,
                }
            )

            db.query(`SELECT employees.id, CONCAT(first_name, ' ', last_name) AS employee_name, roles.title
            FROM employees
            LEFT JOIN roles
                ON employees.role_id = roles.id
            WHERE manager_id = (SELECT id
                                FROM employees
                                WHERE CONCAT(first_name, ' ', last_name) = ?)`,
            vemData.manList, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'View Employees by Department':
            let [vedRows, vedFields] = await dbPromise.query(`SELECT name FROM departments`);
            const vedNames = vedRows.map(res => res.name);
            const vedData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'deptList',
                    message: 'Select a Department to view its employees',
                    choices: vedNames,
                }
            )

            db.query(`SELECT employees.id, CONCAT(first_name, ' ', last_name) AS employee_name, roles.title
            FROM employees
            JOIN roles
                ON roles.id = employees.role_id
            WHERE roles.department_id = (SELECT id
                                   FROM departments
                                   WHERE name = ?)`,
            vedData.deptList, (err, results) => {
                console.table(results);
                console.log('\n');
                runInquirer();
            });
            break;

        case 'Add a Department':
            const addDeptData = await inquirer.prompt(
                {
                    type: 'input',
                    name: 'deptName',
                    message: 'Insert new Department name:',
                }
            )
            
            db.query(`INSERT INTO departments (name)
            VALUES (?)`, addDeptData.deptName);

            console.log(`${addDeptData.deptName} is now in the database.\n`);
            runInquirer();
            break;

        case 'Add a Role':
            let [ardRows, ardFields] = await dbPromise.query('SELECT name FROM departments');
            const ardNames = ardRows.map(res => res.name);

            const addRoleData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'Insert new role Title:',
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: 'Insert Salary for new role:',
                },
                {
                    type: 'list',
                    name: 'roleDept',
                    message: 'Select a Department for the new role:',
                    choices: ardNames,
                },
            ]);

            db.query(`INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, (SELECT id
                           FROM departments
                           WHERE name = ?))`,
            [addRoleData.roleTitle, addRoleData.roleSalary, addRoleData.roleDept]);

            console.log(`${addRoleData.roleTitle} is now in the database.\n`);
            runInquirer();
            break;

        case 'Add an Employee':
            let [aerRows, aerFields] = await dbPromise.query('SELECT title FROM roles');
            const aerTitles = aerRows.map(res => res.title);

            let [aemRows, aemFields] = await dbPromise.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager_name
            FROM employees
            WHERE manager_id IS NULL`);
            const aemNames = aemRows.map(res => res.manager_name);
            aemNames.unshift('None');

            const addEmpData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'empFName',
                    message: 'Insert First Name:',
                },
                {
                    type: 'input',
                    name: 'empLName',
                    message: 'Insert Last Name:',
                },
                {
                    type: 'list',
                    name: 'empRole',
                    message: 'Select a Role for new employee',
                    choices: aerTitles,
                },
                {
                    type: 'list',
                    name: 'empManager',
                    message: 'Select a Manager for new employee',
                    choices: aemNames,
                }
            ])

            if (addEmpData.empManager === 'None') {
                db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, (SELECT id
                               FROM roles
                               WHERE title = ?), NULL)`,
                [addEmpData.empFName, addEmpData.empLName, addEmpData.empRole],
                (err, results) => {
                    console.log(`${addEmpData.empFName} ${addEmpData.empLName} is now in the database.\n`);
                    runInquirer();
                });
            } else {
                db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, (SELECT id
                               FROM roles
                               WHERE title = ?), (SELECT id
                                                  FROM (SELECT * FROM employees) AS temp_emp
                                                  WHERE CONCAT(first_name, ' ', last_name) = ?))`,
                [addEmpData.empFName, addEmpData.empLName, addEmpData.empRole, addEmpData.empManager],
                (err, results) => {
                    console.log(`${addEmpData.empFName} ${addEmpData.empLName} is now in the database.\n`);
                    runInquirer();
                });
            }
            break;
        case 'Update an Employee\'s Role':
            let [uenRows, uenFields] = await dbPromise.query(`SELECT CONCAT(first_name, ' ', last_name) AS emp_name
            FROM employees`);
            const uenNames = uenRows.map(res => res.emp_name);

            let [uerRows, uerFields] = await dbPromise.query(`SELECT title FROM roles`);
            const uerTitles = uerRows.map(res => res.title);

            const uerData = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'empName',
                    message: 'Select which Employee to Update:',
                    choices: uenNames,
                },
                {
                    type: 'list',
                    name: 'roleTitle',
                    message: 'Select which Role the Employee will be assigned to:',
                    choices: uerTitles,
                },
            ]);

            db.query(`UPDATE employees
            SET role_id = (SELECT id FROM roles WHERE title = ?)
            WHERE CONCAT(first_name, ' ', last_name) = ?`,
            [uerData.roleTitle, uerData.empName]);

            console.log(`${uerData.empName}'s Role has been updated.\n`);
            runInquirer();
            break;

        case 'Update an Employee\'s Manager':
            let [uempRows, uempFields] = await dbPromise.query(`SELECT CONCAT(first_name, ' ', last_name) AS emp_name
            FROM employees`);
            const uempNames = uempRows.map(res => res.emp_name);
            
            let [umanRows, umanFields] = await dbPromise.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager_name
            FROM employees
            WHERE manager_id IS NULL`);
            const umanNames = umanRows.map(res => res.manager_name);
            umanNames.unshift('None');
            
            const uemData = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'empName',
                    message: 'Select which Employee to Update:',
                    choices: uempNames,
                },
                {
                    type: 'list',
                    name: 'manName',
                    message: 'Select which Manager the Employee will be assigned under:',
                    choices: umanNames,
                }
            ]);

            db.query(`UPDATE employees
            SET manager_id = (SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?)
            WHERE CONCAT(first_name, ' ', last_name) = ?`,
            [uemData.manName, uemData.empName]);

            console.log(`${uemData.empName}'s Manager has been updated.`);
            runInquirer();
            break;

        case 'Delete a Department':
            let [dadRows, dadFields] = await dbPromise.query(`SELECT name FROM departments`);
            const dadNames = dadRows.map(res => res.name);

            const dadData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'deptName',
                    message: 'Select which Department to Delete:',
                    choices: dadNames,
                }
            );

            db.query(`DELETE FROM departments WHERE name = ?`, dadData.deptName);

            console.log(`${dadData.deptName} has been deleted from the database.\n`);
            runInquirer();
            break;

        case 'Delete a Role':
            let [darRows, darFields] = await dbPromise.query(`SELECT title FROM roles`);
            const darTitles = darRows.map(res => res.title);

            const darData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'roleTitle',
                    message: 'Select which Role Title to Delete:',
                    choices: darTitles,
                }
            );

            db.query(`DELETE FROM roles WHERE title = ?`, darData.roleTitle);

            console.log(`${darData.roleTitle} has been deleted from the database.\n`);
            runInquirer();
            break;

        case 'Delete an Employee':
            let [daeRows, deeFields] = await dbPromise.query(`SELECT CONCAT(first_name, ' ', last_name) AS emp_name FROM employees`);
            const daeNames = daeRows.map(res => res.emp_name);

            const daeData = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'empName',
                    message: 'Select which Employee to Delete:',
                    choices: daeNames,
                }
            );

            db.query(`DELETE FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?`, daeData.empName);

            console.log(`${daeData.empName} has been deleted from the database.\n`);
            runInquirer();
            break;
        
        case 'Exit':
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
            break;

        default:
            break;
    }
};

init();