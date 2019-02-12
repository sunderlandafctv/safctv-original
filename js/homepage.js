/*
* https://sunderlandafc.tv
* written by Ryan Comerford
*/
/*
    PAGE NAVIGATION
*/
//add a jquery boolean funtion to see if an element exists in the DOM
jQuery.fn.exists = function(){ return this.length > 0; }
//when mobile navigation page active allow/deny scrolling
$('#mobileCheck').change(function(){
    const nav = $('nav');
    const body = $('body');
    const hamburger = $('.hamburger');
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
            triangleCheck.prop('checked', true);
        }
        setTimeout(function(){
            $('header').removeClass('headerHome');
            changeTabs(thisButton)
        },250);
    }
    else{
        changeTabs(thisButton);
        if($('#homePageTriangleCheck').exists()){
            triangleCheck.prop('checked', false);
        }
    }
    if($(window).width() <= 838 ){
        //auto exit the navbar (mobile)
        $('body').removeClass('navActive');
        setTimeout(function(){
            $('#mobileCheck').prop('checked', false);
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
    HREF CHANGING
*/
//go to the correct player page when clicking a player button
function changePagePlayer(query){
    if(query != null){window.location.href = 'player?ID=' + query;}
}
//go to the correct player page
function decadePage(filename){
    if(filename != null){window.location.href = 'decade/' + filename;}
}