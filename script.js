var firstCard = null;
var secondCard = null;
var matchCounter = 0;
var canClick = true;
var attempts = 0;
var accuracy = 0;
var gamesPlayed = 0;
var artist = 'Beyonce';
var cardImg = [
    'image/scooby1.jpg',
    'image/scooby2.jpg',
    'image/scooby3.jpg',
    'image/scooby4.jpg',
    'image/scooby5.jpg',
    'image/scooby6.jpg',
    'image/scooby7.jpg',
    'image/scooby8.jpg',
    'image/scooby9.jpg'
];
/*********** SETS CARDS CLICKED ***********/
function cardClick(card) {
    if (firstCard === null) {
        firstCard = card;
        $(firstCard).find('.card').addClass('flipcard');
    }
    else {
        secondCard = card;
        canClick = false;
        $(secondCard).find('.card').addClass('flipcard');
        cardMatch();
    }
}

/*********** RESETS CARDS  ************/
function resetCard() {
    firstCard = null;
    secondCard = null;
    canClick = true;
}

/*********** RESETS STATS ************/
function resetStats() {
    gamesPlayed++;
    accuracy = 0;
    attempts = 0;
}

/*********** RESETS THE WHOLE GAME ************/
function reset() {
    $('#game_area').html('');
    resetStats();
    displayStats();
    resetCard();
    randomizeCards();
    $('.card').removeClass('flipcard');

}

/*********** DISPLAY STATS TO THE DOM  ************/
function displayStats() {
    $('.games_played .value').text(gamesPlayed);
    $('.attempts .value').text(attempts);
    if (attempts > 0) {
        var accuracyAttempts = Math.ceil((matchCounter / attempts) * 100);
        $('.accuracy .value').text(accuracyAttempts + '%');
    }
    else {
        $('.accuracy .value').text('');
    }
}

/*********** CHECKS FOR CARD MATCH  ************/
function cardMatch() {
    if ($(firstCard).find('.frontimage').attr('src') == $(secondCard).find('.frontimage').attr('src')) {
        matchCounter++;
        attempts++;
        mystery();
        displayStats();
        resetCard();
    }
    else {
        setTimeout(function () {
            $(firstCard).removeClass('flipcard');
            $(secondCard).removeClass('flipcard');
            attempts++;
            displayStats();
            resetCard();
        }, 1500)
    }
}

/*********** RANDOMIZES THE CARD DYNAMICALLY APPENDS TO DOM ************/
function randomizeCards() {
    var doubleCards = cardImg.concat(cardImg);
    var randomArray = [];
    for (var x = doubleCards.length; x > 0; x--) {
        var randomCard = Math.floor(Math.random() * doubleCards.length);
        randomArray.push(doubleCards[ randomArray ]);
        var cardDiv = $('<div>').addClass('card');
        var frontDiv = $('<div>').addClass('front');
        var frontImg = $('<img>').addClass('frontimage').attr('src', doubleCards[ randomCard ]);
        var backDiv = $('<div>').addClass('back');
        var backImg = $('<img>').addClass('backimage').attr('src', 'image/cardback.jpg');
        var frontCard = $(frontDiv).append(frontImg);
        var backCard = $(backDiv).append(backImg);
        var bothCards = $(cardDiv).append(frontCard, backCard);
        $('#game_area').append(bothCards);
        doubleCards.splice(randomCard, 1);
    }
    $('.card').click(function () {
        if (canClick) {
            cardClick(this);
            $(this).addClass('flipcard');
        }
    });
}

/*function gameWon(){
 if(matchCounter == totalMatch){
 console.log('You\'ve Won');
 }
 }*/

/*********** API CALL TO SPOTIFY FOR ARTIST  ************/
function spotifyArtist() {
    $.ajax({
        dataType: 'json',
        url: "https://api.spotify.com/v1/search?q=" + artist + "&type=artist",
        method: 'get',
        success: function (response) {
            console.log(response);
            var mysteryArtist = response.artists.items[ 0 ].images[ 1 ].url;
            console.log(mysteryArtist);
            var addArtist = $('<img>').attr('src', mysteryArtist).css({
                position: 'absolute',
                top: '0',
                left: '0',
                height: '94%',
                width: '100%',
                zIndex: '0'
            });
            $('.mystery_artist').append(addArtist)
        },
        error: function (response) {
            console.log('We didn\'t get a response');
        }
    });

    $.ajax({
        dataType: 'json',
        url: 'https://api.spotify.com/v1/albums/' + '6vWDO969PvNqNYHIOW5v0m',
        method: 'get',
        success: function (response) {
            console.log(response);
        }
    });
}

/*********** CHECKS TO SEE IF ARTIST IS CORRECT  ************/
function checkGuest() {
    var playerGuess = $('.input_artist').val();
    var newGuess = playerGuess[ 0 ].toUpperCase() + playerGuess.slice(1);

    if (newGuess == artist) {
        console.log('correct');
    }
}


function timer() {
    var minutes = 2;
    var seconds = 60;
    $('.timer').html(minutes + ':' + seconds);

    setTimeout('timer()', 1000);
}

    /*********** FUNCTION FOR CERTAIN CHARACTER MATCHES ************/
    var numb = [ '1', '2', '3', '4', '5', '6' ];

    function mystery() {
        var scooby = $(firstCard).find('.frontimage').attr('src');
        var scooby2 = $(secondCard).find('.frontimage').attr('src');
        for (var x = 0; x < cardImg.length - 2; x++) {
            if (scooby == cardImg[ x ] && scooby2 == cardImg[ x ]) {
                var random = Math.floor(Math.random() * numb.length);
                numb.splice(random, 1);
                $('[datatype=' + random + ']').hide();
            }

        }
    }

    $(document).ready(function () {
        randomizeCards();
        spotifyArtist();
        $('#stats_container').on('click', ".reset", reset);
        $('.input_button').click(function () {
            console.log('button working');
            checkGuest();
        })


    })


/*
 var first_card_clicked = null;
 var second_card_clicked = null;
 var total_possible_matches = 9;
 var match_counter = 0;
 var canClick = true;
 var matches = 0;
 var attempts = 0;
 var accuracy = 0;
 var games_played = 0;

 var can_click = true;
 function card(front, back) {
 var self = this;
 this.front =  front;
 this.back = back;
 $(this.back).click(function(){
 if(can_click){
 self.card_flip();
 }
 });
 this.card_flip = function () {
 can_click = false;
 this.front.addClass('flipcard');
 this.back.addClass('flipcard');
 }
 };

 function memory_match() {
 var self = this;
 this.first_card = null;
 this.second_card = null;
 this.total_match = 9;
 this.
 }

 function stats(){

 }
 //Resets the first and second cards
 function resetCards() {
 first_card_clicked = null;
 second_card_clicked = null;
 };
 // Sets all the stats to reset
 function reset_stats(){
 accuracy = 0;
 matches = 0;
 attempts = 0;
 display_stats();
 };
 // This is for the reset button to display stats and reset everything games_played goes up by 1
 function reset_button(){
 games_played++;
 console.log(games_played);
 reset_stats();
 display_stats();
 $(".card").removeClass('flipcard');
 };
 //functionality for displaying stats
 function display_stats() {
 $('.games_played .value').text(" " + games_played);
 $('.attempts .value').text(" " + attempts);
 accuracy = Math.ceil((match_counter / attempts) * 100);
 if (accuracy == NaN) {
 $('.accuracy .value').text("");
 }
 else if(accuracy == Infinity){
 $('.accuracy .value').text("");
 }
 else {
 $('.accuracy .value').text(accuracy + '%');
 }
 };


 function card_clicked(current) {
 console.log("Can click at start of function", canClick);

 //Starts if function to check if card clicked is null
 if(first_card_clicked == null) {
 first_card_clicked = current; // Makes first_card_clicked equal to which card was clicked
 $(first_card_clicked).find('.card').addClass('flipcard');//Add class to flipcard to make card turn
 current
 }
 else{
 canClick = false;
 console.log("Can click after 2nd card", canClick);
 second_card_clicked = current; // Set second card clicked to what was clicked
 $(second_card_clicked).find('.card').addClass('flipcard'); //Add class to flipcard to make card turn
 attempts++;
 display_stats();
 console.log(attempts);
 if($(first_card_clicked).find('.frontimage').attr('src') == $(second_card_clicked).find('.frontimage').attr('src')) { //This check to see if the image of first card and second card equal each other
 match_counter++; // Makes match counter +1 every time first and second card equal each other
 matches++;
 canClick = true;
 display_stats();
 console.log();
 resetCards(); //nullify first_card_clicked and second_card_clicked
 if (match_counter == total_possible_matches) { //End game when match counter == total_possible_matches
 alert('YOUVE WON')
 }
 else{
 display_stats();
 return;
 }
 }
 else {

 setTimeout(function(){ //This functions makes the card flip back over if cards do not match each other
 $(first_card_clicked).removeClass('flipcard');
 $(second_card_clicked).removeClass('flipcard');
 resetCards();
 display_stats();
 canClick=true;
 }, 2000);

 }


 }

 }

 function shuffle(){
 //The array which all my pictures are stored
 var images = [
 'images/img1.jpg',
 'images/img2.jpg',
 'images/img3.png',
 'images/img4.png',
 'images/img5.jpg',
 'images/img6.jpg',
 'images/img7.jpg',
 'images/img8.jpg',
 'images/img9.jpg',
 'images/img1.jpg',
 'images/img2.jpg',
 'images/img3.png',
 'images/img4.png',
 'images/img5.jpg',
 'images/img6.jpg',
 'images/img7.jpg',
 'images/img8.jpg',
 'images/img9.jpg'
 ];
 var image2 = [];
 var i = 0;
 while ( i < images.length){
 var randomize = Math.floor(Math.random() * images.length);
 image2.push(images.splice(randomize, 1));
 console.log(image2);
 i++;
 }
 for(var j = 0; j < image2.length; j++){
 var cards = $('<img>').html('class="frontimage"' + 'src="' + image2[j] + '">');
 $('.front').append(cards);
 }

 };

 $(document).ready(function() {
 $('.card').click(function(){
 if(canClick){
 card_clicked(this);
 $(this).toggleClass('flipcard');
 }

 });
 $('.reset').click(reset_button);
 shuffle();

 });
 */