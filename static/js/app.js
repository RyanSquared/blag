$(document).ready(function() {
  setTimeout(function() {
    $('html').fadeIn(500);
  }, 500);

  $('#set-up-editor').click(function() {
    $('#post-title h1').html('<input type="text" placeholder="Title">');
    $('#post-body').html('<textarea placeholder="Content">');
    $('#post-actions').html('<button class="mdl-button mdl-js-button ' +
        'mdl-js-ripple mdl-button--accent" id="btn-post">Post</button>&nbsp;' +
        '<button class="mdl-button mdl-js-button mdl-js-ripple ' +
        'mdl-button--accent" id="btn-discard">Discard</button>');
  });

  $(document).on('click', '#btn-discard', function() {
    $('#post-title h1').html('');
    $('#post-body').html('');
    $('#post-actions').html('');
  });
});
