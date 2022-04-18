//required modules and files
const inquirer = require('inquirer');
const fs = require('fs');
const Choices = require('inquirer/lib/objects/choices');
const generateWebpage = require('./lib/generateWebpage');


//setting up arrays for data
const managerData = [];
const employeeData = [];




//prompts for manager information
const managerQuestions = () => {
    return inquirer
        .prompt([
        {
            type: 'input',
            name: 'managerName',
            message: 'What is the name of your team manager?',
        },
        {
            type: 'input',
            name: 'managerEmail',
            message: "What is your team manager's email?",
        },
        {
            type: 'input',
            name: 'managerID',
            message: 'What is the employee ID of your team manager?',
        },
        {
            type: 'input',
            name: 'managerOffice',
            message: "What is the team manager's office number?",
        },
    ])

    .then(addManager => {
        let {managerName, managerEmail, managerID, managerOffice} = addManager;
        //let manager = (managerName, managerEmail, managerID, managerOffice);
        managerData.push(addManager);
    });
};

//prompts for intern and engineer information
const employeeQuestions = () => {
    return inquirer
        .prompt([
        {
            type: 'list',
            name: 'nextChoice',
            message: "Do you want to add another team member?",
            choices: ['add Engineer', 'add Intern', 'Finish Builing Team'],
        },
        {
            type: 'input',
            name: 'employeeName',
            message: "What is the team member's name?",
            when: (input) => input.nextChoice === 'add Engineer' || input.nextChoice === 'add Intern',

        },
        {
            type: 'input',
            name: 'email',
            message: "What is the team member's email?",
            when: (input) => input.nextChoice === 'add Engineer' || input.nextChoice === 'add Intern',
        },
        {
            type: 'input',
            name: 'github',
            message: "What is the team member's github username?",
            when: (input) => input.nextChoice === 'add Engineer',
        },
        {
            type: 'input',
            name: 'school',
            message: "What school does the intern attend?",
            when: (input) => input.nextChoice === 'add Intern',
        },
    ])

    .then(addEmployee =>{
        
        let {nextChoice, employeeName, email, github, school} = addEmployee;

        if (nextChoice === 'add Engineer'){
            let {employeeName, email, github} = addEmployee;
            employeeData.push(addEmployee);
            return employeeQuestions(employeeData);
        }
        if (nextChoice === 'add Intern'){
            let {employeeName, email, school} = addEmployee;
            employeeData.push(addEmployee);
            return employeeQuestions(employeeData);
        }
        else {
            return employeeData;
        }

    }); 
};


//initialize application
function init() {
    managerQuestions()
    .then(() => console.log(managerData))
    .then(employeeQuestions)
    .then(() => console.log(employeeData))
    //.then((data) => writeToFile('./dist/teamProfile.html', generateWebpage(data)))
    .then(() => console.log('Successfully wrote to HTML'))
    .catch((err) => console.error(err));
};

init();