@extends('layout')

@section('content')
<main class="container wide">
  <h1 class="title">Screenings</h1>

  <table>

    <thead>
      <th>date</th>
      <th>theater</th>
      <th>film</th>
      <th>created by</th>
      <th>delete</th>
    </thead>

    @foreach ($screenings as $screening)
    <tr>
      <td><a href="/screenings/{{$screening->id}}">{{$screening->date}}</a></td>
      <td>{{$screening->theater->name}}</td>
      <td>{{$screening->film->title}}</td>
      <td>{{$screening->createdBy->name}}</td>
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