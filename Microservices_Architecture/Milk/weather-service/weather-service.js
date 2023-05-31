const seneca = require('seneca')()
const request = require('request')

seneca.add('role:weather,cmd:get', function (msg, respond) {
  const apiKey = '9282121e73afc6dd1aebd2d2bac1a41b'
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${msg.location}&appid=${apiKey}&units=metric`

  request(url, function (err, response, body) {
    if (err) {
      respond(err)
    } else {
      const data = JSON.parse(body)
      respond(null, { temperature: data.main.temp, conditions: data.weather[0].description })
    }
  })
})

seneca.listen()