# Animals API

Simple backend application with basic operation to add, find all or single animals to the database.


## Authors

- [@adam-devpl](https://github.com/Adam-DevPL)


## Tech Stack

- NestJS
- Docker
- MongoDB
- Redis
- Swagger


## Documentation

Documentation is made in Swagger. After cloning the project you can run it with /api


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SERVER_PORT=3000`

`MONGO_HOST=animals-mongo-db`

`MONGO_PORT=27017`

`MONGO_DATABASE=animals`

`MONGO_USERNAME=`

`MONGO_PASSWORD=`

`MONGO_EXPRESS_PORT=8081`

`REDIS_HOST=redis-cache`

`REDIS_PORT=6379`

`TITLE=Animals API`

`DESC=The animals API connected with AWS deploy`

`VERSION=1.0`

`TAG=animals`

`ENDPOINT=api`


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## API Reference

#### Get all animals

```http
  GET /animals/all
```

#### Get animal

```http
  GET /animals/animal/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of animal to fetch |

#### Update animal

```http
  PATCH /animals/animal/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of animal to fetch |

#### Add single animal

```http
  GET /animals/add
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `animalDto`      | `AnimalDto` | **Required**. name and type of animal. **Optional** description |

#### Add list of animals

```http
  GET /animals/add/animals
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `animalDto[]`      | `AnimalDto[]` | **Required**. name and type of animal. **Optional** description |

#### Add list of animals of one type

```http
  GET /animals/add/animals/${type}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of animal to fetch |

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `animalNameDto[]`      | `AnimalNameDto[]` | **Required**. name  |


## Deployment

To deploy this project I used AWS with Github Actions. Configuration Github Actions and AWS not included.
