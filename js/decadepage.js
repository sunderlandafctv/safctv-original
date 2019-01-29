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
//when mobile navigation page active allow/deny scrolling
$('#mobileCheck').change(function(){
    const nav = $('nav');
    const body = $('body');
    if($(this).is(':checked')&&nav.hasClass('active')==!1){
        //if the checkbox has changed to the checked state
        $(window).scrollTop(0);
        nav.addClass('active');
        body.addClass('navActive').bind('touchmove',function(e){e.preventDefault()})
    }
    else{
        nav.removeClass('active');
        body.removeClass('navActive').unbind('touchmove')
    }
});
//when navigation button is clicked, call a change tabs function and remove funky red triangle
$('nav a.clickable').on('click', function(){
    const thisButton = this;
    const triangleCheck = $('#homePageTriangleCheck');
    //remove triangle if it exists
    if(this.id!='home'){
        setTimeout(function(){
            $('header').removeClass('headerHome');
            changeTabs(thisButton)
        },250);
    }
    else{
        changeTabs(thisButton);
    }
    if($(window).width() <= 838 ){
        //auto exit the navbar (mobile)
        $('body').removeClass('navActive');
        setTimeout(function(){
            $('#mobileCheck').prop("checked", false);
        },150);
    }
});
//actually do the tab changing
function changeTabs(x){
    $('nav a.active').removeClass('active');
    $('section.active').removeClass('active');
    $('section#'+x.id).addClass('active');
    $(x).addClass('active');
    $('#navCheck').prop('checked', false);
    $('nav').removeClass('active');
    $('body').unbind('touchmove');
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
            $('.searchResults').attr('href','../player?ID='+parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        }
        else{$('.searchResults').html('');}
    });
}