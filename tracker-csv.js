//Import the readline module for command-line interaction 
const readline = require('readline')
// Importing the fs (filesystem) module for file operations
const fs = require('fs')

//Define the file name for storing expenses in JSON formate
const FILE = 'expenses.json' 

//Initialize the expenses array ; load the data from the file if it exists
let expesnses = []
if(fs.existsSync(FILE)) {
    try {
        // Read and parse the file's contents
        expenses = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    } catch{
        expenses = [] // If error, start with an empty array
    }
} 

// Create a readline interface for user input and output 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Function to save the expenses array to the JSON file
function saveExpenses(){
    fs.writeFileSync(FILE, JSON.stringify(expenses, null, 2)) // Pretty- print with 2-space indentation
}

//Functio to display all expenses in table format
function printExpensesTable(){
    if(expenses.length === 0) { // if there are no expenses
        console.log('\nNo expenses recoded')
        return   
    }
    //Print table headers
    console.log('\n# | Date | Time | Amount | Category | Description')
    console.log('------------------------------------------------------')
    //Print each expense as a formatted row
    expenses.forEach((exp, idx) => {
        let row =
        String(idx + 1).padEnd(2) + '|' + // Expense number, padded for alignment
        exp.date.padEnd(10) + '|' + // Date, padded for alignment
        exp.time.padEnd(8) + '| $' + //Time, padded for alignment with dollar sign
        exp.amount.toFixed(2).padEnd(7) + '|'+ //Amount, always 2 decimal places, padded
        exp.category.padEnd(12) + '|' + // Category, padded 
        exp.description // Description, no padding 
        console.log(row)
    })
}