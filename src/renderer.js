let expression = ''
let allowedValues = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '-',
  '/',
  '*',
  '=',
  '.',
  'C',
  'Enter',
  'Backspace',
  'Delete'
]

let container = document.querySelector('.container')
let resultEl = document.querySelector('.result')

container.addEventListener('click', (e) => {
  let value = e.target.dataset.value
  if (value) {
    calculateExpression(value)
  }
})

function calculateExpression(value) {
  if (value === 'C') {
    expression = ''
  } else if (value === '=' || value === 'Enter') {
    expression = `${eval(expression)}`
  } else if (value === 'Delete' || value === 'Backspace') {
    expression = expression.substring(0, expression.length - 1)
  } else {
    expression = expression + value
  }
  resultEl.textContent = expression
}

window.addEventListener('keydown', (e) => {
  let value = e.key
  if (value === 'Enter') {
    e.preventDefault()
  }
  if (allowedValues.includes(value)) {
    calculateExpression(value)
  }
})
