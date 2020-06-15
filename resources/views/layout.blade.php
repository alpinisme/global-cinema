<!DOCTYPE html>
<html lang="en">

<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="author" content="Matthew Nelson">
<meta name="description" content="CWL 207 data upload portal">
<meta name="twitter:title" content="CWL 207 data upload portal">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@yield('title', 'CWL 207')</title>
<link href="{{ asset('css/app.css') }}" rel="stylesheet">
<link href="{{ asset('css/styles.css') }}" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Lato:300,300b,300i" rel="stylesheet">
@yield('scripts')
</head>

<body>
  <nav class="nav">

    <div class="user-links">
      @can('see admin tools')
      <a class="admin-link" href="/" class="admin-link">admin home</a>
      @endcan

      @guest
      <a href="/login" class="user-link">login</a>
      @endguest

      @auth
      <a href="/logout" class="user-link">logout</a>
      @endauth
    </div>

  </nav>

  @yield('content', '...just some boilerplate')

  <footer>
    <p>project funded by <a href="http://ncsa.illinois.edu">NCSA</a> at the <a href="http://www.illinois.edu">University
        of Illinois</a></p>
  </footer>
</body>

</html>