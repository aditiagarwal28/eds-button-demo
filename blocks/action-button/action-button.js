const ACTIONS = {
  'add-to-cart': async (button) => {
    button.disabled = true;
    button.classList.add('is-loading');
    const originalLabel = button.textContent;
    button.textContent = 'Adding…';
    await new Promise((resolve) => { setTimeout(resolve, 800); });
    button.textContent = 'Added ✓';
    button.dispatchEvent(new CustomEvent('cart:add', { bubbles: true }));
    setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
      button.classList.remove('is-loading');
    }, 1500);
  },
  'copy-link': async (button) => {
    await navigator.clipboard.writeText(window.location.href);
    const originalLabel = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalLabel;
    }, 1500);
  },
};

/**
 * loads and decorates the action-button block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [labelRow, actionRow, styleRow] = rows;
  const label = labelRow?.textContent.trim() || 'Button';
  const action = actionRow?.textContent.trim() || 'add-to-cart';
  const style = styleRow?.textContent.trim() || 'primary';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `button ${style}`;
  button.textContent = label;
  button.addEventListener('click', () => {
    const handler = ACTIONS[action];
    if (handler) handler(button);
  });

  block.textContent = '';
  block.append(button);
}
