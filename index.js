const budgetResultElement = document.getElementById('budgetResult');
const startBudget = document.getElementById('startBudget');
const calculateBudgetElement = document.getElementById('calculateBudget');
startBudget.addEventListener("click", getExpenses);
calculateBudgetElement.addEventListener("click", startCalculateBudget);


function saveBudgetToLocal(userBudget){
  localStorage.setItem('userBudget', JSON.stringify(userBudget));
}

function getBudgetFromLocal(){
  const savedBudget = localStorage.getItem('userBudget');
  return savedBudget ? JSON.parse(savedBudget) : null;
}

function clearBudgetFromLocal(){
  localStorage.removeItem('userBudget');
  console.log('🗑️ Budget data has cleared from your local storage.');
}

function getExpenses() {
  const numberOfExpenses = document.getElementById('numExpenses').value;
  const expenseInputsDiv = document.getElementById('expenseInputs');

  // collect expenses dynamically
  for (let i = 1; i <= numberOfExpenses; i++) {

    if (isNaN(numberOfExpenses) || numberOfExpenses < 0) {
      alert("⚠️ Enter a valid number of expenses");
      return;
    }

    let expenseLabel = document.createElement('label');
    expenseLabel.textContent = `Enter expense ${i}: `;

    let expenseInput = document.createElement('input');
    expenseInput.type = 'number';
    expenseInput.classList.add('expenseValue');

    

    expenseInputsDiv.appendChild(expenseLabel);
    expenseInputsDiv.appendChild(expenseInput);
    expenseInputsDiv.appendChild(document.createElement('br'));
  }

  document.getElementById('calculateBudget').style.display = 'inline-block';
  document.getElementById('clearBudget').style.display = 'inline-block';

}

function startCalculateBudget() {
 let userBudget = {
       userName: document.getElementById('userName').value,
       income: parseFloat(document.getElementById('income').value),
       expenses: [],
       numberOfExpenses: parseInt(document.getElementById('numExpenses').value),
       totalExpenses: 0,
       tax: 0,
       netIncome: 0,
       balance: 0,
       savings: 0,
       finalStatus: 0,
 };

  if (!userBudget.userName || isNaN(userBudget.income) || userBudget.income <= 0) {
      alert("⚠️ Enter a valid name and income");
      return;
  }

 let expenseInputs = document.getElementsByClassName('expenseValue');
 for (let i = 1; i < expenseInputs; i++) {
      if (isNaN(numberOfExpenses) || numberOfExpenses < 0) {
        alert("⚠️ Enter a valid number of expenses");
        return;
      }

      let expense = parseFloat(expenseInputs[i].value);
      userBudget.expenses.push(isNaN(expense) || expense < 0 ? 0 : expense)
    }

  calculateBudget(userBudget);
  saveBudgetToLocal(userBudget);
  displayResults(userBudget);
}

function calculateTotalExpenses(expenses) {
  // Calculate total expenses using the array
  let totalExpenses = 0;
  for (let index = 0; index < expenses.length; index++) {
    totalExpenses += expenses[index];
  }
  return totalExpenses;
}

function calculateTax(income, taxRate) {
  return income * taxRate;
}
function calculateNetIncome(income, tax) {
  return income - tax;
}
function calculateBalance(netIcome, totalExpenses) {
  return netIcome - totalExpenses;
}
function calculateSavings(balance, savingPercentage) {
  return balance * savingPercentage;
}
function getFinancialStatus(savings) {
  let finalStatus = '';
  if (savings >= 1000) {
    finalStatus = '💰 Excellent! You are saving well!';
  } else if (savings >= 500) {
    finalStatus = '✅ Good! You have a decent savings amount.';
  } else if (savings >= 100) {
    finalStatus = '⚠️ Needs Improvement. Consider reducing expenses.';
  } else {
    finalStatus = '🚨 Critical! Your savings are too low!';
  }
  return finalStatus;
}

function displayResults(userBudget) {
  budgetResultElement.innerHTML = `
    <p>User: ${userBudget.userName}</p>
    <p>💰 Total Income: $${userBudget.income}</p>
    <p>💸 Total Expenses: $${userBudget.totalExpenses}</p>
    <p>📉 Tax Deducted (10%): $${userBudget.tax}</p>
    <p>💲 Net Income After Tax: $${userBudget.netIncome}</p>
    <p>🟢 Remaining Balance: $${userBudget.balance}</p>
    <p>💾 Savings (20% of balance): $${userBudget.savings}</p>
    <p>${userBudget.finalStatus}</p>
  `;


  const overspendingMessage = checkOverSpending(userBudget);
  if (overspendingMessage) {
    console.log(overspendingMessage);
  }

  console.log('📝 Expense Breakdown:');
  for (let index = 0; index < userBudget.expenses.length; index++) {
    console.log(`Expense ${index + 1} : $${userBudget.expenses[index]}`);
  }
}

function checkOverSpending(userBudget) {
  // Check if expenses exceed income
  return userBudget.totalExpenses > userBudget.income
    ? '⚠️ Warning: You are spending more than your income!'
    : '';
}

// function to calculate financial details
  function calculateBudget(userBudget) {

  userBudget.totalExpenses = calculateTotalExpenses(userBudget.expenses);
  // Tax deduction (10% of income)
  userBudget.tax = calculateTax(userBudget.income, 0.1);

  // Net income after the tax
  userBudget.netIncome = calculateNetIncome(userBudget.income, userBudget.tax);

  // Calculate remaining balance
  userBudget.balance = calculateBalance(
    userBudget.netIncome,
    userBudget.totalExpenses
  );

  // Savings (20% of remaining balance)
  userBudget.savings = calculateSavings(userBudget.balance, 0.2);

  // Determine the financial health status
  userBudget.finalStatus = getFinancialStatus(userBudget.savings);
  saveBudgetToLocal(userBudget);
}

// Main function to the run the budget tracker
/*function runBudgetTracker() {
  let userBudget = getBudgetFromLocal();

  if(userBudget){
    console.log('📂 Info: Loaded data in local storage.');
    displayResults(userBudget);
  }else{
         

        userBudget.userName = getUserInput('Enter your name: ');
        userBudget.income = getUserInput('Enter your total income: ', true);
        userBudget.numberOfExpenses = getUserInput(
          'How many expenses do you have? ',
          true
        );

        // validate inputes to ensure they are numbers
        if (
          isNaN(userBudget.income) ||
          isNaN(userBudget.numberOfExpenses) ||
          userBudget.income <= 0 ||
          userBudget.numberOfExpenses < 0
        ) {
          console.log('⚠️ Invalid input. Please enter valid numbers.');
          return;
        } else {
          calculateBudget(userBudget);
          displayResults(userBudget);
        }
      }
  }*/

 //clearBudgetFromLocal();
 //runBudgetTracker();