const seneca = require('seneca')()
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(':memory:')

db.serialize(() => {
  db.run('CREATE TABLE locations (id INTEGER PRIMARY KEY, name TEXT)')
  db.run('CREATE TABLE weather (id INTEGER PRIMARY KEY, location_id INTEGER, date TEXT, temperature FLOAT, conditions TEXT)')

  db.run('INSERT INTO locations (name) VALUES (?)', ['New York'])
  db.run('INSERT INTO locations (name) VALUES (?)', ['Los Angeles'])
})

seneca.add('role:db,cmd:getLocationByName', function (msg, respond) {

  db.get('SELECT * FROM locations WHERE name = ?', msg.name, (err, row) => {

    if (err) {
      respond(err)
    } else {
      respond(null, row)
    }
  })

  seneca.add('role:db,cmd:insertWeather', function (msg, respond) {
    db.get('SELECT * FROM locations WHERE name = ?', msg.location, (err, location) => {
      if (err) {
        respond(err)
      } else {
        db.run('INSERT INTO weather (location_id, date, temperature, conditions) VALUES (?, ?, ?, ?)', [
          location.id,
          msg.date,
          msg.temperature,
          msg.conditions,
        ], (err) => {
          if (err) {
            respond(err)
          } else {
            respond(null, true)
          }
        })
      }
    })
  })
})


seneca.listen()