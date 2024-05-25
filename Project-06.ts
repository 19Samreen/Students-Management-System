#!/usr/bin/env node

//Students Management System

import inquirer from 'inquirer';

class Student {
    private static nextId: number = 10000;
    public id: number;
    public name: string;
    public courses: string[] = [];
    public balance: number = 0;

    constructor(name: string) {
        this.id = Student.generateId();
        this.name = name;
    }

    private static generateId(): number {
        return this.nextId++;
    }

    enroll(course: string) {
        this.courses.push(course);
        this.balance += 600; // Assume each course costs $600
    }

    payTuition(amount: number) {
        this.balance -= amount;
    }

    getStatus() {
        return {
            name: this.name,
            id: this.id,
            courses: this.courses,
            balance: this.balance
        };
    }
}

let students: Student[] = [];

async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add Student', 'Enroll in Course', 'View Balance', 'Pay Tuition', 'Show Status', 'Exit'],
        },
    ]);

    switch (answers.action) {
        case 'Add Student':
            await addStudent();
            break;
        case 'Enroll in Course':
            await enrollStudent();
            break;
        case 'View Balance':
            await viewBalance();
            break;
        case 'Pay Tuition':
            await payTuition();
            break;
        case 'Show Status':
            await showStatus();
            break;
        case 'Exit':
            console.log('Goodbye!');
            return;
    }

    mainMenu();
}

async function addStudent() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter student name:',
        }
    ]);

    const newStudent = new Student(answers.name);
    students.push(newStudent);
    console.log(`Student ${newStudent.name} added successfully with ID ${newStudent.id}.`);
}

async function enrollStudent() {
    if (students.length === 0) {
        console.log('No students found.');
        return;
    }

    const { id, course } = await inquirer.prompt([
        {
            type: 'number',
            name: 'id',
            message: 'Enter the student ID:',
        },
        {
            type: 'input',
            name: 'course',
            message: 'Enter the course name to enroll:',
        }
    ]);

    const student = students.find(student => student.id === id);
    if (student) {
        student.enroll(course);
        console.log(`Student ${student.name} enrolled in ${course}.`);
    } else {
        console.log('Student not found.');
    }
}

async function viewBalance() {
    if (students.length === 0) {
        console.log('No students found.');
        return;
    }

    const { id } = await inquirer.prompt([
        {
            type: 'number',
            name: 'id',
            message: 'Enter the student ID:',
        }
    ]);

    const student = students.find(student => student.id === id);
    if (student) {
        console.log(`Student ${student.name} has a balance of $${student.balance}.`);
    } else {
        console.log('Student not found.');
    }
}

async function payTuition() {
    if (students.length === 0) {
        console.log('No students found.');
        return;
    }

    const { id, amount } = await inquirer.prompt([
        {
            type: 'number',
            name: 'id',
            message: 'Enter the student ID:',
        },
        {
            type: 'number',
            name: 'amount',
            message: 'Enter the amount to pay:',
        }
    ]);

    const student = students.find(student => student.id === id);
    if (student) {
        student.payTuition(amount);
        console.log(`Student ${student.name} paid $${amount}. New balance is $${student.balance}.`);
    } else {
        console.log('Student not found.');
    }
}

async function showStatus() {
    if (students.length === 0) {
        console.log('No students found.');
        return;
    }

    const { id } = await inquirer.prompt([
        {
            type: 'number',
            name: 'id',
            message: 'Enter the student ID:',
        }
    ]);

    const student = students.find(student => student.id === id);
    if (student) {
        const status = student.getStatus();
        console.log(`Name: ${status.name}`);
        console.log(`ID: ${status.id}`);
        console.log(`Courses: ${status.courses.join(', ')}`);
        console.log(`Balance: $${status.balance}`);
    } else {
        console.log('Student not found.');
    }
}

// Start the program
mainMenu();
