const budgetResultElement = document.getElementById('budgetResult');
const clearBudgetElement = document.getElementById('clearBudget');
const startBudgetElement = document.getElementById('startBudget');
const calculateBudgetElement = document.getElementById('calculateBudget');
const numberOfExpenseElement = document.getElementById('numExpenses');
const userNameElement = document.getElementById('userName');
const incomeElement = document.getElementById('income');
const expenseInputsDiv = document.getElementById('expenseInputs');

startBudgetElement.addEventListener("click", getExpenses);
calculateBudgetElement.addEventListener("click", startCalculateBudget);
clearBudgetElement.addEventListener("click", clearBudget);
incomeElement.addEventListener("input", validateForm);
numberOfExpenseElement.addEventListener("input", validateForm);
userNameElement.addEventListener("input", validateForm);

startBudgetElement.disabled = true;

function validateForm() {
  const incomeValid = parseFloat(incomeElement.value) > 0;
  const userNameValid = userNameElement.value.trim().length > 0;
  const numberOfExpenseValid = parseInt(numberOfExpenseElement.value) >= 0;

  startBudgetElement.disabled = !(
    incomeValid &&
    userNameValid &&
    numberOfExpenseValid
  );
}

function saveBudgetToLocal(userBudget){
  localStorage.setItem('userBudget', JSON.stringify(userBudget));
}

function getBudgetFromLocal(){
  const savedBudget = localStorage.getItem('userBudget');
  return savedBudget ? JSON.parse(savedBudget) : null;
}

function clearBudgetFromLocal(){
  localStorage.removeItem('userBudget');
  alert('🗑️ Budget data has cleared from your local storage.');
}

function getExpenses() {
  const numberOfExpenses = parseInt(numberOfExpenseElement.value);

  if (isNaN(numberOfExpenses) || numberOfExpenses <= 0) {
    alert("⚠️ Enter a valid number of expenses");
    return;
  }

  expenseInputsDiv.innerHTML = ''; // avoid duplicates on repeated clicks

  for (let i = 1; i <= numberOfExpenses; i++) {
    const expenseLabel = document.createElement('label');
    expenseLabel.textContent = `Enter expense ${i}: `;

    const expenseInput = document.createElement('input');
    expenseInput.type = 'number';
    expenseInput.classList.add('expenseValue');

    expenseInputsDiv.appendChild(expenseLabel);
    expenseInputsDiv.appendChild(expenseInput);
    expenseInputsDiv.appendChild(document.createElement('br'));
  }

  document.getElementById('calculateBudget').style.display = 'inline-block';
  clearBudgetElement.style.display = 'inline-block';
}

function clearBudget() {
  clearBudgetFromLocal();
  budgetResultElement.innerHTML = '';
}

function startCalculateBudget() {
 let userBudget = {
       userName: userNameElement.value,
       income: parseFloat(incomeElement.value),
       expenses: [],
       numberOfExpenses: parseInt(numberOfExpenseElement.value),
       totalExpenses: 0,
       tax: 0,
       netIncome: 0,
       balance: 0,
       savings: 0,
       finalStatus: 0,
 };

 let expenseInputs = document.getElementsByClassName('expenseValue');
 for (let i = 0; i < expenseInputs.length; i++) {
  const expense = parseFloat(expenseInputs[i].value);
  userBudget.expenses.push(isNaN(expense) || expense < 0 ? 0 : expense);
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
    <p>👤 User: ${userBudget.userName}</p>
    <p>💰 Total Income: $${userBudget.income}</p>
    <p>💸 Total Expenses: $${userBudget.totalExpenses}</p>
    <p>📉 Tax Deducted (10%): $${userBudget.tax}</p>
    <p>💲 Net Income After Tax: $${userBudget.netIncome}</p>
    <p>🟢 Remaining Balance: $${userBudget.balance}</p>
    <p>💾 Savings (20% of balance): $${userBudget.savings}</p>
    <p>${userBudget.finalStatus}</p>
  `;


  /*const overspendingMessage = checkOverSpending(userBudget);
  if (overspendingMessage) {
    console.log(overspendingMessage);
  }

  console.log('📝 Expense Breakdown:');
  for (let index = 0; index < userBudget.expenses.length; index++) {
    console.log(`Expense ${index + 1} : $${userBudget.expenses[index]}`);
  }*/
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

function runBudgetTracker() {
  const savedBudget = getBudgetFromLocal();
  if (savedBudget) {
    displayResults(savedBudget);
  }
}

window.addEventListener("load", runBudgetTracker);