@extends('layout')

@section('content')

<main>
  @auth<input type="hidden" id="role" value="{{auth()->user()->role}}" />@endauth
  <div id="root"></div>
</main>

<script src="/js/app.js"></script>
@endsection