const transactionForm = document.getElementById('transaction-form');
const priceForm = document.getElementById('price-form');
const transactionList = document.getElementById('transaction-list');
const historyList = document.getElementById('history-list');
const totalElement = document.getElementById('total');
const groupForm = document.getElementById('group-form');
const exportButton = document.getElementById('export-csv');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let pricePerUnit = parseFloat(localStorage.getItem('pricePerUnit')) || 50;
let currency = localStorage.getItem('currency') || 'PLN';

function updateUI() {
  transactionList.innerHTML = '';
  historyList.innerHTML = '';
  let total = 0;

  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${transaction.person}</strong>: ${transaction.amount} szt = ${(transaction.amount * pricePerUnit).toFixed(2)} ${currency}
      <span>${transaction.repaymentDate ? `Spłata do: ${transaction.repaymentDate}` : ''}</span>
      <button onclick="removeTransaction(${index})">Usuń</button>
    `;
    transactionList.appendChild(li);
    total += transaction.amount * pricePerUnit;
  });

  history.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  });

  totalElement.textContent = `Łączna suma: ${total.toFixed(2)} ${currency}`;
}

function saveAndRender() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  localStorage.setItem('history', JSON.stringify(history));
  localStorage.setItem('pricePerUnit', pricePerUnit);
  localStorage.setItem('currency', currency);
  updateUI();
}

transactionForm.onsubmit = (e) => {
  e.preventDefault();
  const person = document.getElementById('person').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const repaymentDate = document.getElementById('repayment-date').value;

  const transaction = transactions.find((t) => t.person === person);
  if (transaction) {
    transaction.amount += amount;
    if (repaymentDate) {
      transaction.repaymentDate = repaymentDate;
    }
    history.push(`Zaktualizowano: ${person} - ${amount} szt`);
  } else {
    transactions.push({ person, amount, repaymentDate });
    history.push(`Dodano: ${person} - ${amount} szt`);
  }
  saveAndRender();
  transactionForm.reset();
};

priceForm.onsubmit = (e) => {
  e.preventDefault();
  pricePerUnit = parseFloat(document.getElementById('price-per-unit').value);
  currency = document.getElementById('currency').value;
  history.push(`Zmieniono cenę za 1 szt: ${pricePerUnit} ${currency}`);
  saveAndRender();
};

groupForm.onsubmit = (e) => {
  e.preventDefault();
  const people = document.getElementById('group-people').value.split(',').map(p => p.trim());
  const groupAmount = parseFloat(document.getElementById('group-amount').value);
  const perPerson = (groupAmount / people.length).toFixed(2);

  people.forEach((person) => {
    transactions.push({ person, amount: parseFloat(perPerson), repaymentDate: '' });
    history.push(`Dodano dla ${person}: ${perPerson} szt`);
  });
  saveAndRender();
  groupForm.reset();
};

exportButton.onclick = () => {
  const rows = [['Imię', 'Kwota (szt)', 'Kwota (zł)', 'Data spłaty']];
  transactions.forEach(t => {
    rows.push([t.person, t.amount, (t.amount * pricePerUnit).toFixed(2), t.repaymentDate || '']);
  });

  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transakcje.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function removeTransaction(index) {
  history.push(`Usunięto: ${transactions[index].person} - ${transactions[index].amount} szt`);
  transactions.splice(index, 1);
  saveAndRender();
}

updateUI();