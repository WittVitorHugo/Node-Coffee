const seneca = require('seneca')()
const request = require('request')

seneca.add('role:forecast, cmd:get', function (msg, respond) {
  const apiKey = '9282121e73afc6dd1aebd2d2bac1a41b'
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${msg.location}&appid=${apiKey}&units=metric`

  request(url, function (err, response, body) {
    if (err) {
      respond(err)
    } else {
      const data = JSON.parse(body)
      const forecast = data.list.map((item) => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        conditions: item.weather[0].description,
      }))
      respond(null, forecast)
    }
  })
})

seneca.listen()