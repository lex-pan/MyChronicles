# MyChronicles API

- [MyChronicles API](#mychronicles-api)
  - [Get Url Decipher](#get-url-decipher)
  - [Create Url Decipher](#create-url-decipher)
  - [Update Url Decipher](#update-url-decipher)
  - [Delete Url Decipher](#delete-url-decipher)

## Get Url Decipher

### Get Url Decipher Request

```js
GET /url/{{domain}}
```

### Get Url Decipher Response

```js
200 Ok
```

```json
{
    "Domain": "chapmanganato.to",
    "Title_start_end": [  
        ["Chapter", "start", 1]
    ],
    "Chapter_start_end": [  
        ["Chapter", 1, "end"],
        [" ", "start", 1]
    ],
    "Entertainment_category": [
        "Graphic Novel"
    ],
    "Selection_type": "title",
    "dom_selector": [
        "tag",
        "title",
        0
    ]
}
```

## Create Url Decipher

### Create Url Decipher Request

```js
POST /urls
```

```json
{
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "Vegan Sunshine",
    "description": "Vegan everything! Join us for a healthy breakfast..",
    "startDateTime": "2022-04-08T08:00:00",
    "endDateTime": "2022-04-08T11:00:00",
    "lastModifiedDateTime": "2022-04-06T12:00:00",
    "savory": [
        "Oatmeal",
        "Avocado Toast",
        "Omelette",
        "Salad"
    ],
    "Sweet": [
        "Cookie"
    ]
}
```

### Create Url Decipher Response

```js
201 Created
```

## Update Url Decipher

### Update Url Decipher Request

```js
PUT /urls/{{domain}}
```

```json
{
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "Vegan Sunshine",
    "description": "Vegan everything! Join us for a healthy breakfast..",
    "startDateTime": "2022-04-08T08:00:00",
    "endDateTime": "2022-04-08T11:00:00",
    "lastModifiedDateTime": "2022-04-06T12:00:00",
    "savory": [
        "Oatmeal",
        "Avocado Toast",
        "Omelette",
        "Salad"
    ],
    "Sweet": [
        "Cookie"
    ]
}
```

### Update Breakfast Response

```js
204 No Content
```

or

```js
201 Created
```

## Delete Url Decipher

### Delete Url Decipher Request

```js
DELETE /urls/{{domain}}
```

### Delete Url Decipher Response

```js
204 No Content
```