@extends('layout')

@section('content')
<main>
    <h1>Users</h1>
    <table>
        @foreach($users as $user)
        <tr>
            <form method="POST" action="/admin/user/{{ $user->id }}">
            @csrf
            <td>{{$user->name}}</td>
            <td>
                <select name="role">
                    @foreach (\App\User::ROLES as $role)
                    <option value="{{$role}}" {{ $user->hasRole($role) ? "selected=true" : '' }}>
                        {{$role}}
                    </option>
                    @endforeach
                </select>
                </td>
                <td>
                    <input class="button" type="submit" value="save">
                </td>                  
            </form>
        </tr>  
        @endforeach
    </table>
</main>
@endsection