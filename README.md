# Exercise: A Game High-Score Board

Exercise code for the lesson **Exercise: A Game High-Score Board** in HTML in Depth on [ask-codey.com](https://www.ask-codey.com).

The Galaxy Blasters Arcade wants a high-score board on its website. You'll build it in `index.html` from the data in `scores.txt`: a top-10 countdown, a table of each top player's scores on every level, and a list of the game's power-ups. Tests check the structure as you go.

## What's here

- `index.html`: the page, with its header, footer and three empty sections. A comment in each section says what goes there. For you to finish.
- `scores.txt`: the scores, the caption, the totals and the power-ups, as plain text to mark up. Ready to use.
- `style.css`: the arcade look, linked from `index.html`. It styles plain HTML elements, so your lists and table look right as soon as they're in place. Ready to use; you don't need to change it.
- `page.test.js`: the tests that check your page. You don't need to change this file.
- `package.json`: names the two tools the tests use, jsdom (reads your page the way a browser does) and html-validate (checks it for HTML mistakes). Ready to use.

## Run it

Open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**. The page reloads each time you save.

## Check your work

Open VS Code's terminal (**Terminal > New Terminal**) and type, once:

```bash
npm install
```

Then, every time you want to check your page:

```bash
npm test
```

At first almost every test fails: that is expected. Each part you finish turns its tests green. A failing test's message says what it looked for, for example *Item 1 of the countdown should be BLIPBOB, number 10 on the board.*

## What to do

1. **The top 10 countdown.** An ordered list that starts with 10th place and ends with the winner, numbered from 10 down to 1. Each item is a player and their score, such as `PIXELPAM: 98,450`.
2. **The scores table.** A table with a caption; a head with the column labels; a body with one row for each of the five players, starting with the player's tag; and a foot with the totals row. Every header cell has a `scope`: `col` when it labels a column, `row` when it labels a row.
3. **The power-ups.** A description list: each power-up's name, then what it does. Mega Bomb has two descriptions.

Copy the words and numbers from `scores.txt` as they are: the tests look for them.

## Tips

- Build one part at a time and run `npm test` after each. The tests for that part turn green before you start the next.
- The countdown lists 10th place first. One attribute on the list makes the browser number it from 10 down.
- Count the cells in every row of your table: the head, each body row and the totals row all have five.
- The name at the start of a row labels the row, so it's a header cell too.
- If the HTML checker test fails, its message gives the line number of each mistake. A missing closing tag is the usual one.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Work on GitHub* walks through every screen.
