import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    const [titleDiv, bodyDiv] = row.children;
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    moveInstrumentation(titleDiv, summary);
    summary.append(...titleDiv.childNodes);

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    moveInstrumentation(bodyDiv, body);
    body.append(...bodyDiv.childNodes);

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.open = i === 0;
    details.append(summary, body);

    row.replaceWith(details);
  });
}
