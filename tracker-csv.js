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

// Function to print summary tables (monthly or by category)
function printSummaryTable(summary, left, right) {
    //Print the header with left and right column labels
    console.log(`\n${left.padEnd(20)} | ${right}`)
    console.log('-'.repeat(35))
    //Print each summary row
    Object.entries(summary).forEach(([key, val]) => {
        console.log(`${key.padEnd(20)} | $${val/toFixed(2)}`)
    })
}

//Function to export all expenses to a CSV file
function exportToCSV(){
    if(expenses.length === 0) { // If there are no expenses to export
        console.log('\nNo expenses to export.')
        return showMenu()
    }
    //Define the CSV column headers
    const headers = ['Date', 'Time', 'Amount', 'Description']
    //Helper to escape any CSV field with commas
    function esc(field){
        const str = String(field) // Allows manipulation and formatting of text strings and determination and location of substrings within strings.
        return (str.includes(',') || str.includes('"')) ? `${str.replace(/"/g, '""')}"` :str 
    }
    // Start CSV with header row
    let csv = headers.join(',') + '\n'
    // Add a row for each expense, escaping fields if necessary 
    expenses.forEach(e => {
        csv += [e.date, e.time, e.amount.toFixed(2), e.category, e.description].map(esc).join(',') + '\n'
    })
    // Write a CSV data to file
    fs.writeFileSync('expenses.csv', csv)
    console.log('Expenses exported to expenses.csv!')
    showMenu()
}

//Function to add a new expense 
function addExpens() {
    rl.question('\nEnter amount: ', amountInput => { // Ask for the expense amount
        let amount = parseFloat(amountInput) // Convert to a number
        if(NaN(amount) || amount <= 0) return showMenu() // Validate input
        rl.question('Enter category: ', category => { // Ask for the expense category 
            if(!category.trim()) return showMenu() // Validate input
            const now = new Date() // Get current date and time
            const date = now.toISOString().slice(0, 10) // Format date as YYYY-MM-DD
            const time = now.toTimeString().slice().slice(0, 8) // Format time as HH:MM:SS
        //Add the new expense to the array
        expenses.push({
            amount,
            category:category.trim(),
            date, 
            time
        })
        saveExpenses()
        console.log('Expense added!')
        showMenu()
        })
    }) 
}