/*
    https://sunderlandafc.tv
    written by Ryan Comerford
*/
/*
    LOADING CSVs
*/
var playerNames = FuzzySet();
//i dont know how to do xmlhttp requests so i've settled for fetch
fetch('https://raw.githubusercontent.com/sunderlandafctv/sunderlandafctv.github.io/master/csv/players.csv')
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
                Search(results.data)
            }
        });
    })
//again, but with videos.csv
fetch('https://raw.githubusercontent.com/sunderlandafctv/sunderlandafctv.github.io/master/csv/videos.csv')
    .then((data) => data.text())
    .then(function(fetch) {
        Papa.parse(fetch, {
            header: true,
            complete: function(results) {
                LoadDynamicContent(results.data)
            }
        });
    })
/*
    PAGE NAVIGATION
*/
//click the right button with a valid hash in url
$( document ).ready(function() {
    var hash = window.location.hash;
    if(hash.toString() == '#players' || hash.toString() == '#videos'){
        $('nav a'+hash).click();
    }
});
//add a jquery boolean funtion to see if an element exists in the DOM
jQuery.fn.exists = function(){ return this.length > 0; }
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
        if($('#homePageTriangleCheck').exists()){
            triangleCheck.prop("checked", true);
        }
        setTimeout(function(){
            $('header').removeClass('headerHome');
            changeTabs(thisButton)
        },250);
    }
    else{
        changeTabs(thisButton);
        if($('#homePageTriangleCheck').exists()){
            triangleCheck.prop("checked", false);
        }
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
/*
    SEARCH BAR
*/
$('#searchInput').focus(function(){
    $('.search').addClass('focus');
});
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
            $('.searchResults').html(fuzzyresult);
            $('.searchResults').attr('href','../player.html?ID='+parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        }
        else{$('.searchResults').html('');}
    });
}
/*
    GENERATE DYNAMIC CONTENT
*/
//load the dynamic content based on url ID query
function LoadDynamicContent(videocsv){
    var testurl = window.location.pathname;
    var filename = testurl.substring(testurl.lastIndexOf('/')+1).substring(0,4);
    if(filename.substring(0,2) == 19){
        filename = filename+'s';
    }
    var videosData = videocsv.filter(data => data.Season === filename)[0];
    if(videosData==undefined){
        console.error('incorrect id query');
        $('body').html(
            '<div class="flex h-center column" style="height: 80vh">'+
                '<h1 class="text-center accent" style="font-size: 100px; margin: 0;">Error</h1>'+
                '<p class="text-center">Something went wrong. Sorry.</p>'+
            '</div>'
        );
    }
    else{
        for(var i=1;i<videocsv.length-1; i++){
            if(videocsv[i].Season == filename){
                $('section#videos').append(
				    '<article class="w-half">'+
					    '<iframe src="https://www.youtube.com/embed/'+videocsv[i].Link.substring(videocsv[i].Link.lastIndexOf("/") + 1, videocsv[i].Link.length)+'"></iframe>'+
					'</article>'
                );
            }
        }
    }
}