# LuxPM Coding Test
In this repository you will find:

- A python script that generates first 20 odd numbers from 0 and prints out as
  JSON.
- An express.js server that on initialisation attempts to load and insert the
  output of aforementioned python script.
- A docker-compose.yml file that recreates the environment for testing.

## server.js
The express server will first attempt run the python script and then to create and insert the data into the  `results` table. It then creates an API endpoint which can be described as such:

| Method | Endpoint | Returns |
| ------ | -------- | ------- |
| GET    | /results | [Result, ResultN] | 

The `Result` Object can be described as:

```
{
	"id": 1,
	"num":1,
	"createdAt": "2021-04-01T03:47:01.537Z",
	"updatedAt": "2021-04-01T03:47:01.537Z"
}
```

## docker-compose.yml
To initalise the environment run: `docker-compose up` after which you
should be able to interact with the API via `http://localhost:3000`

If you do not want to use the provided docker-compose environment, running `node
server.js` will run using an in memory sqlite database.
