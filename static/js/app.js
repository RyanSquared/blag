$(document).ready(function() {
  var title = $('#post-title h1')
    ,body = $('#post-body')
    ,actions = $('#post-actions')
    ,menu = $('#post-menu')
    ,editing = false
    ,normal_actions = $('#post-actions').html()
    ,last_title, last_body, last_actions, base_title, base_body, base_actions;

  function fadeInAll(callback, fade_menu) {
    title.fadeIn(250, ()=>
        body.fadeIn(250, ()=>
          actions.fadeIn(250, function() {
            if (fade_menu) {
              menu.fadeIn(250, callback);
            } else if (callback) {
              callback();
            }
          })));
  }

  function fadeOutAll(callback, fade_menu) {
    title.fadeOut(500);
    body.fadeOut(500);
    actions.fadeOut(500, callback);
    if (fade_menu)
      menu.fadeOut(500);
  }

  title.hide();
  body.hide();
  actions.hide();
  menu.hide();

  base_title = title.html();
  base_body = body.html();
  base_actions = actions.html();

  // load up to 10 posts; then, when one is requested, load up another
  // if the server returns 404 - for instane, if a post is not found, either
  // disable the '#next' / '#prev' or show the initial text

  var posts = [], post, bottom_post;

  function reload(count) {
    editing = false;
    var url = count ? '/api/v1/posts?start_eid=' + count : '/api/v1/posts'
    $.getJSON(url).then((response_data)=> {
      for (index in response_data) {
        posts[response_data[index].eid] = response_data[index];
      }

      var post_index = posts.length;
      while (post_index >= 0 && !posts[post_index])
        post_index--;

      if (post = posts[post_index]) {
        fadeOutAll(()=> {
          title.html(post.title);
          body.html(post.post);
          actions.html(normal_actions);
          fadeInAll(null, true);
        });
      } else {
        fadeOutAll(()=> {
          title.html(base_title);
          body.html(base_body);
          actions.html(base_actions);
          fadeInAll();
        })
      }
    });
  }

  setTimeout(function() {
    info_header = $('#info .mdl-card__title').hide();
    info_element = $('#info .mdl-card__supporting-text').html('').hide();
    $('html').fadeIn(500, ()=> {
      reload();
      $.getJSON('/api/v1/config').then((response)=> {
        data = response.about;
        for (index in data) {
          el = $('<span><b>' + data[index][0] + ':</b> ' + data[index][1] +
            '<br /></span>');
          info_element.append(el);
        }
        info_header.fadeIn(250, ()=> info_element.fadeIn(250));
      });
    });
  }, 500);

  function setUpEditor(setup) {
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
      if (setup)
        setup(); // use this for adding custom content to the textarea
      fadeInAll(()=> $('#post-title input').focus());
    }, true);
  }

  $('#set-up-editor').click(()=> setUpEditor());

  $(document).on('click', '#btn-discard', function() {
    editing = false;
    fadeOutAll(()=> {
      title.html(last_title);
      body.html(last_body);
      actions.html(last_actions);
      fadeInAll(null, true);
    });
  });

  $(document).on('click', '#btn-post', function() {
    var data = {
      title: $('<div />').text($('#post-title input').val()).html(),
      post_source: $('#post-body textarea').val(),
      post: markdown.toHTML($('#post-body textarea').val()),
    };
    $.post('/api/v1/new', data).then(()=> reload());
  });

  $('#delete').on('click', function() {
    $.ajax({
      url: '/api/v1/posts/' + post.eid,
      type: 'DELETE',
      success: (()=> {
        var length = posts.length;
        delete posts[length - 1];
        do {
          if (posts[length]) {
            break;
          }
          delete posts[posts.length];
          length -= 1;
        } while (length >= 0)
        reload();
      }),
    });
  });

  $(document).on('click', '#btn-update', function() {
    var data = {
      title: $('<div />').text($('#post-title input').val()).html(),
      post_source: $('#post-body textarea').val(),
      post: markdown.toHTML($('#post-body textarea').val()),
    };
    $.post('/api/v1/posts/' + post.eid, data).then(()=> reload());
    // TODO make it open edited post
  });

  $('#edit').on('click', ()=> setUpEditor(function() {
    $('#post-title h1 input').val(post.title);
    $('#post-body textarea').val(post.post_source);
    actions.html('<button class="mdl-button mdl-js-button ' +
      'mdl-js-ripple mdl-button--accent" id="btn-update">Update</button>' +
      '&nbsp;<button class="mdl-button mdl-js-button mdl-js-ripple ' +
      'mdl-button--accent" id="btn-discard">Discard</button>');
  }));
});
