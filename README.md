# Welsh Synonyms

Learn new words in Welsh and practice your vocabulary.
You will be shown randoms word.
Your task is to provide their synonyms, i.e. different words with the same meaning.
The words are divided into four Welsh language levels. Please use the slider to change the level.
There are two game modes: practice and test. Please use the radio buttons to change the mode.
Click on HINT to see synonym suggestions from the Welsh WordNet.
Click on TRANSLATE to access an English translation.
Click on SUBMIT to submit your answers.
Click on NEXT to move onto the next round.
Click on EXIT to end the game session.

## Application

The application is written using MEAN stack (http://meanjs.org/)

Demo is accessible on https://datainnovation.cardiff.ac.uk/welshsynonyms/

## Set Up

The following will install the npm packages according to the configuration:
#### `npm install`

## Development server/Run the application locally

Run `npm start` for a dev frontend server and `node server.js` for backend server from separate consoles.
Navigate to `http://localhost:4202/`.
The app will automatically reload if you change any of the source files.

## Build

The following will build the production version of the applicaion:
#### `npm run build`
The following will run the production version of the application:
#### `node server.js`

## Mongodb connection

MongoDB is used to store and access the Welsh WordNet.

There are two mongodb databases used, both are provided in `mongodb` folder, and should be initiliased before the application is running.

`wordNetWelsh` database contains the Welsh WordNet.

`welshWordsLists` database contains lists of Welsh Words for the game.

You can initialise those databases using the following commands:
```
mongorestore --db wordNetWelsh <path_to_wordNetWelsh_BSON>
mongorestore --db welshWordsLists <path_to_welshWordsLists_BSON>
```

## Environment Variables

To make use of the mongoDB connection, you need to provide mongoDB user settings in `.env` file in the source directory.

The variables required:

- `WORDNET_USER`: Name of a user with access to `wordNetWelsh` database.
- `WORDNET_PASSWORD`: Password of a user with access to `wordNetWelsh` database.
- `WELSHWORDSLISTS_USER`: Name of a user with access to `welshWordsLists` database.
- `WELSHWORDSLISTS_PASSWORD`: Password of a user with access to `welshWordsLists` database.

## Authors

- Maxim Filimonov
- Irena Spasić

## Contact Information

If you have any questions, feel free to contact the authors on GitHub