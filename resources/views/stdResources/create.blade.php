@extends('layout')

@section('content')
<main class="container">

  <h1 class="title">{{$resource::DISPLAYNAME}}</h1>

  <form action="/{{request()->segment(1)}}/" method="POST" autocomplete="off">
    @csrf

    <table>

      <caption>Add New</caption>
      @foreach ($resource::ALLFIELDS as $dbKey => $userKey)
        <tr>
          <td>{{$userKey}}</td>  
          <td>
            <input 
                type="text"
                name="{{$dbKey}}" 
                value="{{old($dbKey)}}"
                autocomplete="off"
                @if($errors->has($dbKey)) class="invalid" @endif >
          </td>
        </tr>
      @endforeach

    </table>

    @if ($errors->any())
      <div class="errors">
        <ul>
        @foreach ($errors->all() as $error)
            <li>{{$error}}</li>
        @endforeach
        </ul>
      </div>
    @endif 

    <a href="/{{request()->segment(1)}}" class="button secondary-action">Cancel</a>
    <input type="submit" value="Submit" class="button submit">

  </form>
</main>
@endsection