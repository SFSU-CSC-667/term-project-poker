(() => {
    socket.emit('update gamelist');

    $('#refresh-gamelist').on('click', event => {
        event.preventDefault();
        socket.emit('update gamelist');
    });

    socket.on('gamelist update', data => {
        $('.gamelist').empty();
        $('.gamelist').append('<li><span class="col-lg-1">No.</span>' +
            '<span class="col-lg-4">Name</span>' +
            '<span class="col-lg-1">Maximum Player</span>' +
            '<span class="col-lg-2">Stake</span>' +
            '<span class="col-lg-2">BuyIn</span></li>');
        for (var key in data) {
            $('.gamelist').append('<li><span class="col-lg-1">' + data[key]["gameid"] + '</span>' +
                '<span class="col-lg-4">' + data[key]["gamename"] + '</span>' +
                '<span class="col-lg-1">' + data[key]["maxplayers"] + '</span>' +
                '<span class="col-lg-2">' + data[key]["minbid"] + '</span>' +
                '<span class="col-lg-2">' + data[key]["minchips"] + '</span>' +
                '<button class="btn btn-primary" onclick="viewGame(' + data[key]["gameid"] + ')">View</button></li>');
        }
    });
})();

function viewGame(gameId) {
    sessionStorage.setItem('gameId', gameId);
    window.location.replace('/gameroom');
}