$(document).ready(function() {
  function fadeInAll(callback) {
    title.fadeIn(125, ()=>
        body.fadeIn(125, ()=>
          actions.fadeIn(125, callback)));
  }

  function fadeOutAll(callback) {
    title.fadeOut(250);
    body.fadeOut(250);
    actions.fadeOut(250, callback);
  }


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

  var posts, post, post_count;

  function reload(count) {
    var url = count ? '/api/v1/posts?start_eid=' + count : '/api/v1/posts'
    $.getJSON(url).then((response_data)=> {
      posts = count ? posts : response_data;
      if (post = posts[0]) {
        fadeOutAll(()=> {
          title.html(post.title);
          body.html(post.post);
          actions.html(normal_actions);
          fadeInAll();
        });
      } else {
        fadeInAll();
      }
    });
  }

  setTimeout(function() {
    $('html').fadeIn(500);
    reload();
  }, 500);

  $('#set-up-editor').click(function() {
    if (editing)
      return
    editing = true;
    fadeOutAll(()=> {
      last_title = title.html()
      title.html('<input type="text" placeholder="Title">');
      last_body = body.html()
      body.html('<textarea placeholder="Content" />');
      last_actions = actions.html()
      actions.html('<button class="mdl-button mdl-js-button ' +
        'mdl-js-ripple mdl-button--accent" id="btn-post">Post</button>&nbsp;' +
        '<button class="mdl-button mdl-js-button mdl-js-ripple ' +
        'mdl-button--accent" id="btn-discard">Discard</button>');
      fadeInAll(()=> $('#post-title input').focus());
    });
  });

  $(document).on('click', '#btn-discard', function() {
    editing = false;
    fadeOutAll(()=> {
      title.html(last_title);
      body.html(last_body);
      actions.html(last_actions);
      fadeInAll();
    });
  });

  $(document).on('click', '#btn-post', function() {
    data = {
      title: $('#post-title input').val(),
      post: markdown.toHTML($('#post-body textarea').val()),
    };
    $.post('/api/v1/new', data).then(()=> reload());
  });
});
