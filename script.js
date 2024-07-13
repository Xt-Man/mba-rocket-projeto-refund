// Seleciona os elementos do formulário
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para fornecer o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g,"")

  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
  return value
}

// Captura o submit do formulário
form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento li para adicionar na ul
    const expenseItem = document.createElement("li")
    expenseItem.classList.add('expense')

    // cria o ícone
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // adiciona nome e categoria na div info
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`

    // Cria o ícone de remover despesa da lista
    const removeIcon = document.createElement("img")
    removeIcon.setAttribute("src", `img/remove.svg`)
    removeIcon.setAttribute("alt", 'deleta despesa')
    removeIcon.classList.add('remove-icon')

    // adiciona informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // adiciona item na lista
    expenseList.append(expenseItem)
    
    // Limpa o form
    formClear()
    
    // Atualiza os totais
    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // recupera todos os itens (li) da lista (ul)
    const items = expenseList.children

    // Atualiza a quantidade de itens da lista no header
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? 'despesas' : 'despesa'
    }`

    // Variável para somar o valor total
    let total = 0

    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
    
      // Remove chars não numéricos, troca , por .
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")
      
      // Converte para float
      value = parseFloat(value)

      // Verifica se é número
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total.O valor não parece ser um número")
      }

      total += Number(value)
    }

    // Cria a small do R$ formatado
    const symbolBRL = document.createElement('small')
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$, pois já está na small
    total = formatCurrencyBRL(total).toUpperCase().replace("R$","")

    // Limpa o conteúdo
    expensesTotal.innerHTML = ""

    // Adiciona o small R$ e o valor formatado
    expensesTotal.append(symbolBRL, total)

  } catch (error) {
    alert("Não foi possível atualizar os totais")
    console.log(error)
  }
}

// Evento que captura o click nos itens da lista
expenseList.addEventListener("click", function (event) {

  // Verifica se clicou no ícone de remover
  if (event.target.classList.contains('remove-icon')) {
    // obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")
    // Remove o item da lista
    item.remove()
  }
  updateTotals()
})

function formClear(){
  // Limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""
  // foca no input de nome da despesa
  expense.focus()
}