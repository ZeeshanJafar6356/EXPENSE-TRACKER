let state = {
  balance: 0,
  income: 0,
  expense: 0,
  transactions: [],
};

// const date = (document.getElementById('date').value = Date());

const balance = document.querySelector('#balance');
const income = document.querySelector('#income');
const expense = document.querySelector('#expense');
const transactions = document.querySelector('#transaction');
const incomeBtn = document.querySelector('#incomeBtn');
const expenseBtn = document.querySelector('#expenseBtn');
const nameInputEl = document.querySelector('#name');
const amountInput = document.querySelector('#amount');
const feedback = document.querySelector('.feedback');
const feedback2 = document.querySelector('.feedback2');
//getting data stored in local storage
function init() {
  let localState = JSON.parse(localStorage.getItem('expenseTrackerState'));

  if (localState !== null) {
    state = localState;
  }

  updateState();
  initListeners();
}

function uniqueId() {
  return Math.round(Math.random() * 100);
}

//buttons that add income and expense respectively//
function initListeners() {
  incomeBtn.addEventListener('click', onAddIncomeClick);

  expenseBtn.addEventListener('click', onAddExpenseClick);
}

//  Do not repeat yourself

function onAddIncomeClick() {
  addTransaction(nameInputEl.value, amountInput.value, 'income');
}

function addTransaction(name, amount, type) {
  if (name !== '' && amount !== '') {
    var transaction = {
      id: uniqueId(),
      name: name,
      amount: parseInt(amount),
      type: type,
    };
    state.transactions.push(transaction);

    updateState();
  } else alert('enter valid data');
  // } else if (amount == '') {
  //   feedback.textContent = 'Enter Valid Numbers';
  // } else feedback.textContent = '';

  nameInputEl.value = '';
  amountInput.value = '';
}

function onAddExpenseClick() {
  addTransaction(nameInputEl.value, amountInput.value, 'expense');
}
//Delete income or expense by clicking event //
function onDeleteClick(event) {
  let id = parseInt(event.target.getAttribute('data-id'));
  let deleteIndex;
  for (var i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id === id) {
      deleteIndex = i;
      break;
    }
  }

  state.transactions.splice(deleteIndex, 1);

  updateState();
}

//if it is income or expense add it respectively and update total
function updateState() {
  let balance = 0,
    income = 0,
    expense = 0,
    item;

  for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];

    if (item.type === 'income') {
      income += item.amount;
    } else if (item.type === 'expense') {
      expense += item.amount;
    }
  }

  balance = income - expense;
  state.balance = balance;
  state.income = income;
  state.expense = expense;
  //storing balance income and expense in local storage
  localStorage.setItem('expenseTrackerState', JSON.stringify(state));

  render();
}

//adding balance income expense updating balance and deleting income and expenes
function render() {
  balance.innerHTML = `RS ${state.balance}`;
  income.innerHTML = `RS ${state.income}`;
  expense.innerHTML = `RS ${state.expense}`;

  //transactions adding
  let transactionEl, containerEl, amountEl, item, btnEl;

  transactions.innerHTML = '';

  for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];
    transactionEl = document.createElement('li');
    transactionEl.append(item.name);

    transactions.appendChild(transactionEl);

    containerEl = document.createElement('div');
    amountEl = document.createElement('span');
    if (item.type === 'income') {
      amountEl.classList.add('income-amt');
    } else if (item.type === 'expense') {
      amountEl.classList.add('expense-amt');
    }
    amountEl.innerHTML = `RS ${item.amount}`;

    containerEl.appendChild(amountEl);

    btnEl = document.createElement('button');
    btnEl.setAttribute('data-id', item.id);
    btnEl.innerHTML = 'X';

    btnEl.addEventListener('click', onDeleteClick);

    containerEl.appendChild(btnEl);

    transactionEl.appendChild(containerEl);
  }
}

init();
