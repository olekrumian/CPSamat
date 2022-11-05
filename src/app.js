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
// window.addEventListener('DOMContentLoaded', renderTable);

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
  var today = new Date();

  var day = today.getDate();
  var month = today.getMonth() + 1;
  if (month < 10) month = '0' + month;
  var year = today.getFullYear();

  var hour = today.getHours();
  if (hour < 10) hour = '0' + hour;

  var min = today.getMinutes();
  if (min < 10) min = '0' + min;

  inputDate.value = `${day}.${month}.${year} ${hour}:${min}`;
}
timeCount();
setInterval(timeCount, 60000);

// setup table
function setUpTable() {
  var newTr = document.createElement('tr');
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
    place: miejsce,
    km: kilometry,
    date: data,
    used: operacji,
    warning: uwagi,
  };

  addToLocalStorage(id, values);
  // window.location.reload();
}

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

function exportXls() {}
function getDataFromInput() {}
function calcOperacji() {}
function getTotal() {}
