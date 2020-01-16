<!DOCTYPE html>
<html lang="en">

<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="author" content="Matthew Nelson">
<meta name="description"
  content="Indian Cinema in Context aims to provide tools for a new global model of film history from the edges.">
<meta name="twitter:title" content="Indian Cinema in Context: People">
<meta property="og:description"
  content="Indian Cinema in Context aims to provide tools for a new global model of film history from the edges.">
<meta property="og:title" content="Indian Cinema in Context: People">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@yield('title', 'ICIC')</title>
<link href="{{ asset('css/app.css') }}" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lato:300,300b,300i" rel="stylesheet">
@yield('scripts')
</head>

<body>
  <div class="nav">

    <div class="user-links">
      @can('see admin tools')
        <a class="admin-link" href="/home" class="admin-link">admin home</a>
      @endcan
      @guest
        <a href="/login" class="user-link">login</a>
      @endguest
      @auth
        <a href="/logout" class="user-link">logout</a>
      @endauth
    </div>

    <ul class="nav-links">
      <li><a href="/us" @ifPageIs('us', 'class="active"')>people</a></li>
      <li><a href="/projects" @ifPageIs('projects', 'class="active"')>projects</a></li>
      <li><a href="/home" @ifPageIs('home', 'class="active"')>home</a></li>
    </ul>

  </div>

    @yield('content', '...just some boilerplate')

  <footer>
    <p>project funded by <a href="http://ncsa.illinois.edu">NCSA</a> at the <a href="http://www.illinois.edu">University of Illinois</a></p>
  </footer>
</body>

</html>