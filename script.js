 var firstCard = null;
    var secondCard = null;
    var matchCounter = 0;
    var canClick = true;
    var attempts = 0;
    var accuracy = 0;
    var gamesPlayed = 0;
    var artist = ['beyonce', 'katy perry', 'taylor swift', 'justin bieber', 'adele', 'britney spears'];
    var cardImg = [
        'image/scooby.jpg',
        'image/shaggy.jpg',
        'image/velma.jpg',
        'image/fred.jpg',
        'image/scrappy.jpg',
        'image/daphne.jpg',
        'image/ghost.jpg',
        'image/pirate.jpg',
        'image/clue.jpg'
    ];
    var track;

    /*********** SETS CARDS CLICKED ***********/
    function cardClick(card) {
        if($(card).hasClass('flipcard')){
            return
        }
        $(card).find('.card').addClass('flipcard');
        if (firstCard === null) {
            firstCard = card;
        }
        else {
            secondCard = card;
            canClick = false;
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
        matchCounter = 0;
    }

    /*********** RESETS THE WHOLE GAME ************/
    function reset() {
        $('#game_area').html('');
        resetStats();
        displayStats();
        resetCard();
        randomizeCards();
        clearInterval(winCondition);
        $('.card').removeClass('flipcard');
        $('.mysterySolved').css('display', 'none');
        $('.theme')[0].pause();
        $('.question').show();
        spotifyArtist();


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
            $('.accuracy .value').text('0%');
        }
    }

    /*********** CHECKS FOR CARD MATCH  ************/
    function cardMatch() {
        if ($(firstCard).find('.frontimage').attr('src') == $(secondCard).find('.frontimage').attr('src')) {
            matchCounter++;
            attempts++;
            $(firstCard).fadeOut(3000);
            $(secondCard).fadeOut(3000);
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
                $('.cardSound')[0].play();
            }
        });
    }


    /*********** API CALL TO SPOTIFY FOR ARTIST  ************/
    function spotifyArtist() {
        var randomArtist = Math.floor(Math.random() * artist.length);
        mysteryArtist = artist[randomArtist];
        $.ajax({
            dataType: 'json',
            url: "https://api.spotify.com/v1/search?q=" + artist[randomArtist] + "&type=artist",
            method: 'get',
            success: function (response) {
                console.log(response);
                var artistId = response.artists.items[0].id;
                var mysteryArtist = response.artists.items[ 0 ].images[ 1 ].url;
                var addArtist = $('<img>').attr('src', mysteryArtist).css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    height: '94%',
                    width: '100%',
                    zIndex: '0'
                });
                $('.mystery_artist').append(addArtist);
                getTrack(artistId);
            },
            error: function (response) {
                console.log('We didn\'t get a response');
            }
        });
    }
 /*********** API CALL TO SPOTIFY FOR TOP SONG  ************/
 function getTrack(artistId){
        $.ajax({
            dataType: 'json',
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US',
            method: 'get',
            success: function (response) {
                var titleSong = response.tracks[0].preview_url;
                track = titleSong;

            }
        });

    }

    /*********** CHECKS TO SEE IF ARTIST IS CORRECT  ************/

    function checkGuest() {
        var playerGuess = $('.input_artist').val();

        if (playerGuess == mysteryArtist) {
                 winCondition =  setInterval(function(){
                    $('.mysterySolved').fadeOut(500);
                    $('.mysterySolved').fadeIn(500);
                }, 1000);
                for(var x = 0; x < numb.length; x++){
                    $('[datatype=' + numb[ x ] + ']').fadeOut(2000);
                    $('.theme')[0].play();
                }
            }

        canClick = false;
        $('.input_artist').val('');
    }


    /*********** FUNCTION FOR SPECIAL CHARACTER MATCHES ************/
    var numb = [ '1', '2', '3', '4', '5', '6' ];

    function mystery() {

        var scooby = $(firstCard).find('.frontimage').attr('src');
        var scooby2 = $(secondCard).find('.frontimage').attr('src');
        for (var x = 0; x < cardImg.length - 3; x++) {
            if (scooby == cardImg[ x ] && scooby2 == cardImg[ x ]) {
                var random = Math.floor(Math.random() * (numb.length - 1));
                $('[datatype=' + numb[ random ] + ']').fadeOut(2000);
                numb.splice(random, 1);
                return;
            }

        }
        if(scooby == 'image/ghost.jpg'  && scooby2 == 'image/ghost.jpg'){
            setTimeout(function() {
                $('#game_area').html('');
                randomizeCards();
                $('.question').show();
                spotifyArtist();
                reset();
            }, 1500);
        }
            else if(scooby == 'image/pirate.jpg' && scooby2 == 'image/pirate.jpg'){
            setTimeout(function() {
                $('#game_area').html('');
                randomizeCards();
                $('.question').show();
                spotifyArtist();
                reset();
            }, 1500);
        }
        else if(scooby == 'image/clue.jpg' && scooby2 == 'image/clue.jpg'){
                $('.theme')[0].pause();
                var audio = $('<audio>').attr('autoplay', true).addClass('vol');
                var source = $('<source>').attr('src', track);
                var music = $(audio).append(source);
                $('.main_container').append(music);
                $('.vol')[0].volume = 0.1;
            setTimeout(function(){
                $('.vol')[0].pause();
            }, 10000);
        }


    }

    $(document).ready(function () {
        randomizeCards();
        spotifyArtist();
        $('#stats_container').on('click', ".reset", reset);
        $('.input_button').click(function () {
            checkGuest();
        })


    })
