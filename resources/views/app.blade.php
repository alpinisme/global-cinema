@extends('layout')

@section('content')

<main>
  <input type="hidden" id="role" value="{{auth()->user()->role}}" />
  <div id="root"></div>
</main>

<script src="/js/app.js"></script>
@endsection