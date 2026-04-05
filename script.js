const display = document.getElementById('result');
const expression = document.getElementById('expression');

let current = '0';
let previous = '';
let operator = null;
let shouldReset = false;

function updateDisplay() {
  display.textContent = current;
  if (operator && previous) {
    const opSymbol = { '/': '÷', '*': '×', '-': '−', '+': '+' }[operator];
    expression.textContent = `${previous} ${opSymbol}`;
  } else {
    expression.textContent = '';
  }
}

function inputNumber(num) {
  if (shouldReset) {
    current = num;
    shouldReset = false;
  } else if (current === '0' && num !== '.') {
    current = num;
  } else {
    if (current.length >= 12) return;
    current += num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldReset) {
    current = '0.';
    shouldReset = false;
    updateDisplay();
    return;
  }
  if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

function calculate() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;

  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    default: return;
  }

  if (typeof result === 'number') {
    // Avoid floating point display issues
    result = parseFloat(result.toPrecision(12)).toString();
    if (result.length > 12) {
      result = parseFloat(result).toExponential(6);
    }
  }

  current = result.toString();
  operator = null;
  previous = '';
  shouldReset = true;
  updateDisplay();
}

function handleOperator(op) {
  if (operator && !shouldReset) {
    calculate();
  }
  previous = current;
  operator = op;
  shouldReset = true;
  updateDisplay();
  highlightOperator(op);
}

function clear() {
  current = '0';
  previous = '';
  operator = null;
  shouldReset = false;
  updateDisplay();
  clearOperatorHighlight();
}

function toggleSign() {
  if (current === '0' || current === 'Error') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function percent() {
  current = (parseFloat(current) / 100).toString();
  updateDisplay();
}

function highlightOperator(op) {
  clearOperatorHighlight();
  const btn = document.querySelector(`[data-value="${op}"].op`);
  if (btn) btn.classList.add('active');
}

function clearOperatorHighlight() {
  document.querySelectorAll('.op').forEach(b => b.classList.remove('active'));
}

// Button click handler
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  clearOperatorHighlight();

  switch (action) {
    case 'number':
      inputNumber(btn.dataset.value);
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'op':
      handleOperator(btn.dataset.value);
      break;
    case 'equals':
      calculate();
      break;
    case 'clear':
      clear();
      break;
    case 'toggle-sign':
      toggleSign();
      break;
    case 'percent':
      percent();
      break;
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  clearOperatorHighlight();
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') handleOperator('+');
  else if (e.key === '-') handleOperator('-');
  else if (e.key === '*') handleOperator('*');
  else if (e.key === '/') { e.preventDefault(); handleOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clear();
  else if (e.key === '%') percent();
});

updateDisplay();
