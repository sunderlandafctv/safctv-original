/*
* https://sunderlandafc.tv
* written by Ryan Comerford
*/
var playerNames = FuzzySet();
//i dont know how to do xmlhttp requests so i've settled for fetch
fetch('https://raw.githubusercontent.com/ryncmrfrd/sunderland/master/csv/players.csv')
    .then((data) => data.text())
    .then(function(fetch) {
        Papa.parse(fetch, {
            header: true,
            complete: function(results) {
                //create an array for search function later
                for (var i = 0; i < results.data.length-1; i++) { 
                    playerNames.add( String(results.data[i].Name) );
                }
                //callin' functionz
                Search(results.data);
                LoadPlayerContent(results.data);
            }
        });
    })
//again, but with videos.csv
fetch('https://raw.githubusercontent.com/ryncmrfrd/sunderland/master/csv/videos.csv')
    .then((data) => data.text())
    .then(function(fetch) {
        Papsa.parse(fetch, {
            header: true,
            complete: function(results) {
                LoadVideos(results.data)
            }
        });
    })
//c'est cool outline around the search bar on focus. now with fades
$('#searchInput').focus(function(){$('.search').addClass('focus');});
$('#searchInput').focusout(function(){
    $('.search').removeClass('focus');
    $('#searchInput').val('');
    setTimeout(function(){
        $('.searchResults').html('');
        $('.searchResults').attr('');
    },2000);
});
//search players.csv and return fuzzy.js result as link
function Search(parsedcsv){
    const searchInput = $('#searchInput');
    searchInput.keyup(function(){
        if(playerNames.get(searchInput.val())){
            var fuzzyresult = playerNames.get(searchInput.val())[0][1];
            console.log(fuzzyresult)
            $('.searchResults').html(fuzzyresult);
            console.log($('.searchResults').html())
            $('.searchResults').attr('href','player.html?ID='+parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        }
        else{$('.searchResults').html('');}
    });
}
//load the dynamic content based on url ID query
function LoadPlayerContent(playercsv){
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    const id = searchParams.get('ID');
    var playerData = playercsv.filter(data => data.ID === id)[0];
    //if a valid ID is present
    if(playerData==undefined){
        console.error('incorrect id query');
        $('body').html(
            '<div class="flex h-center column" style="height: 80vh">'+
                '<h1 class="text-center accent" style="font-size: 150px; margin: 0;">404</h1>'+
                '<p class="text-center">The player your equested was not found.</p>'+
            '</div>'
        );
    }
    else{
        $(document).attr('title', playerData.Name+' - SunderlandAFC.TV');
        $('#playerName').html('<strong class="accent">'+playerData.Name+'</strong> ('+playerData.Years+')');
        $('#playerDescription').html(playerData.Overview);
        $('#playerImage').attr("src",playerData.Picture);
        $('#playerGames').html(playerData.Appearances);
        $('#playerGoals').html(playerData.Goals);
        $('#playerDecadesLink').attr('href','decades/'+playerData.Decade+'.html').html( playerData.Decade+"'s");
        $('#playerStatsLink').attr('href',playerData.Statistics)
    }
}
//load the dynamic content based on url ID query
function LoadVideos(videoscsv){
    for(var i =0; i < videoscsv.length; i++){
        console.log(videoscsv[i].title)
    }
}
//search players.csv and return fuzzy.js result as link
function Search(parsedcsv){
    const searchInput = $('#searchInput');
    searchInput.keyup(function(){
        if(playerNames.get(searchInput.val())){
            var fuzzyresult = playerNames.get(searchInput.val())[0][1];
            console.log(fuzzyresult)
            $('.searchResults').html(fuzzyresult);
            console.log($('.searchResults').html())
            $('.searchResults').attr('href','player.html?ID='+parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        }
        else{$('.searchResults').html('');}
    });
}
//