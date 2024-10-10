- Créer un utilisateur avec un POST à  `/api/user/create` et un json minimal de ce genre :

```json
{
    "email": "francois@42l.fr",
    "firstName": "François",
    "lastName": "Descamps",
    "userName": "fdeĉ",
    "password": "tesT666!!!"
}
```

Le mot de pass doit être 'fort'
quand tu crée un utilisateur, un mail de confirmation est envoyé, tu peux pas te loguer tant que tu as pas confirmé l'email

- Te login avec un POST à `/api/user/login` et un json :

```json
{
    "username": "fdec",
    "password": "tesT666!!!"
}
```

- Te logout avec un GET à `/api/user/logout`
- Récupérer un profile avec un GET à `/api/user/:id` en étant connecté bien sur.
  ça te donnera un json de ce genre :

```json
{
    "id": 1,
    "username": "fdec",
    "firstName": "François",
    "lastName": "Descamps",
    "gender": "Male",
    "sexualPref": "Female",
    "biography": "I'm cool 😎",
    "fameRate": 0,
    "latitude": "2.3514035501",
    "longitude": "48.8658004030",
    "lastConnection": "2024-09-26T13:38:21.000Z",
    "interests": [
        "Walking",
        "Exercising"
    ],
    "pictures": [
        {
            "filename": "bc28a5c7b906825e2a426c1788972ddb49eb6f78",
            "pictureIndex": 2
        },
        {
            "filename": "8e97f92f4649f0025e41875e7b308e8782e45b82",
            "pictureIndex": 1
        },
        {
            "filename": "338b95c7da1057ca585d2ff6f5b4ddd3d0bedd93",
            "pictureIndex": 3
        }
    ],
    "visits": [
        {
            "date": "2024-10-04 12:42:20.000000",
            "visiterId": 1
        },
        {
            "date": "2024-10-04 12:45:48.000000",
            "visiterId": 3
        }
    ]
}
```

Avec des tableaux vides si aucun interest/picture/visits est trouvé

- Supprimer l'utilisateur avec lequel tu es logué avec un DELETE à `/api/user/delete`
- Modifier les infos de l'utilisateur avec lequel tu es logué avec un PATCH à `/api/user/patch` et n'importe quelle combinaisons de ces champs :

```json
{
    "username": "fdec",
    "firstName": "2",
    "lastName": "Desc",
    "gender": "Male",
    "sexualPref": "Female",
    "biography": "I'm cool 😎",
    "latitude": "2.3514035501",
    "longitude": "48.8658004030",
    "interests": [
        "Dancing",
        "Exercising"
    ]
}
```

gender étant parmis "Male", "Female", "Unknown"
sexualPref étant parmis "Male", "Female", "Both"
les interests étant  visibles ici  : https://github.com/smiley16479/cursus42-matcha/blob/8e90b27966f05164a1e13eeac195c02ff5cfe024/back/app/types/user.ts#L17

- Demander un reset mot de pass avec un GET à `/api/user/askresetpassword/:email`
- Uploader une image avec POST à `/api/user/picture/upload` et un form de ce genre :

```html
<body>
  <form action="http://localhost:3000/api/user/picture/upload" method="POST" enctype="multipart/form-data">  

    <label for="picture">Choose Picture:</label>
    <input type="file" name="picture">

    <input type="hidden" name="index" value="1"/>

    <button type="submit">Upload</button>
  </form>
</body>
```

Le champ caché `index` donne l'index de l'image que tu envoies, il doit être > 0 et < 6. Si une image avec cet index pour cet utilisateur existait déja, elle est supprimée

- Supprimer une image avec un DELETE à `/api/user/picture/delete/:pictureId`.
  pictureId étant l'index entre 1 et 5 pour cet utilisateur
- Récupérer une image avec un GET à `/api/user/picture/:imageName`
  Tu peux récupérer le imageName dans le tableau `pictures` d'un utilisateur
- Récupérer une selection de max 20 profils conformes aux préférences de l'utilisateur avec un GET à `/api/match`


## Tests


Le script de tests `populate_db_for_test.py` peut être utilisé pour générer des profils utilisateur aléatoires et les insérer dans la base de donnée. Le nombre de profils a créer est donné en premier paramètre. Si aucun paramètre n'est donné, 500 profils vont être créés par defaut.
