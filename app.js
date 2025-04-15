const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalElement = document.getElementById('total');
const updateForm = document.getElementById('update-form');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
  transactionList.innerHTML = '';
  let total = 0;

  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.textContent = `${transaction.person} - ${transaction.amount} szt = ${transaction.amount * 50} zł`;
    if (transaction.repaymentDate) {
      const date = document.createElement('span');
      date.textContent = ` (Spłata do: ${transaction.repaymentDate})`;
      li.appendChild(date);
    }
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Usuń';
    removeButton.onclick = () => {
      transactions.splice(index, 1);
      saveAndRender();
    };
    li.appendChild(removeButton);
    transactionList.appendChild(li);
    total += transaction.amount * 50;
  });

  totalElement.textContent = `Łączna suma: ${total} zł`;
}

function saveAndRender() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

transactionForm.onsubmit = (e) => {
  e.preventDefault();
  const person = document.getElementById('person').value;
  const amount = parseFloat(document.getElementById('amount').value);
  transactions.push({ person, amount });
  saveAndRender();
  transactionForm.reset();
};

updateForm.onsubmit = (e) => {
  e.preventDefault();
  const person = document.getElementById('update-person').value;
  const deductAmount = parseFloat(document.getElementById('deduct-amount').value);
  const repaymentDate = document.getElementById('repayment-date').value;

  const transaction = transactions.find((t) => t.person === person);
  if (transaction) {
    transaction.amount -= deductAmount;
    if (repaymentDate) {
      transaction.repaymentDate = repaymentDate;
    }
    if (transaction.amount < 0) transaction.amount = 0; // Zapobiega ujemnym długom
    saveAndRender();
  } else {
    alert('Nie znaleziono osoby w liście transakcji.');
  }
};

updateUI();