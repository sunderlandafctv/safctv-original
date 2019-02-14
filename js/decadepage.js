/*
    https://sunderlandafc.tv
    written by Ryan Comerford
*/
//random number generator
function generateRandomNumber(min,max){let random_number=Math.random()*(max-min)+min;return Math.floor(random_number)}
function randomElementInArray(array){return array[generateRandomNumber(0,array.length)]}
//universal variable for file name
var testurl=window.location.pathname;var filename=testurl.substring(testurl.lastIndexOf('/')+1).substring(0,4);if(filename.substring(0,2)==19){filename=filename+'s';}
//create search array
var playerNames = FuzzySet();
//click the right button with a valid hash in url
$(document).ready(function() {
    var hash = window.location.hash;
    if (hash.toString() == '#players' || hash.toString() == '#videos') {
        $('nav a' + hash).click();
    }
});
//get player.csv from google drive
$.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/drive/v3/files/1Sgoayrj1r7aLMYx6T4VoNpzmJWI6v1aA?key=AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI',
    data: {'alt': 'media'},
    success: function(msg) {
        Papa.parse(msg, {
            header: true,
            complete: function(results) {
                $.each(results.data, function(i){
                    var playerI = results.data[i]
                    playerNames.add(String(results.data[i].Name));
                    if(playerI.Decade == filename.replace('s','')){
                        $('section#players').append(
                            '<button onclick="changePagePlayer('+playerI.ID+')" id="decadePlayersCard" style="margin: 25px 8.33%;">'+
						        '<img id="playerCardImg" class="left" src="../bin/Players/'+playerI.ID+'.png" style="margin: 5px 10px 10px 10px">'+
						        '<h1 class="center">'+playerI.Name.split(' ')[0]+'<br>'+playerI.Name.split(' ')[1]+'</h1>'+
						        '<span class="label accent text-center" style="margin: 25px 10px 10px 10px; padding: 7.5px;">Played from '+playerI['Years ']+'</span>'+
					        '</button>'
                        );
                    }
                })
                Search(results.data);
            }
        });
    }
});
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
            if(playlist.snippet.title.replace("'", '') == filename || (playlist.snippet.title == 'Pre WW1' && filename == 'PWW1') || (playlist.snippet.title == 'Pre WW2' && filename == 'PWW2')){
                $.ajax({
                    type: "GET",
                    url: "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDBs9KZOutpxzd-_fNSUAl-nj0rW01XXJI",
                    data: {
                        'playlistId': playlist.id,
                        'maxResults':'25',
                        'part': 'snippet'
                    },
                    success: function(results) {
                        $.each(results.items, function(i){
                            $('section#videos').append(
                                '<article id="embededVideo">'+
                                    '<iframe src="https://www.youtube.com/embed/'+results.items[i].snippet.resourceId.videoId+'"></iframe>'+
                                '</article>'
                            );
                        });
                        $('#recommendedVideo').append('<iframe src="https://www.youtube.com/embed/'+randomElementInArray(results.items).snippet.resourceId.videoId+'"></iframe>');
                    },
                    error: function(error){alert("Something's gone wrong :(");console.error('Error: '+error.responseJSON.error.message);}
                });
            }
        });
    },
    error: function(error){alert("Something's gone wrong :(");console.error('Error: '+error.responseJSON.error.message);}
});
//add a jquery boolean function to see if an element exists in the DOM
jQuery.fn.exists = function() {
    return this.length > 0;
}
//when mobile navigation page active allow/deny scrolling
$('#mobileCheck').change(function() {
    const nav = $('nav');
    const body = $('body');
    if ($(this).is(':checked') && nav.hasClass('active') == !1) {
        //if the checkbox has changed to the checked state
        $(window).scrollTop(0);
        nav.addClass('active');
        body.addClass('navActive').bind('touchmove', function(e) {
            e.preventDefault()
        })
    } else {
        nav.removeClass('active');
        body.removeClass('navActive').unbind('touchmove')
    }
});
//when navigation button is clicked, call a change tabs function and remove funky red triangle
$('nav a.clickable').on('click', function() {
    const thisButton = this;
    //remove triangle if it exists
    changeTabs(thisButton)
    if ($(window).width() <= 838) {
        //auto exit the navbar (mobile)
        $('body').removeClass('navActive');
        setTimeout(function() {
            $('#mobileCheck').prop('checked', false);
        }, 150);
    }
});
//actually do the tab changing
function changeTabs(x) {
    $('nav a.active').removeClass('active');
    $('section.active').removeClass('active');
    $('section#' + x.id).addClass('active');
    $(x).addClass('active');
    $('#navCheck').prop('checked', false);
    $('nav').removeClass('active');
    $('body').unbind('touchmove');
}
//search bar
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
function Search(parsedcsv) {
    const searchInput = $('#searchInput');
    searchInput.keyup(function() {
        if (playerNames.get(searchInput.val())) {
            var fuzzyresult = playerNames.get(searchInput.val())[0][1];
            $('.searchResults').html(fuzzyresult);
            $('.searchResults').attr('href', '../player?ID=' + parsedcsv.filter(data => data.Name === fuzzyresult)[0].ID);
        } else {
            $('.searchResults').html('');
        }
    });
}
//go to the correct player page when clicking a player button
function changePagePlayer(query){
    if(query != null){window.location.href = '../player?ID=' + query;}
}