const seneca = require('seneca')()
const request = require('request')

seneca.client({ post: 9001, pin: 'role:weather' })
seneca.client({ port: 9002, pin: 'role:forecast' })
seneca.client({ port: 9003, pin: 'role:db' })

seneca.add('cmd:getWeather', function (msg, respond) {
  seneca.add({ role: 'weather', cmd: 'getWeather', zip: msg.zip }, (err, weather) => {
    if (err) {
      respond(err)
    } else {
      seneca.act({ role: 'forecast', cmd: 'getForecast', zip: msg.zip }, (err, forecast) => {
        if (err) {
          respond(err)
        } else {
          seneca.act({ role: 'db', cmd: 'insertWeather', location: weather.name, date: new Date().toISOString().split('T')[0], temperature: weather.main.temp, conditions: weather.weather[0].description }, (err) => {
            if (err) {
              console.error(err)
            }
          })
          respond(null, { weather: weather, forecast: forecast })
        }
      })
    }
  })
})

seneca.listen()