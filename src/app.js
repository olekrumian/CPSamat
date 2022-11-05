const input = document.querySelectorAll('input');
const inputDate = document.querySelector('.date');
const readyBtn = document.querySelector('.ready_btn');
const removeBtn = document.querySelector('.remove_btn');
const xlsBtn = document.querySelector('.exportxls');
const tbody = document.querySelector('.tbody');
// tab switch
const btns = document.querySelectorAll('.tab_btn');
const btnContainer = document.querySelector('.btn_container');
const tab = document.querySelectorAll('.tab');

//* Event listener
// addButton
readyBtn.addEventListener('click', setUpTable);
removeBtn.addEventListener('click', clearLocalStorage);
window.addEventListener('DOMContentLoaded', sumaOperacji);

//* Function
// switch tab
btnContainer.addEventListener('click', function (e) {
  const id = e.target.dataset.id;
  if (id) {
    // remove active from other buttons
    btns.forEach(function (btn) {
      btn.classList.remove('active');
      e.target.classList.add('active');
    });
    // hide other articles
    tab.forEach(function (tabs) {
      tabs.classList.remove('active');
    });
    const tabs = document.getElementById(id);
    tabs.classList.add('active');
  }
});

// get time
function timeCount() {
  let today = new Date();

  let day = today.getDate();
  let month = today.getMonth() + 1;
  if (month < 10) month = '0' + month;
  let year = today.getFullYear();

  let hour = today.getHours();
  if (hour < 10) hour = '0' + hour;

  let min = today.getMinutes();
  if (min < 10) min = '0' + min;

  inputDate.value = `${day}.${month}.${year} ${hour}:${min}`;
}
timeCount();
setInterval(timeCount, 60000);

// setup table
function setUpTable() {
  const newTr = document.createElement('tr');
  newTr.classList.add('table_row');
  const id = new Date().getTime().toString();
  const atrr = document.createAttribute('data-id');
  atrr.value = id;
  newTr.setAttributeNode(atrr);

  let miejsce = input[0].value;
  let kilometry = input[1].value;
  let data = input[2].value;
  let operacji = input[3].value;
  let uwagi = input[4].value;

  if (!miejsce || !kilometry) return;

  if (!operacji) {
    operacji = '1';
  }

  newTr.innerHTML = `
              <td class="miejsce">${miejsce}</td>
              <td class="kilometry">${kilometry}</td>
              <td class="data">${data}</td>
              <td class="operacji">${operacji}</td>
              <td class="uwagi">${uwagi}</td>
              <td><button class="usun"><img src="./img/trash.svg" alt=""></button></td>
  `;

  tbody.appendChild(newTr);

  const deleteBtn = newTr.querySelector('.usun');
  deleteBtn.addEventListener('click', deleteItem);

  var values = {
    miejsce: miejsce,
    kilometry: kilometry,
    data: data,
    operacji: operacji,
    uwagi: uwagi,
  };

  addToLocalStorage(id, values);
  // window.location.reload();
}

const fetchTable = () => {
  const respons = localStorage.getItem('table');
  const data = JSON.parse(respons);
  renderTab(data);
};

document.addEventListener('DOMContentLoaded', fetchTable);

const renderTab = (list) => {
  const tabList = list
    .map((item) => {
      const {
        id,
        value: {miejsce, kilometry, data, operacji, uwagi},
      } = item;
      return `
        <tr clas="table_row" data-id="${id}">
        <td>${miejsce}</td>
        <td>${kilometry}</td>
        <td>${data}</td>
        <td>${operacji}</td>
        <td>${uwagi}</td>
        <td><button class="usun"><img src="./img/trash.svg" alt=""></button></td>
        </tr>
        `;
    })
    .join('');
  tbody.innerHTML = tabList;
};

// delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  tbody.removeChild(element);
  removeFromLocalStorage(id);
}

// add to localstorage
function addToLocalStorage(id, value) {
  const table = {id, value};
  let items = getLocalStorage();
  items.push(table);
  localStorage.setItem('table', JSON.stringify(items));
}

// get localstorage
function getLocalStorage() {
  return localStorage.getItem('table')
    ? JSON.parse(localStorage.getItem('table'))
    : [];
}

// delete from localstorage
function removeFromLocalStorage(id) {
  let items = getLocalStorage(id);
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('table', JSON.stringify(items));
}

// clear localstorage
function clearLocalStorage() {
  if (confirm('Potwierdzić') == true) {
    localStorage.clear();
    window.location.reload();
  } else {
    window.location.reload();
  }
}

// Suma operacji
function sumaOperacji() {
  const suma = getLocalStorage();
  let totalOperacji = 0;

  if (suma.length > 0) {
    suma.forEach((element) => {
      totalOperacji += parseInt(element.value.operacji);
    });
  }
  document.querySelector(
    '.calculate'
  ).innerHTML = `<p>Operacji: ${totalOperacji}</p>`;
}

function exportXls() {}
function getDataFromInput() {}
function calcOperacji() {}
function getTotal() {}
