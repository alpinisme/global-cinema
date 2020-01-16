@extends('layout')

@section('content')
<main class="container">

  <h1 class="title">{{$resource::DISPLAYNAME}}</h1>

  <table>
    @foreach ($resource::all() as $instance)
        <tr>
          @foreach ($resource::QUICKFIELDS as $field => $value)
              @if ($loop->first)
                  <td><a href="/{{request()->segment(1)}}/{{$instance->id}}">{{$instance->$field}}</a></td>
              @else
                  <td>{{$instance->$field}}</td>
              @endif
          @endforeach
          <td><a href="/{{request()->segment(1)}}/{{$instance->id}}/edit">edit</a></td>
        </tr>
    @endforeach
  </table>

  <a href="/home" class="button secondary-action">Back Home</a>
  <a href="/{{request()->segment(1)}}/create" class="button">Add New</a>

</main>

@endsection