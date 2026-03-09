const display = document.querySelector('#display');
const keys = document.querySelector('.keys');

let expression = '';

const sanitizeExpression = (value) => value.replace(/[^0-9+\-*/.()]/g, '');

const render = (value) => {
  display.value = value || '0';
};

const evaluateExpression = () => {
  if (!expression) return;

  try {
    const safeExpression = sanitizeExpression(expression);
    const result = Function(`"use strict"; return (${safeExpression})`)();

    if (!Number.isFinite(result)) {
      render('Error');
      expression = '';
      return;
    }

    const rounded = Number.parseFloat(result.toFixed(10)).toString();
    render(rounded);
    expression = rounded;
  } catch {
    render('Error');
    expression = '';
  }
};

keys.addEventListener('click', (event) => {
  const target = event.target.closest('button[data-action]');
  if (!target) return;

  const { action, value } = target.dataset;

  if (action === 'clear') {
    expression = '';
    render('0');
    return;
  }

  if (action === 'delete') {
    expression = expression.slice(0, -1);
    render(expression);
    return;
  }

  if (action === 'equals') {
    evaluateExpression();
    return;
  }

  if (action === 'decimal') {
    const lastChunk = expression.split(/[+\-*/]/).pop() || '';
    if (lastChunk.includes('.')) return;
  }

  if (action === 'operator') {
    if (!expression && value !== '-') return;
    if (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1) + value;
      render(expression);
      return;
    }
  }

  expression += value;
  render(expression);
});

window.addEventListener('keydown', (event) => {
  const allowed = '0123456789.+-*/';

  if (allowed.includes(event.key)) {
    document.querySelector(`[data-value="${event.key}"]`)?.click();
    return;
  }

  if (event.key === 'Enter' || event.key === '=') {
    document.querySelector('[data-action="equals"]')?.click();
    return;
  }

  if (event.key === 'Backspace') {
    document.querySelector('[data-action="delete"]')?.click();
    return;
  }

  if (event.key.toLowerCase() === 'c') {
    document.querySelector('[data-action="clear"]')?.click();
  }
});
