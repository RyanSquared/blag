$(document).ready(function() {
  setTimeout(function() {
    $('html').fadeIn(500);
  }, 500);

  var title = $('#post-title h1')
    ,body = $('#post-body')
    ,actions = $('#post-actions')
    ,editing = false
    ,last_title, last_body, last_actions;

  title.hide();
  body.hide();
  actions.hide();

  // load up to 10 posts; then, when one is requested, load up another
  // if the server returns 404 - for instane, if a post is not found, either
  // disable the '#next' / '#prev' or show the initial text

  var posts, post;

  window.posts = $.getJSON("/api/v1/posts").then((response_data)=> {
    posts = response_data;
    if (post = posts[0]) {
      title.fadeOut(125);
      title.html(post.title);
      body.html('');
      for (index in post.post) {
        body.append('<p>' + post.post[index] + '<p>');
      }
      title.fadeIn(250);
      body.fadeIn(250);
      actions.fadeIn(250);
    } else {
      title.fadeIn(500);
      body.fadeIn(500);
      actions.fadeIn(500);
    }
  });

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
});
