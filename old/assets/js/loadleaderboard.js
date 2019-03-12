var test = 2 + 2;
$.getJSON('leaderboard.json', (data) => {
    const tableData = data.reduce((pre, curr) => {
      return pre + `<tr><td>${curr.placement}</td><td><a href="https://www.r6db.com/player/${curr.id}">${curr.name}</a></td><td>${curr.value} + test</td></tr>`;
    }, '');

    $(tableData).appendTo('#leaderboard tbody');
});
