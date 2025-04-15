const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalElement = document.getElementById('total');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
  transactionList.innerHTML = '';
  let total = 0;

  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.textContent = `${transaction.person} - ${transaction.amount} szt = ${transaction.amount * 50} zł`;
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

updateUI();
