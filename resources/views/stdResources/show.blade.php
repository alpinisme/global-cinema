@extends('layout')

@section('content')
<main class="container">

  <h1 class="title">{{$resource::DISPLAYNAME}}</h1>

  <table> 
    
    <caption>Details</caption>
    
    @foreach ($resource::ALLFIELDS as $dbKey => $Userkey)
        <tr>
            <td>{{$Userkey}}</td>
            <td>{{$resource->$dbKey}}</td>
        </tr>
    @endforeach

  </table>

  <a href="/{{request()->segment(1)}}" class="button secondary-action">Cancel</a>
  <a href="/{{request()->segment(1)}}/{{$resource->id}}/edit" class="button">Edit</a>
  <form action="/{{request()->segment(1)}}/{{$resource->id}}" method="post">
    @csrf @method('DELETE')
    <button type="submit" class="danger tertiary-action">Delete Entry</button>
  </form>

</main>
@endsection