#!/bin/bash

# check for needed commands, notify and exit if any unavailable
for COMMAND in php npm composer
do
    if ! command -v $COMMAND &> /dev/null
    then
        echo "** $COMMAND required but not found"
        COMMAND_MISSING=1
    fi
done

if [[ $COMMAND_MISSING -eq 1 ]]
then 
    echo "Please install missing dependencies listed above"
    exit 2
fi

echo "- Creating .env file from .env.example"
cp .env.example .env 

echo "- Creating sqlite file for development"
touch database/database.sqlite

echo "- Installing composer dependencies"
composer install -q || exit 1

echo "- Generating app key"
php artisan key:generate -q

echo "- Running database migrations"
php artisan migrate -q || exit 1

echo "- Installing npm dependencies"
npm install --quiet 1> /dev/null || exit 1

echo "- Building dev bundle with webpack"
npm run dev ?> /dev/null

echo "\nProject built. Run `php artisan serve` to start a dev server"
