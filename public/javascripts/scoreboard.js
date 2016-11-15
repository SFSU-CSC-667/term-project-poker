(() => {

    setInterval(refreshScoreboard => {
        socket.emit('update scoreboard');
    }, 5000);

    socket.on('score update', data => {
        $('.scoreboard').empty();
        $('.scoreboard').append('<li><span class="col-lg-4">Rank</span>' +
            '<span class="col-lg-4">Name</span>' +
            '<span class="col-lg-4">Score</span></span></li>');
        var rank = 1;
        for (var key in data) {
            $('.scoreboard').append('<li><span class="col-lg-4">' + rank + '</span>' +
                '<span class="col-lg-4">' + data[key]["firstname"] + data[key]["lastname"] + '</span>' +
                '<span class="col-lg-4">' + data[key]["chips"] + '</span></li>');
            rank++;
        }
    });
})();
