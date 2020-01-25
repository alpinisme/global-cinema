@extends('layout')

@section('content')
<main class="container wide">
  <h1 class="title">{{$screening::DISPLAYNAME}}</h1>

  <table>
    <thead>
      <th>date</th>
      <th>theater</th>
      <th>film</th>
      <th>delete</th>
    </thead>
    @foreach (auth()->user()->screenings as $screening)
        <tr>
          <td><a href="/screenings/{{$screening->id}}">{{$screening->date}}</a></td>
          <td>{{$screening->theater->name}}</td>
          <td>{{$screening->film->title}}</td>
          <td>
            <form method="POST" action="/screenings/{{$screening->id}}">
              @csrf @method('DELETE')
              <input type="submit" value="delete" class="button danger tertiary-action">
            </form>
          </td>
        </tr>
    @endforeach
  </table>

  <a href="/home" class="button secondary-action">Back Home</a>
  <a href="/screenings/create" class="button">Add New</a>
</main>
@endsection