(() => {
    socket.emit('update scoreboard');
    socket.on('score update', data => {
        $('.scoreboard').clear();
        for (var score in data) {
            $('.scoreboard').append('<li>' + score['firstname'] + " " + score['lastname'] + " " + score['chips'] + '</li>');
        }
    });
})();
