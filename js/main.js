$(document).ready(function(){

    var _url = "https://my-json-server.typicode.com/muttaqinrizal/apipwa/movies"

    var dataResult = ''
    var genreResult = ''
    var genres = []

    function renderPage(data){
        $.each(data, function(key, items){

            _gen = items.genre

            dataResult += "<div>"
                            +"<h3>" + items.name + "</h3>"
                            +"<h4>" + _gen + "</h4>"
                        "</div>";
            
            if ($.inArray(_gen, genres) == -1) {
                genres.push(items.genre)
                genreResult += "<option value'"+_gen+"'>" + _gen + "</option>"
            }
        })

        $('#movies').html(dataResult)
        $('#genre_select').html("<option value='all'>semua</option>" + genreResult)
    }        

var networkDataReceived = false
///fresh data dari server
var networkUpdate = fetch(_url).then(function(response){
    return response.json()
}).then(function(data){
    networkDataReceived = true
    renderPage(data)
})

//return data from cache
caches.match(_url).then(function(response){
    if (!response) throw Error('tidak ada data dicache')
        return response.json()
    }).then(function(data){
        if (!networkDataReceived) {
            renderPage(data)
            console.log('render data dari cache')
        }
    }).catch(function(){
        return networkUpdate
    })

    //fungsi untuk filter

    $("#genre_select").on('change', function(){
        updateMovie($(this).val())
    })

    function updateMovie(gen){
        var dataResult =''
        var _newUrl = _url


        if(gen != 'all'){
            _newUrl = _url + "?genre=" + gen
        }

        $.get(_newUrl, function (data) {
            $.each(data, function(key, items){
    
                _gen = items.genre
    
                dataResult += "<div>"
                                +"<h3>" + items.name + "</h3>"
                                +"<h4>" + _gen + "</h4>"
                            "</div>";
                
            })
    
            $('#movies').html(dataResult)
        })
    }
})
//end jquery


//start SW
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

