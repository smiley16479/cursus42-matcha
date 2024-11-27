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
    "success": true,
    "data": {
        "id": 3,
        "userName": "JenniferO1241",
        "firstName": "Jennifer",
        "lastName": "Ouzts",
        "gender": "Female",
        "sexualPref": "Female",
        "age": 77,
        "biography": "Eius ut amet quiquia. Sed dolorem magnam non non. Eius eius porro est consectetur adipisci etincidunt quisquam. Tempora quisquam tempora dolore. Sed magnam dolorem porro quiquia. Neque amet modi quaerat labore.",
        "fameRate": 82,
        "latitude": "43.6768100000",
        "longitude": "4.6303100000",
        "lastConnection": "2023-12-11T07:04:23.000Z",
        "interests": [
            "Skydiving",
            "BoardGames",
            "Skating",
            "Skiing",
            "Collection",
            "Fishing",
            "Languages",
            "Writing",
            "Photography",
            "Knitting",
            "Sewing",
            "Embroidering",
            "Drawing",
            "Painting",
            "Cooking",
            "Cycling"
        ],
        "pictures": [
            {
                "filename": "6e1ccf9340c60796b2a8bbf2551f6f13aa220c2f",
                "pictureIndex": 1
            },
            {
                "filename": "d1ec5e41aac06d737075154f419952f9c1702e29",
                "pictureIndex": 2
            }
        ],
        "isConnected": false
    }
}
```

- Récupérer le profil logué avec un GET à `/api/user/me`. Ce qui donnera :

```json
{
    "success": true,
    "data": {
        "id": 32,
        "email": "francois@42l.fr",
        "emailVerified": 1,
        "userName": "fdesc",
        "firstName": "François",
        "lastName": "Descamps",
        "gender": "Male",
        "sexualPref": "Female",
        "age": 0,
        "biography": "I'm cool 😎",
        "fameRate": 0,
        "latitude": "48.8658004030",
        "longitude": "2.3514035501",
        "lastConnection": "2024-11-27T14:04:30.000Z",
        "profileVisibility": 1,
        "emailNotifications": 0,
        "maxDistance": 50,
        "matchAgeMin": 18,
        "matchAgeMax": 30,
        "interests": [
          "Walking",
          "Dancing"
        ],
        "pictures": [],
        "visits": [
            {
                "date": "2024-11-27 14:04:11.000000",
                "visiterUserId": 10
            }
        ],
        "likes": [
            {
                "date": "2024-11-27 14:05:01.000000",
                "likerUserId": 10
            }
        ],
        "notifications": [
            {
                "date": "2024-11-27 14:04:22.000000",
                "type": "VISIT",
                "isRead": 0,
                "involvedUserId": 10
            }
        ],
        "isConnected": true
    }
}
```

Avec des tableaux vides si aucun interest/picture/visit/like/notification est trouvé

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

### Listes d'utilisateurs

#### Browse

Récupérer une selection profils compatibles avec un POST à `/api/browse` et un json du type :

```json
{
    "requiredGender": "Female",
    "minAge": 0,
    "maxAge": 99,
    "minFameRate": 0,
    "maxFameRate": 100,
    "locationLatitude": 48.865800402991646,
    "locationLongitude": 2.3514035501401054,
    "maxDistance": 200000,
    "interests": [
        "Walking",
        "Dancing"
    ],
    "nbRequiredProfiles": 20,
    "offset": 0,
    "sortingOn": "score",
    "sortingType": "desc"
}
```

- `location` correspond à la position autour de laquelle on va chercher.
- `maxDistance` permet de filtrer les profils en ne gardant que ceux qui sont à moins de `maxDistance` de `position`.
- `interests` permet de filtrer les profils en ne gardant que ceux qui ont ces intérêts.
- `nbRequiredProfiles` limite le nombre max de profiles qui vont être retournés
- `offset` permet de passer les `offset` premiers profiles. `offset` combiné à `nbRequiredProfiles` permet de récupérer des "pages" de prfiles
- `sortingOn` peut être :

  - "fameRate"
  - "distance"
  - "age"
  - "interests"
  - "score"

  et définie en fonction de quel critère les profiles vont être triés.
  `score` étant un mix des critères `distance`, `famerate` et `nbRequiredProfiles`
- `sortingType` peut être "asc" ou "desc" et défini le sens du tri (ascendant ou descendant)

#### Research

Récupérer une selection de profils correspondants a certains critères de recherche avec un POST à `api/research` et un json identique à celui pour `/browse`.

### Services non exposés via les routes (utilisés depuis les sockets)

#### Visite
Ajouter une nouvelle visite via un appel au service `addNewUserVisit(visitedUserId: number, visiterUserId: number)` en donnant en paramètre l'id du profil visité puis l'id du visiteur

#### Like
Ajouter un nouveau like via un appel au service `addNewUserLike(likedUserId: number, likerUserId: number)` en donnant en paramètre l'id du profil liké puis l'id du likeur

Supprimer un like via un appel au service `removeUserLike(likedUserId: number, likerUserId: number)` en donnant en paramètre l'id du profil liké puis l'id du likeur

#### Bloquage
Ajouter un nouveau bloquage via un appel au service `addNewBlock(blockedUserId: number, blockerUserId: number)` en donnant en paramètre l'id du profil bloqué puis l'id du bloquant

Récupérer un bloquage via un appel au service `getUserBlock(blockedUserId: number, blockerUserId: number)` en donnant en paramètre l'id du profil bloqué puis l'id du bloquant

Supprimer un bloquage via un appel au service `removeUserBlock(blockedUserId: number, blockerUserId: number)` en donnant en paramètre l'id du profil bloqué puis l'id du bloquant

#### Signalement
Ajouter un nouveau signalement (report) via un appel au service `addNewReport(reportedUserId: number, reporterUserId: number)` en donnant en paramètre l'id du profil signalé puis l'id du signaleur

#### Notifications

Ajouter une nouvelle notification via un appel au service `addNewNotification(userId: number, involvedUserId: number, type: Notif_t_E)` en donnant en paramètre l'id de l'utilisateur qui reçoit la notification, l'id de l'utilisateur dont l'action a généré la notification et enfin le type de notification (https://github.com/smiley16479/cursus42-matcha/blob/0975c8744ba8c4f506f94db99aef4c577125f1f9/back/src/types/shared_type/notification.ts#L24) 

Marquer une notification comme lue via un appel au service `markNotificationRead(notifId: number)` en donnant en paramètre l'id de la notification

Supprimer une notification via un appel au service `removeNotification(notifId: number)` en donnant en paramètre l'id de la notification

## Erreurs

Les erreurs sont uniformisées sous la forme :

```typescript
{
    success: boolean,
    message?: string,
    data?: any,
    error?: any
}
```

Un code HTTP est toujours renvoyé :

- `200` lorsque tout se passe bien
- `500` si j'ai fait de la merde
- `418` avec le messsage `Token Expired` si le token de vérification d'email ou celui de reset password utilisé a expiré
- `400` avec les messages :
  - `Password Not Strong enough` si une création d'utilisateur ou un changement de mot de pass a été demandé mais que le mot de pass fourni n'est pas suffisament fort
  - `Picture Index Out Of Range` si un upload d'image a été demandé mais que l'index utilisé n'est pas dans le range 0 < index < 6
  - `Error Validating Input` si les données d'entrée ne sont pas conformes a ce qui est attendu
    Avec cette erreur vient un objet dans le champ `error` :
    
    ```json
        "error": [
        {
            "type": "field",
            "value": "scdore",
            "msg": "Sorting on must be one of [fameRate, distance, age, interests, score]",
            "path": "sortingOn",
            "location": "body"
        }
    ]
    ```
    C'est le seule type d'erreur qui retournera un objet dans ce champ error
- `404` avec les messages :
  - `User Not Found` si une action a été demandée sur un utilisateur mais que celui-ci n'as pas été trouvé
  - `Token Not Found` si le token de vérification d'email ou celui de reset password n'as pas été trouvé
  - `Route Not Found` si la route demandée n'existe pas
- `409` avec les messages :
  - `Ressource Already exists` si une création d'élément (like, visite, notification etc) à été demandée mais que celui-ci existe déjà
  - `Username Already Taken` si la création d'un utilisateur a été demandée avec un username déjà pris
- `401` avec les messages :
  - `User Not Logged In` si l'utilisateur n'est pas connecté
  - `Wrong Password` si le mot de pass entré n'est pas reconnu
- `403` avec les messages :
  - `Email Not Verified` si l'utilisateur as bien créé son compte mais n'as pas encore validé son email (alors il n'as pas le droit de se connecter)
  - `No Picture No Like` si l'utilisateur a essayé de liker un profile alors qu'il n'as pas de photo de profil

## Tests

Le script de tests `populate_db_for_test.py` peut être utilisé pour générer des profils utilisateur aléatoires et les insérer dans la base de donnée. Le nombre de profils a créer est donné en premier paramètre. Si aucun paramètre n'est donné, 500 profils vont être créés par defaut.
