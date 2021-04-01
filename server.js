const express = require('express')
const { exec } = require('child_process')
const { Sequelize, Model, DataTypes } = require('sequelize')

// load ENV/defaults
const listenAddr = process.env.LISTEN_ADDR || 'localhost'
const listenPort = process.env.LISTEN_PORT || 3000
const databaseMode = process.env.MYSQL_URI || 'sqlite::memory:'

// load database
const sequelize = new Sequelize(databaseMode)

// define models
class Result extends Model{}
Result.init(
  {
    num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'results',
  },
)

// load results from external python script
const loadResults = async () => {
  return new Promise((resolve, reject) => {
    exec(`python generate_odd_numbers.py`, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(stdout))
    })
  })
}

// attempt to insert results in to mysql database
const insertResults = async (results) => {
  return Promise.all(
    results.map((num) => Result.create({num}))
  )
}

// create routes and start express api
const startServer = () => {
  const app = express()

  // return all results
  app.get('/results', async (req, res) => {
    const results = await Result.findAll()
    res.json(results)
  })

  // start the server
  app.listen(listenPort, listenAddr, () => {
      console.log(`listening at http://${listenAddr}:${listenPort}`)
  })
}

// wrap initalisation so we can return an error on failed startup
const main = async () => {
  try {
    const results = await loadResults()
    console.log(`loaded results: ${results}`)

    await Result.sync({force: true})

    await insertResults(results)
    console.log(`inserted results`)

    startServer()

  } catch (err) {
      console.log(`unable to generate odd numbers: `, err)
      process.exit(1)
  }
}

// setup sigint trap
process.on('SIGINT', () => process.exit(0))

main()
