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
        ["Chapter", "start", "1"]
    ],
    "Chapter_start_end": [  
        ["Chapter", "1", "end"],
        [" ", "start", "1"]
    ],
    "Entertainment_category": [
        ["Graphic Novel"]
    ],
    "Selection_type": "title",
    "dom_selector": [
        "tag",
        "title",
        "0"
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
    "Domain": "chapmanganato.to",
    "Title_start_end": [  
        ["Chapter", "start", "1"]
    ],
    "Chapter_start_end": [  
        ["Chapter", "1", "end"],
        [" ", "start", "1"]
    ],
    "Entertainment_category": [
        ["Graphic Novel"]
    ],
    "Selection_type": "title",
    "dom_selector": [
        "tag",
        "title",
        "0"
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
    "Domain": "chapmanganato.to",
    "Title_start_end": [  
        ["Chapter", "start", "1"]
    ],
    "Chapter_start_end": [  
        ["Chapter", "1", "end"],
        [" ", "start", "1"]
    ],
    "Entertainment_category": [
        ["Graphic Novel"]
    ],
    "Selection_type": "title",
    "dom_selector": [
        "tag",
        "title",
        "0"
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