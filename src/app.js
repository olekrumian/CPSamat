// tab switch
const btns = document.querySelectorAll('.tab_btn');
const btnContainer = document.querySelector('.btn_container');
const tab = document.querySelectorAll('.tab');

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

//? Get element
const input = document.querySelectorAll('input');
const readyBtn = document.querySelector('.ready_btn');
const xlsBtn = document.querySelector('.exportxls');
const tbody = document.querySelector('.tbody');

//* Event listener
// addButton
// removeButton
//* Function
// get time
// function timeCount() {
//   var today = new Date();

//   var day = today.getDate();
//   var month = today.getMonth() + 1;
//   if (month < 10) month = '0' + month;
//   var year = today.getFullYear();

//   var hour = today.getHours();
//   if (hour < 10) hour = '0' + hour;

//   var minute = today.getMinutes();
//   if (minute < 10) minute = '0' + minute;

//   input[2].value = day + '.' + month + '.' + year + ' ' + hour + ':' + minute;

//   setTimeout('timeCount()', 5000);
// }
// timeCount();
function renderTab() {}
function addToLocalStorage() {}
function removeFromLocalStorage() {}
function clearLocal() {}
function exportXls() {}
function getDataFromInput() {}
function calcOperacji() {}
function getTotal() {}
