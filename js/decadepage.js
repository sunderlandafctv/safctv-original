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
    var completedplayers = [];
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
        }
    }

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
//Link to player page
function Click(x){
    setTimeout(function(){
        window.location.href = '../player.html?ID=' + x;
    }, 200);
}
//CSV FILES BOI
fetch('https://raw.githubusercontent.com/ryncmrfrd/sunderland/master/csv/players.csv')
    .then((data) => data.text())
    .then(function(result) {
        PlayersTab( Papa.parse(result, {header:true}).data );
        console.log('Dynamic content loaded correctly.');
    })
    .catch(function(err) {
        console.error(err);
        //window.location.href = '404.html';
    });