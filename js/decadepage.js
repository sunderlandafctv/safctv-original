/*
    https://sunderlandafc.tv
    written by Ryan Comerford
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
                PlayersTab(results.data);
            }
        });
    })
//home screen navigation
function HomeScreenNavigator(x){
    var xid =  $(x).attr('id');
    $('.sdl-nav-active').removeClass('sdl-nav-active');
    $('.sdl-main-active').removeClass('sdl-main-active');
    $('.'+ xid).addClass('sdl-main-active');
    $(x).addClass('sdl-nav-active');
    $('#sdl-nav-check').prop('checked', false);
}
//sorting numbers
function sortNumber(a,b) { return b - a; }
//add players into that tab
function PlayersTab(x){
    /*var completedplayers = [];
    for(i = 0; i < x.length-1; i++){
        var href = $(location).attr('href');
        var decade = href.substring( href.lastIndexOf('/')+1 ).substring( 0,4 );
        if(x.filter(data => data.Name === x[i].Name)[0].Decade == decade && completedplayers.indexOf(x[i].Name) === -1 ){
            document.getElementsByClassName('players')[0].innerHTML += 
            '<button onclick="Click('+x[i].ID+')" id="decadecard" class="sdl-home-half">'+
                '<h2 class="sdl-welcome-card-title" style="margin-top: 5px;">'+
                    x[i].Name+
                    '<span class="sdl-flag sdl-flag-'+x[i].Nationality+'"></span>'+
                '</h1>'+
                '<div id="decadecard-image" class="sdl-home-top" style="box-shadow: none; background: url('+x[i].Picture+') center / cover;">'+
                '</div>'+
            '</button>';
        completedplayers.push(x[i].Name)
    }*/
    var topscorers = []
    for(i = 0; i < x.length-1; i++){ topscorers.push(x[i].Goals); }
    topscorers = topscorers.slice(0, 4);
    for(i = 0; i < topscorers.length; i++){ 
        var buttonid = Number(i)+1;
        document.querySelector('.sdl-home-players-flex').innerHTML +=
        '<button id="top-scorer-'+buttonid+'" onclick="Click(1)">'+
            '<div class="sdl-card sdl-card-picture" style="height:100px; width: 100px; float: left; box-shadow: none; background: url('+x[i].Picture+') center / cover;"></div>'+
            '<h1 class="sdl-welcome-card-title">'+x[i].Name+'</h1>'+
            '<span class="sdl-label">'+x[i].Appearances+' games, '+x[i].Goals+' goals.</span>'+
        '</button>';
    }
}
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
            $('.searchResults').attr('href','../player.html?ID='+parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        }
        else{$('.searchResults').html('');}
    });
}