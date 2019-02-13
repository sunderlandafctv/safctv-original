var playerNames = FuzzySet();
const token = 'AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI';
//get player.csv from google drive
$.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/drive/v3/files/1Sgoayrj1r7aLMYx6T4VoNpzmJWI6v1aA?key=AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI',
    data: {'alt': 'media'},
    success: function(msg) {
        Papa.parse(msg, {
            header: true,
            complete: function(results) {
                //create an array for search function later
                for (var i = 0; i < results.data.length - 1; i++) {
                    playerNames.add(String(results.data[i].Name));
                }
                //callin' functionz
                Search(results.data);
                LoadPlayerContent(results.data);
            }
        });
    }
});
//load the dynamic content based on url ID query
function LoadPlayerContent(playercsv) {
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    const id = searchParams.get('ID');
    var playerData = playercsv.filter(data => data.ID === id)[0];
    //videos.csv
    $.ajax({
        type: "GET",
        url: "https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI",
        data: {
            'channelId': 'UCoh98rO2DkogICZKE-2fJ7g',
            'maxResults':'50',
            'part': 'snippet,contentDetails'
    },
    success: function(results) {
        $.each(results.items, function(i){
            var playlist = results.items[i];
            if(!playerData){
                $('#visibleScreen').html(
                    '<div class="flex h-center column" style="height: 80vh">' +
                        '<h1 class="text-center accent" style="font-size: 150px; margin: 0;">404</h1>' +
                        '<p class="text-center">The player your equested was not found.</p>' +
                        '<p class="text-center"><a class="label accent" href="/">take me home</a></p>'+
                    '</div>'
                );
            }
            if(playerData && playlist.snippet.title == playerData.Name){
                $.ajax({
                    type: "GET",
                    url: "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI",
                    data: {
                        'playlistId': playlist.id,
                        'maxResults':'25',
                        'part': 'snippet'
                    },
                    success: function(results) {
                        $('#watchVideos').text(playerData.Name);
                        $.each(results.items, function(i){
                            $('#playerVideos').append(
                                '<article id="embededVideo">'+
                                    '<iframe src="https://www.youtube.com/embed/'+results.items[i].snippet.resourceId.videoId+'"></iframe>'+
                                '</article>'
                            );
                        });
                        console.log('yeet'+playerData == undefined)
                        if (playerData) {
                            $(document).attr('title', playerData.Name + ' - SunderlandAFC.TV');
                            $('#playerName').html('<strong class="accent">' + playerData.Name + '</strong> (' + playerData['Years '] + ')');
                            $('#playerDescription').html(playerData.Overview);
                            $('#playerImage').attr('src', 'bin/Players/'+playerData.ID+'.png');
                            $('#playerGames').html(playerData.Appearances);
                            $('#playerGoals').html(playerData.Goals);
                            $('#playerDecadesLink').attr('href', 'decades/' + playerData.Decade + '.html').html(playerData.Decade + "'s");
                            $('#playerStatsLink').attr('href', playerData.Statistics)
                        }
                    },
                    error: function(error){alert("Something's gone wrong :(");console.error('Error: '+error.responseJSON.error.message);}
                });
            }
        });
    },
    error: function(error){alert("Something's gone wrong :(");console.error('Error: '+error.responseJSON.error.message);}
});}
//c'est cool outline around the search bar on focus. now with fades
$('#searchInput').focus(function() {
    $('.search').addClass('focus');
});
$('#searchInput').focusout(function() {
    $('.search').removeClass('focus');
    $('#searchInput').val('');
    setTimeout(function() {
        $('.searchResults').html('');
        $('.searchResults').attr('');
    }, 2000);
});
//search players.csv and return fuzzy.js result as link
function Search(parsedcsv){
    const searchInput = $('#searchInput');
    searchInput.keyup(function() {
        if (playerNames.get(searchInput.val())) {
            var fuzzyresult = playerNames.get(searchInput.val())[0][1];
            $('.searchResults').html(fuzzyresult);
            $('.searchResults').attr('href', 'player.html?ID=' + parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        } else {
            $('.searchResults').html('');
        }
    });
}