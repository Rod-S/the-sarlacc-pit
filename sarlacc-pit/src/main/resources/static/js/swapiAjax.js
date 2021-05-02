$(document).ready(function() {

    let filmData;

    //Receive and process SWAPI data
    $.ajax({
        url: "https://swapi.dev/api/films/"
    }).then(function(data) {
        console.log(data);
        filmData = data;
        $('.header-row').append(loopFilmEntries(data));
    });

    //HTML to render for individual film listing
    const renderFilmEntry = (result) => {
        var html = `<tr class="film">
                     <td class="title">${result.title}</td>
                     <td class="episode">${result.episode_id}</td>
                     <td class="release">${result.release_date}</td>
                    </tr>`;
        return html;
    }

    //loop through each film, render them in page
    const loopFilmEntries = (data) => {
        var html = '';
        for(let i = 0; i <= data.count - 1;  i++) {
            html += renderFilmEntry(data.results[i]);
        }
        html += '';
        return html;
    }

    //single film detailed view
    const renderFilmDetails = (film) => {
        var html = `
           <tr><th class="heading-episode center-align">Episode<td>${film.episode_id}</td></th></tr>
           <tr><th class="heading-description center-align">Opening Description<td>${film.opening_crawl}</td></th></tr>
           <tr><th class="heading-director center-align">Director<td>${film.director}</td></th></tr>
           <tr><th class="heading-producer center-align">Producer<td>${film.producer}</td></th></tr>
           <tr><th class="heading-release center-align">Release Date<td>${film.release_date}</td></th></tr>
<!--           <tr><th class="heading-characters center-align">Characters</th>-->
<!--            <tr class="heading-planets center-align">Planets</tr>-->
<!--            <tr class="heading-starships center-align">Starships</tr>-->
<!--            <tr class="heading-vehicles center-align">Vehicles</tr>-->
<!--            <tr class="heading-species center-align">Species</tr>-->
        `;
        return html;
    }

    //filter method
    const searchFilter = (filmsArr, userSearch) => {
        let filterArr = [];
        for (let i=0; i<filmsArr.length;i++) {
            filterArr.push(filmsArr[i]);
        }
        return filterArr.filter(function(e) {
            for (let i=0; i< e.children.length;i++) {
                if (e.children[i].innerHTML.toLowerCase().indexOf(userSearch) !== -1) {
                    return e.children[i].innerHTML.toLowerCase().indexOf(userSearch) !== -1
                }
            }
        });
    }

    //filter handler
    $('#search').keyup(function () {
        let matchedFilms = searchFilter($('.film'), $('#search').val().toLowerCase());
        $('.film').hide();
        matchedFilms.forEach((e) => $(e).show());
    });

    //sort method/handler    //sort method
    //TODO: Refactor conditional statements without duplicate code
    $('body').on('click', 'th', function (e) {
        let sortArr = [];
        let entry = $('.film');
        for (let i=0; i<entry.length;i++) {
            sortArr.push(entry[i]);
        }
        $('.order-icon').remove();
        if ($(this).hasClass('heading-title')) {
            if ($('.heading-title').hasClass('toggle-on')) {
                $(this)[0].innerHTML = 'Title<span class="order-icon">&#9660;</span>';
                sortArr.sort((a,b) => b.children[0].innerHTML.localeCompare(a.children[0].innerHTML));
                sortArr.forEach((e) => $('.film-table').parent().append(e));
                $('.heading-title').removeClass('toggle-on');
                return
            }
            $('.heading-title').addClass('toggle-on');
            $(this)[0].innerHTML = 'Title<span class="order-icon">&#9650;</span>';
            sortArr.sort((a,b) => a.children[0].innerHTML.localeCompare(b.children[0].innerHTML));
            sortArr.forEach((e) => $('.film-table').parent().append(e));
        }
        else if ($(this).hasClass('heading-episode')) {
            if ($('.heading-episode').hasClass('toggle-on')) {
                $(this)[0].innerHTML = 'Episode<span class="order-icon">&#9660;</span>';
                sortArr.sort((a,b) => b.children[1].innerHTML.localeCompare(a.children[1].innerHTML));
                sortArr.forEach((e) => $('.film-table').parent().append(e));
                $('.heading-episode').removeClass('toggle-on');
                return
            }
            $('.heading-episode').addClass('toggle-on');
            $(this)[0].innerHTML = 'Episode<span class="order-icon">&#9650;</span>';
            sortArr.sort((a,b) => a.children[1].innerHTML.localeCompare(b.children[1].innerHTML));
            sortArr.forEach((e) => $('.film-table').parent().append(e));
        }
        else if ($(this).hasClass('heading-release')) {
            if ($('.heading-release').hasClass('toggle-on')) {
                $(this)[0].innerHTML = 'Release<span class="order-icon">&#9660;</span>';
                sortArr.sort((a,b) => b.children[2].innerHTML.localeCompare(a.children[2].innerHTML));
                sortArr.forEach((e) => $('.film-table').parent().append(e));
                $('.heading-release').removeClass('toggle-on');
                return
            }
            $('.heading-release').addClass('toggle-on');
            $(this)[0].innerHTML = 'Release<span class="order-icon">&#9650;</span>';
            sortArr.sort((a,b) => a.children[2].innerHTML.localeCompare(b.children[2].innerHTML));
            sortArr.forEach((e) => $('.film-table').parent().append(e));
        }
    });

    //OPEN MODAL FILM DETAIL HANDLER
    $('body').on('click', 'td', function (e) {
        let thisFilm = filmData.results.filter(x => x.episode_id == $(this).parent().find('.episode')[0].innerHTML)[0];
        e.preventDefault();
        //check to see if Modal exists before appending to prevent duplication
        if (!$('#myModal').length) {
            $(this).append(`
                <div id="myModal" class="modal">
                    <!-- Modal content -->
                    <div class="modal-content">
                        <div class="modal-header">
                            <span class="close">&times;</span>
                            <h2>${thisFilm.title}</h2>
                        </div>
                        <div class="modal-body">
                              <table class="films-table centered responsive-table highlight">
                               ${renderFilmDetails(thisFilm)}
                        </div>   
                    </div>
                </div>`)
        }
        $('#myModal').show();
    })

    //CLOSE MODAL FILM DETAIL HANDLER
    $(window).on('click', function (e) {
        if (e.target === $('#myModal')[0] || e.target === $('.close')[0]) {
            $('#myModal').remove();
        }
    });

});