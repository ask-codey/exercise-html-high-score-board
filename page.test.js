// Checks your high-score board: the lists, the table and the parts a screen reader relies on.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const nodeTest = require('node:test');

// Runs one check. When it fails, the output starts "Not yet:" and says what to fix, with no stack trace to scroll past.
function test(name, run) {
  return nodeTest(name, async (context) => {
    try {
      await run(context);
    } catch (error) {
      const problem = new Error(error.message);
      problem.stack = `Not yet: ${error.message}`;
      throw problem;
    }
  });
}
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { JSDOM } = require('jsdom');
const { HtmlValidate } = require('html-validate');

const html = readFileSync('index.html', 'utf8');
const page = new JSDOM(html).window.document;
const all = (selector, inside = page) => [...inside.querySelectorAll(selector)];
const text = (element) => element.textContent.replace(/\s+/g, ' ').trim();

// The data in scores.txt.
const countdown = ['BLIPBOB', 'MOONPIE', 'ZAPZOE', 'ROCKETROO', 'ORBITOZ', 'LASERLOU', 'COMETCAT', 'NOVAKID', 'STARFOX99', 'PIXELPAM'];
const topFive = ['PIXELPAM', 'STARFOX99', 'NOVAKID', 'COMETCAT', 'LASERLOU'];
const totals = ['All five', '143,850', '146,375', '148,300', '438,525'];
const powerUps = ['Shield Bubble', 'Twin Lasers', 'Warp Drive', 'Extra Life', 'Time Freeze', 'Mega Bomb'];

test('1) the page says its language and has a title', () => {
  assert.ok(page.documentElement.lang, 'Give <html> a lang attribute, such as lang="en".');
  assert.ok(page.title.trim(), 'Give the page a <title>.');
});

test('2) the top 10 is an ordered list of 10 players', () => {
  const list = page.querySelector('ol');
  assert.ok(list, 'Add the top 10 as an ordered list, <ol>: the order of the places matters.');
  const items = all(':scope > li', list);
  assert.equal(items.length, 10, `The top 10 needs 10 <li> items, one per player. It has ${items.length}.`);
});

test('3) the top 10 counts down, from 10th place to the winner', () => {
  const list = page.querySelector('ol');
  assert.ok(list, 'Add the top 10 as an ordered list, <ol>.');
  assert.ok(list.hasAttribute('reversed'), 'Add reversed to the <ol>, so the browser numbers it from 10 down to 1.');
  const items = all(':scope > li', list).map(text);
  countdown.forEach((tag, i) => {
    assert.ok(items[i]?.includes(tag),
      `Item ${i + 1} of the countdown should be ${tag}, number ${10 - i} on the board. It is: ${items[i] ?? 'missing'}`);
  });
});

test('4) the scores table has a caption', () => {
  const table = page.querySelector('table');
  assert.ok(table, 'Add the scores by level as a <table>.');
  const caption = table.querySelector('caption');
  assert.ok(caption && text(caption), 'Give the table a <caption> that says what it shows.');
  assert.equal(table.firstElementChild, caption, 'The <caption> goes first inside <table>, before any row.');
});

test('5) the table has a head, a body and a foot', () => {
  const table = page.querySelector('table');
  assert.ok(table, 'Add the scores by level as a <table>.');
  for (const part of ['thead', 'tbody', 'tfoot']) {
    assert.equal(all(`:scope > ${part}`, table).length, 1, `Give the table one <${part}>.`);
  }
  const headRows = all(':scope > thead > tr', table);
  assert.equal(headRows.length, 1, 'The <thead> holds one row: the column labels.');
  assert.deepEqual(all('th', headRows[0]).map(text), ['Player', 'Level 1', 'Level 2', 'Level 3', 'Total'],
    'The head row has five <th> cells: Player, Level 1, Level 2, Level 3 and Total.');
});

test('6) every header cell says what it labels with scope', () => {
  const headers = all('table th');
  assert.ok(headers.length > 0, 'Add header cells, <th>, to the table.');
  for (const th of headers) {
    const inHead = th.closest('thead') !== null;
    const expected = inHead ? 'col' : 'row';
    assert.equal(th.getAttribute('scope'), expected,
      `The header cell "${text(th)}" labels its ${inHead ? 'column' : 'row'}, so give it scope="${expected}".`);
  }
});

test('7) the table body has a row for each of the five players', () => {
  const rows = all('table > tbody > tr');
  assert.equal(rows.length, topFive.length, `The <tbody> needs one row per player: ${topFive.length} rows. It has ${rows.length}.`);
  rows.forEach((row, i) => {
    const cells = [...row.children];
    assert.equal(cells[0]?.tagName, 'TH', `Row ${i + 1} starts with the player's tag in a <th>, since it labels the row.`);
    assert.equal(text(cells[0]), topFive[i], `Row ${i + 1} is for ${topFive[i]}, in the order of scores.txt.`);
    assert.equal(cells.filter(cell => cell.tagName === 'TD').length, 4,
      `Row ${i + 1} (${topFive[i]}) needs four <td> cells: three level scores and the total.`);
  });
});

test('8) the totals row is in the foot', () => {
  const rows = all('table > tfoot > tr');
  assert.equal(rows.length, 1, 'The <tfoot> holds one row: the totals.');
  assert.equal(rows[0].firstElementChild?.tagName, 'TH', 'The totals row starts with "All five" in a <th>, since it labels the row.');
  assert.deepEqual([...rows[0].children].map(text), totals,
    `The totals row is: ${totals.join(', ')}.`);
});

test('9) the power-ups are a description list', () => {
  const list = page.querySelector('dl');
  assert.ok(list, 'Add the power-ups as a description list, <dl>.');
  const terms = all('dt', list);
  assert.deepEqual(terms.map(text), powerUps, `The <dl> needs a <dt> for each power-up, in order: ${powerUps.join(', ')}.`);
  for (const dt of terms) {
    assert.equal(dt.nextElementSibling?.tagName, 'DD', `Put what ${text(dt)} does in a <dd>, right after its <dt>.`);
  }
  const megaBomb = terms[terms.length - 1];
  let descriptions = 0;
  for (let next = megaBomb.nextElementSibling; next?.tagName === 'DD'; next = next.nextElementSibling) {
    descriptions++;
  }
  assert.equal(descriptions, 2, 'Mega Bomb has two descriptions, so it gets two <dd> elements after its <dt>.');
});

test('10) the page passes the HTML checker', async () => {
  const validator = new HtmlValidate({ extends: ['html-validate:standard'] });
  const report = await validator.validateString(html, 'index.html');
  const mistakes = report.results.flatMap(result => result.messages).map(m => `line ${m.line}: ${m.message}`);
  assert.equal(mistakes.length, 0, `Fix these mistakes in index.html:\n${mistakes.join('\n')}`);
});
