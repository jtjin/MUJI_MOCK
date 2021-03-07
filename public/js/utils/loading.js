$( window ).on( 'load', function() {
  window.setTimeout( function() {
    $( '.loadChart' ).removeClass( 'chartLoading' ).addClass( 'chartLoaded' );
  }, 8000 );
} );

$( window ).on( 'load', function() {
  window.setTimeout( function() {
    $( '.loadContent' ).removeClass( 'chartLoading' ).addClass( 'chartLoaded' );
  }, 1500 );
} );

