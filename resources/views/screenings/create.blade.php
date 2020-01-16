@extends('layout')

@section('scripts')
<script src="http://laravel-playground.test/js/fetch-film.js" type="text/Javascript" defer></script>
@endsection

@section('content')
<main class="container">
  <h1 class="title">{{$screening::DISPLAYNAME}}</h1>

  <form method="POST" action="/screenings">
    @csrf
    
    <table>
      <tr>
        <td>date</td>
        <td>
          <input 
              type="text" 
              name="date"  
              id="date" 
              class="date-inputs" 
              required 
              pattern="([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"
              autocomplete="off">
        </td>
      </tr>
      <tr>
        <td>theater</td>
        <td>
          <input 
              type="text" 
              name="theater_id" 
              id="theater_id" 
              class="theater-inputs" 
              required
              autocomplete="off">
        </td>
      </tr>
      <tr>
        <td>film</td>
        <td>
          <input 
              type="text" 
              name="film_id"  
              id="film_id" 
              class="film-inputs" 
              required
              autocomplete="off">
        </td>
      </tr>
    </table>

    <a href="/{{request()->segment(1)}}" class="button secondary-action">Cancel</a>
    <input type="submit" value="Submit" class="button submit">

  </form>

</main>
@endsection