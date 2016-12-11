(() => {
    socket.emit('update scoreboard');
    setInterval(refreshScoreboard => {
        socket.emit('update scoreboard');
    }, 5000);

    socket.on('score update', data => {
        $('.scoreboard').empty();
        $('.scoreboard').append('<tr><th>Rank</th><th>Name</th><th>Score</th><th>Wins</th><</tr>');
        var rank = 1;
        for (var key in data) {
            $('.scoreboard').append('<tr><td style="width: 20%;">' + rank + '</td><td style="width: 60%;">' + data[key]["firstname"] + " " + data[key]["lastname"] +
                '</td><td style="width: 20%;">' + data[key]["chips"] + '</td><td style="width: 20%;">' + data[key]["wins"] + '</td></tr>');
            rank++;
        }
    });
})();
