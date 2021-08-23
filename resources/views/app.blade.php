<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="author" content="Matthew Nelson">
  <meta name="description" content="{{ config('app.name') }}">
  <meta name="twitter:title" content="{{ config('app.name') }}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ config('app.name') }}</title>
  <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
  <link rel="stylesheet" href="{{ asset('css/map.css') }}" />
  <link href="https://fonts.googleapis.com/css?family=Lato:300,300b,300i" rel="stylesheet">
  <script src="/js/app.js" defer></script>
</head>

<body>
  <main>
    <noscript>Please enable JavaScript to run this application</noscript>
    <div id="root"></div>
    <div id="modal-root"></div>
  </main>
</body>

</html>