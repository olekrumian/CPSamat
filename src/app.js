const input = document.querySelectorAll('input')
const inputDate = document.querySelector('.date')
const readyBtn = document.querySelector('.ready_btn')
const removeBtn = document.querySelector('.remove_btn')
const xlsBtn = document.querySelector('.exportxls')
const tbody = document.querySelector('.tbody')
// tab switch
const btns = document.querySelectorAll('.tab_btn')
const btnContainer = document.querySelector('.btn_container')
const tab = document.querySelectorAll('.tab')
const form = document.querySelectorAll('.form_operacji')
const operacjiCalc = document.getElementById('hour')
const body = document.querySelector('body')

const outracone = document.querySelector('.outracone')
const jutracone = document.querySelector('.jutracone')
const inputGoal = document.querySelectorAll('.input_goal')
const driveInput = document.querySelector('#drive')
const dyzur = document.querySelector('.dyzur')
const weekend = document.querySelector('.weekend')
const premia = document.querySelector('.premia')

//* Event listener
// addButton
readyBtn.addEventListener('click', setUpTable)
removeBtn.addEventListener('click', clearLocalStorage)
xlsBtn.addEventListener('click', exportXls)
document.addEventListener('DOMContentLoaded', getTotalOperacji)

driveInput.addEventListener('keyup', (e) => {
  const value = e.target.value
  if (value.includes(',')) {
    e.target.value = value.replace(',', '.')
  }
})

//* Function
// switch tab
btnContainer.addEventListener('click', function (e) {
  const id = e.target.dataset.id
  if (id) {
    // remove active from other buttons
    btns.forEach(function (btn) {
      btn.classList.remove('active')
      e.target.classList.add('active')
    })
    // hide other articles
    tab.forEach(function (tabs) {
      tabs.classList.remove('active')
    })
    const tabs = document.getElementById(id)
    tabs.classList.add('active')
  }
})

// get time
function timeCount() {
  let today = new Date()

  let day = today.getDate()
  let month = today.getMonth() + 1
  if (month < 10) month = '0' + month
  let year = today.getFullYear()

  let hour = today.getHours()
  if (hour < 10) hour = '0' + hour

  let min = today.getMinutes()
  if (min < 10) min = '0' + min

  inputDate.value = `${day}.${month}.${year} ${hour}:${min}`

  if ((hour > 19 && hour < 24) || (hour > 0 && hour < 8)) {
    body.classList.add('night-theme')
  } else if (hour > 7 && hour < 20) {
    body.classList.remove('night-theme')
    body.classList.add('day-theme')
  }
}
timeCount()
setInterval(timeCount, 60000)

// setup table
function setUpTable() {
  const newTr = document.createElement('tr')
  newTr.classList.add('table_row')
  const id = new Date().getTime().toString()
  const atrr = document.createAttribute('data-id')
  atrr.value = id
  newTr.setAttributeNode(atrr)

  let miejsce = input[0].value
  let kilometry = input[1].value
  let data = input[2].value
  let operacji = input[3].value
  const uwagi = () => {
    if (miejsce.includes('Operacji(Utracone)')) {
      return 'O(Utracone)'
    } else if (miejsce.includes('Jazda(Utracone)')) {
      return 'J(Utracone)'
    } else if (miejsce.includes('Dyżur')) {
      return 'Dyzur'
    } else if (miejsce.includes('Weekendy')) {
      return 'Weekend'
    } else if (miejsce.includes('Premia')) {
      return 'Premia'
    } else if (miejsce.includes('Jazda')) {
      return 'Jazda'
    } else {
      return ''
    }
  }

  if (!miejsce || !kilometry) return

  if (!operacji) {
    operacji = '1'
  }

  newTr.innerHTML = `
              <td class="miejsce">${miejsce}</td>
              <td class="kilometry">${kilometry}</td>
              <td class="data">${data}</td>
              <td class="operacji">${operacji}</td>
              <td class="uwagi">${uwagi()}</td>
              <td><button class="usun"><img src="./img/trash.svg" alt=""></button></td>
  `

  tbody.appendChild(newTr)

  const values = {
    miejsce: miejsce,
    kilometry: kilometry,
    data: data,
    operacji: operacji,
    uwagi: uwagi(),
  }

  addToLocalStorage(id, values)
  getTotalOperacji(getLocalStorage)
  window.location.reload()
}

const fetchTable = () => {
  const respons = localStorage.getItem('table')
  const data = JSON.parse(respons)
  renderTab(data)
}

document.addEventListener('DOMContentLoaded', fetchTable)

const renderTab = (list) => {
  const tabList = list
    .map((item) => {
      const {
        id,
        value: { miejsce, kilometry, data, operacji, uwagi },
      } = item
      return `
        <tr clas="table_row" data-id="${id}">
        <td>${miejsce}</td>
        <td>${kilometry}</td>
        <td>${data}</td>
        <td>${operacji}</td>
        <td>${uwagi}</td>
        <td><button class="usun"><img src="./img/trash.svg" alt=""></button></td>
        </tr>
        `
    })
    .join('')
  tbody.innerHTML = tabList

  // delete item
  const deleteBtn = document.querySelectorAll('.usun')
  deleteBtn.forEach((element) => {
    element.addEventListener('click', (e) => {
      const element = e.currentTarget.parentElement.parentElement
      const id = element.dataset.id
      tbody.removeChild(element)
      removeFromLocalStorage(id)
      getTotalOperacji(getLocalStorage)
    })
  })
}

// add to localstorage
function addToLocalStorage(id, value) {
  const table = { id, value }
  let items = getLocalStorage()
  items.push(table)
  localStorage.setItem('table', JSON.stringify(items))
}

// get localstorage
function getLocalStorage() {
  return localStorage.getItem('table')
    ? JSON.parse(localStorage.getItem('table'))
    : []
}

const utracone = () => {
  const array = getLocalStorage()

  const jazda = array.filter((elem) => elem.value.uwagi === 'Jazda')
  const arrayJUtr = array.filter((elem) => elem.value.uwagi === 'J(Utracone)')
  const arrayOUtr = array.filter((elem) => elem.value.uwagi === 'O(Utracone)')
  const arrayDyzur = array.filter((elem) => elem.value.uwagi === 'Dyzur')
  const arrayWeekend = array.filter((elem) => elem.value.uwagi === 'Weekend')
  const arrayPremia = array.filter((elem) => elem.value.uwagi === 'Premia')
  const jazdaTotal = jazda.reduce((total, elem) => {
    total += parseInt(elem.value.operacji)
    return total
  }, 0)
  const utraconeJazdaTotal = arrayJUtr.reduce((total, elem) => {
    total += parseInt(elem.value.operacji)
    return total
  }, 0)
  const utraconeOperacjiTotal = arrayOUtr.reduce((total, elem) => {
    total += parseInt(elem.value.operacji)
    return total
  }, 0)
  const dyzurTotal = arrayDyzur.reduce((total, elem) => {
    total += parseInt(elem.value.operacji)
    return total
  }, 0)
  const weekendTotal = arrayWeekend.reduce((total, elem) => {
    total += parseInt(elem.value.operacji)
    return total
  }, 0)
  const premiaTotal = arrayPremia.reduce((total, elem) => {
    total += parseInt(elem.value.operacji)
    return total
  }, 0)

  return [
    jazdaTotal,
    utraconeOperacjiTotal,
    utraconeJazdaTotal,
    dyzurTotal,
    weekendTotal,
    premiaTotal,
  ]
}

// delete from localstorage
function removeFromLocalStorage(id) {
  let items = getLocalStorage(id)
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('table', JSON.stringify(items))
}

// clear localstorage
function clearLocalStorage() {
  if (confirm('Potwierdzić') == true) {
    localStorage.clear()
    window.location.reload()
  } else {
    window.location.reload()
  }
}

// Suma operacji
function getTotalOperacji() {
  const [
    jazdaTotal,
    utraconeOperacjiTotal,
    utraconeJazdaTotal,
    dyzurTotal,
    weekendTotal,
    premiaTotal,
  ] = utracone()
  const hourGoal = document.getElementsByClassName('hour')
  const suma = getLocalStorage()
  let totalOperacji = 0
  if (suma.length > 0) {
    suma.forEach((element) => {
      totalOperacji += parseInt(element.value.operacji)
    })
  }
  document.querySelector('.calculate').innerHTML = `<p>Operacji: ${
    totalOperacji -
    jazdaTotal -
    utraconeOperacjiTotal -
    utraconeJazdaTotal -
    dyzurTotal -
    weekendTotal -
    premiaTotal
  } Op.Utr: ${utraconeOperacjiTotal} Jaz.Utr: ${utraconeJazdaTotal} </p>`

  if (!totalOperacji) {
    operacjiCalc.value = 'Ilość'
  } else {
    operacjiCalc.value =
      totalOperacji -
      jazdaTotal -
      utraconeOperacjiTotal -
      utraconeJazdaTotal -
      dyzurTotal -
      weekendTotal -
      premiaTotal
    hourGoal[0].value =
      (totalOperacji -
        jazdaTotal -
        utraconeOperacjiTotal -
        utraconeJazdaTotal -
        dyzurTotal -
        weekendTotal -
        premiaTotal) *
      42
  }

  drive.value = jazdaTotal
  inputGoal[2].value = drive.value * 42
  outracone.value = utraconeOperacjiTotal
  inputGoal[1].value = outracone.value * 21
  jutracone.value = utraconeJazdaTotal
  inputGoal[3].value = jutracone.value * 21
  dyzur.value = dyzurTotal
  inputGoal[4].value = dyzur.value * 150
  weekend.value = weekendTotal
  inputGoal[5].value = weekend.value * 150
  premia.value = premiaTotal
  inputGoal[6].value = premia.value * 100

  getTotal()
}

form.forEach((element) => {
  element.addEventListener('keyup', function (e) {
    const value = e.target.value
    const inputValue = element.querySelector('.input_value')
    const inputGoal = element.querySelector('.input_goal')
    const drive = document.getElementById('drive')
    //FIXME: DRY // const hour = document.getElementById('hour')
    const halfhour = document.getElementById('halfhour')
    const premia = document.getElementById('premia')
    const payDays = document.getElementById('payDays')

    if (inputValue.id === hour.id) {
      inputGoal.value = value * 42
    } else if (inputValue.id === drive.id) {
      function convertH2M(timeInHour) {
        return Math.floor(timeInHour * 60)
      }
      const timeInMinutes = convertH2M(drive.value) * 0.7
      inputGoal.value = Math.ceil(timeInMinutes)
    } else if (inputValue.id === halfhour.id) {
      inputGoal.value = value * 21
    } else if (inputValue.id === premia.id) {
      inputGoal.value = value * 100
    } else if (inputValue.id === payDays.id) {
      inputGoal.value = value * 150
    } else {
      console.log('error')
    }

    getTotal()
  })
})

function getTotal() {
  const arr = document.querySelectorAll('.input_goal')
  let total = 0
  for (let i = 0; i < arr.length; i++) {
    if (parseInt(arr[i].value)) {
      total += parseInt(arr[i].value)
    }
  }
  const btnSum = document.querySelector('.wyplata')
  btnSum.innerText = total
}

// export to xsl
function exportXls() {
  const table2excel = new Table2Excel()
  table2excel.export(document.querySelectorAll('#table'))
}
