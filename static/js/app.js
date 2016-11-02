$(document).ready(function() {
  setTimeout(function() {
    $('html').fadeIn(500);
  }, 500);

  var title = $('#post-title h1')
    ,body = $('#post-body')
    ,actions = $('#post-actions')
    ,editing = false
    ,normal_actions = $('#post-actions').html()
    ,last_title, last_body, last_actions;

  title.hide();
  body.hide();
  actions.hide();

  // load up to 10 posts; then, when one is requested, load up another
  // if the server returns 404 - for instane, if a post is not found, either
  // disable the '#next' / '#prev' or show the initial text

  var posts, post;

  function reload() {
    $.getJSON("/api/v1/posts").then((response_data)=> {
      posts = response_data;
      if (post = posts[0]) {
        title.fadeOut(125, ()=> title.html(post.title).fadeIn(125));
        body.fadeOut(125, ()=> body.html(post.post).fadeIn(125));
        actions.fadeOut(125, ()=> actions.html(normal_actions).fadeIn(125));
      } else {
        title.fadeIn(250);
        body.fadeIn(250);
        actions.fadeIn(250);
      }
    });
  }

  reload();

  $('#set-up-editor').click(function() {
    if (editing)
      return
    editing = true;
    title.fadeOut(125, ()=> {
      last_title = title.html()
      title.html('<input type="text" placeholder="Title">');
    }).fadeIn(125, ()=> $('#post-title input').focus());
    body.fadeOut(125, ()=> {
      last_body = body.html()
      body.html('<textarea placeholder="Content" />');
    }).fadeIn(125);
    actions.fadeOut(125, ()=> {
      last_actions = actions.html()
      actions.html('<button class="mdl-button mdl-js-button ' +
        'mdl-js-ripple mdl-button--accent" id="btn-post">Post</button>&nbsp;' +
        '<button class="mdl-button mdl-js-button mdl-js-ripple ' +
        'mdl-button--accent" id="btn-discard">Discard</button>');
    }).fadeIn(125);
  });

  $(document).on('click', '#btn-discard', function() {
    editing = false;
    title.fadeOut(125, ()=> title.html(last_title)).fadeIn(250);
    body.fadeOut(125, ()=> body.html(last_body)).fadeIn(250);
    actions.fadeOut(125, ()=> actions.html(last_actions)).fadeIn(250);
  });

  $(document).on('click', '#btn-post', function() {
    data = {
      title: $('#post-title input').val(),
      post: markdown.toHTML($('#post-body textarea').val()),
    };
    $.post('/api/v1/new', data).then(reload);
  });
});
