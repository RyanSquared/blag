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

  var toast = document.querySelector('#login-toast')
    ,toast_message = toast.querySelector('.mdl-snackbar__text').innerHTML

  function showToast() {
    // can't use jQuery with MaterialSnackbar
    toast.MaterialSnackbar.showSnackbar({
      message: toast_message
    });
  }

  function checkIfPass(callback) {
    if ($('#password').val() != '') {
      if (callback)
        callback();
    } else {
      showToast();
    }
  }

  title.hide();
  body.hide();
  actions.hide();
  menu.hide();

  base_title = title.html();
  base_body = body.html();
  base_actions = actions.html();

  var posts = [], post;

  function showPost(eid) {
    // pass an EID to be "shifted down" to find a post
    // you can also pass the direct EID for a post
    var post_index = eid ? eid : posts.length;
    var old_post = post;
    while (post_index >= 0 && !posts[post_index])
      post_index--;

    if (post && post_index == post.eid)
      return;

    if (post = posts[post_index])
      fadeOutAll(()=> {
        title.html(post.title);
        body.html(post.post);
        actions.html(normal_actions);
        fadeInAll(null, true);
      });
    else if (old_post)
      post = old_post;
    else
      fadeOutAll(()=> {
        title.html(base_title);
        body.html(base_body);
        actions.html(base_actions);
        fadeInAll();
      });
  }

  function reload(start, direction) {
    editing = false;
    var url = start ? '/api/v1/posts' + (direction ? '/reverse' : '') +
      '?start_eid=' + start : '/api/v1/posts';
    return $.getJSON(url).then((response_data)=> {
      for (index in response_data) {
        posts[response_data[index].eid] = response_data[index];
      }
    });
  }

  setTimeout(function() {
    info_header = $('#info .mdl-card__title').hide();
    info_element = $('#info .mdl-card__supporting-text').html('').hide();
    $('html').fadeIn(500, ()=> {
      reload().then(()=> showPost());
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

  $(document).on('click', '#btn-post', ()=> checkIfPass(function() {
    var data = {
      title: $('<div />').text($('#post-title input').val()).html(),
      post_source: $('#post-body textarea').val(),
      post: markdown.toHTML($('#post-body textarea').val()),
    };
    $.ajax('/api/v1/new', {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + btoa($('#password').val())
      },
      data: data,
    }).then(()=> reload().then(()=> showPost()));
  }));

  $('#delete').on('click', ()=> checkIfPass(function() {
    $.ajax({
      url: '/api/v1/posts/' + post.eid,
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa($('#password').val())
      },
      success: (()=> {
        var eid = post.eid;
        delete posts[eid];
        showPost(eid - 1);
      }),
      error: ((data)=> {
        if (data.status == 401)
          toast.MaterialSnackbar.showSnackbar({
            message: "Invalid password!"
          })
      }),
    });
  }));

  $(document).on('click', '#btn-update', ()=> checkIfPass(function() {
    var data = {
      title: $('<div />').text($('#post-title input').val()).html(),
      post_source: $('#post-body textarea').val(),
      post: markdown.toHTML($('#post-body textarea').val()),
    };
    $.ajax('/api/v1/posts/' + post.eid, {
      method: "POST",
      headers: {
        'Authorization': 'Basic ' + btoa($('#password').val())
      },
      data: data,
    }).then(()=> reload(post.eid).then(()=> showPost(post.eid)));
  }));

  $('#edit').on('click', ()=> setUpEditor(function() {
    $('#post-title h1 input').val(post.title);
    $('#post-body textarea').val(post.post_source);
    actions.html('<button class="mdl-button mdl-js-button ' +
      'mdl-js-ripple mdl-button--accent" id="btn-update">Update</button>' +
      '&nbsp;<button class="mdl-button mdl-js-button mdl-js-ripple ' +
      'mdl-button--accent" id="btn-discard">Discard</button>');
  }));

  $(document).on('click', '#old', function() {
    // check how many are left in buffer
    var count = 0;
    var older_post = undefined;
    for (var current = post.eid - 1; current > 0; current--) {
      if (posts[current]) {
        if (!older_post)
          older_post = posts[current];
        count++;
      }
    }
    if (count == 0)
      reload(post.eid).then(()=> showPost(post.eid - 1));
    else if (count < 2)
      reload(post.eid).then(()=> showPost(older_post.eid));
    else if (older_post)
      showPost(older_post.eid);
  });

  $(document).on('click', '#new', function() {
    var count = 0;
    var newer_post = undefined;
    for (var current = post.eid + 1; current < posts.length; current++)
      if (posts[current]) {
        if (!newer_post)
          newer_post = posts[current];
        count++;
      }
    if (count < 2)
      reload(post.eid + 1, true).then(function() {
        if (newer_post) {
          return showPost(newer_post.eid);
        }
        // iterate up to find post
        var current; // will use later
        for (current = post.eid + 1; current < posts.length; current++)
          if (posts[current])
            break;
        if (!posts[current])
          return;
        showPost(posts[current].eid);
      });
    else {
      // iterate up to find post
      var current; // will use later
      for (current = post.eid + 1; current < posts.length; current++)
        if (posts[current])
          break;
      if (!posts[current])
        return;
      showPost(posts[current].eid);
    }
  });
});
