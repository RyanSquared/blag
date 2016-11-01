$(document).ready(function() {
  setTimeout(function() {
    $('#post-title h1').hide();
    $('#post-body').hide();
    $('#post-actions').hide();
    $('html').fadeIn(250);
  }, 250);

  $('#set-up-editor').click(function() {
    $('#post-title h1')
      .html('<input type="text" placeholder="Title">')
      .fadeIn(250);
    $('#post-body')
      .html('<textarea placeholder="Content">')
      .fadeIn(250);
    $('#post-actions')
      .html('<button class="mdl-button mdl-js-button ' +
        'mdl-js-ripple mdl-button--accent" id="btn-post">Post</button>&nbsp;' +
        '<button class="mdl-button mdl-js-button mdl-js-ripple ' +
        'mdl-button--accent" id="btn-discard">Discard</button>')
      .fadeIn(250);
  });

  $(document).on('click', '#btn-discard', function() {
    $('#post-title h1').fadeOut(250);
    $('#post-body').fadeOut(250);
    $('#post-actions').fadeOut(250);
  });
});
