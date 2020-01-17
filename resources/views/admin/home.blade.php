@extends('layout')

@section('content')
<main>   
  <h1>Admin</h1>
  <div class="container">
    <a href="/theaters" class="button block cta">theaters</a> <br>
    <a href="/dates" class="button block cta">dates</a> <br>
    <a href="/films" class="button block cta">films</a> <br>
    <a href="/admin" class="button block cta">site users</a>
  </div>
</main>
@endsection