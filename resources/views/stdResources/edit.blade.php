@extends('layout')

@section('content')
<main class="container">

  <h1 class="title">{{$resource::DISPLAYNAME}}</h1>

  <form action="/{{request()->segment(1)}}/{{$resource->id}}" method="POST" autocomplete="off">
    @method('PATCH')
    @csrf

    <table> 
      <caption>Edit</caption>
      @foreach ($resource::ALLFIELDS as $dbKey => $Userkey)
          <tr>
              <td>{{$Userkey}}</td>
              <td>
                <input 
                  type="text" 
                  name="{{$dbKey}}" 
                  value="{{old($dbKey, $resource->$dbKey)}}"
                  autocomplete="off"
                  @if($errors->has($dbKey)) class="invalid" @endif>
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
    <input type="submit" class="button" value="Submit">

  </form>

  <form action="/{{request()->segment(1)}}/{{$resource->id}}" method="post">
    @csrf @method('DELETE')
    <button type="submit" class="tertiary-action danger">Delete Entry</button>
  </form>

</main>
@endsection