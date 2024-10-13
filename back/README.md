### Utilisateurs

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
    "id": 2,
    "userName": "AliceR1701",
    "firstName": "Alice",
    "lastName": "Reilly",
    "gender": "Unknown",
    "sexualPref": "Female",
    "age": 0,
    "biography": "Ipsum modi consectetur aliquam quiquia neque. Eius adipisci non quaerat tempora velit aliquam aliquam. Adipisci porro velit velit dolor etincidunt adipisci. Etincidunt neque etincidunt dolor voluptatem aliquam. Aliquam porro neque eius. Modi porro quisquam numquam dolorem. Labore quaerat tempora tempora neque sit. Neque dolore voluptatem numquam est.",
    "fameRate": 0,
    "latitude": "48.8666700000",
    "longitude": "2.0833300000",
    "lastConnection": "2024-10-10T15:48:59.000Z",
    "interests": [
        "Writing",
        "Photography",
        "Writing",
        "Traveling",
        "Writing",
        "Cycling",
        "Embroidering"
    ],
    "pictures": [
        {
            "filename": "4d77ac2ba493641c7ca8fb55d42d3a794091e2b3",
            "pictureIndex": 1
        },
        {
            "filename": "bdf878d5a4689f58c9d208ea5a29103e27e537e7",
            "pictureIndex": 2
        }
    ]
}
```

- Récupérer le profil logué avec un GET à `/api/user/me`. Ce qui donnera :

```json
{
    "id": 5,
    "email": "francois@42l.fr",
    "emailVerified": 1,
    "userName": "fdeĉ",
    "firstName": "François",
    "lastName": "Descamps",
    "gender": "Male",
    "sexualPref": "Female",
    "age": 0,
    "biography": "I'm cool 😎",
    "fameRate": 0,
    "latitude": "2.3514035501",
    "longitude": "48.8658004030",
    "lastConnection": "2024-10-10T15:49:02.000Z",
    "profileVisibility": 1,
    "emailNotifications": 0,
    "maxDistance": 50,
    "matchAgeMin": 18,
    "matchAgeMax": 30,
    "interests": [
        "Writing",
        "Photography",
        "Writing",
        "Traveling",
        "Writing",
        "Cycling",
        "Embroidering"
    ],
    "pictures": [
        {
            "filename": "4d77ac2ba493641c7ca8fb55d42d3a794091e2b3",
            "pictureIndex": 1
        },
        {
            "filename": "bdf878d5a4689f58c9d208ea5a29103e27e537e7",
            "pictureIndex": 2
        }
    ],
    "visits": [
        {
            "date": "2024-10-13 17:03:27.000000",
            "visiterId": 3
        },
        {
            "date": "2024-10-13 17:03:36.000000",
            "visiterId": 7
        }
    ],
    "likes": [
        {
            "date": "2024-10-13 17:07:34.000000",
            "likerId": 7
        }
    ]
}
```

Avec des tableaux vides si aucun interest/picture est trouvé

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

### Images

- Uploader une image avec un POST à `/api/user/picture/upload` et un form de ce genre :

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
