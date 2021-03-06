const hyperquest = require('hyperquest')
    , bl         = require('bl')
    , qs         = require('querystring')

function day (s) {
  if (!(s instanceof Date)) {
    if (!Date.parse(s))
      return null
    s = new Date(s)
  }
  return s.toISOString().substr(0, 10)
}


function downloadCounts (pkg, start, end, callback) {
  var url        = 'https://api.npmjs.org/downloads/range/'
        + day(start) + ':' + day(end) + '/' + pkg

  hyperquest.get(url).pipe(bl(function (err, body) {
    if (err)
      return callback(err)

    var doc
    try {
      doc = JSON.parse(body)
    } catch (e) {
      callback(err)
    }

    if (doc.error) {
      return callback(new Error(
          'registry error: '
          + doc.error
          + ' ('
          + (doc.reason || 'reason unknown')
          + ')'))
    }

    callback(null, doc.downloads.map(function (row) {
      return {
          day   : row.day
        , count : row.downloads
      }
    }))
  }))
}

module.exports = downloadCounts