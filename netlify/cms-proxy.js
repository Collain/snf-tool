exports.handler = async function(event) {
  var offset = 0;
  var limit = 500;

  if (event.queryStringParameters) {
    if (event.queryStringParameters.offset) {
      offset = parseInt(event.queryStringParameters.offset);
    }
    if (event.queryStringParameters.limit) {
      limit = parseInt(event.queryStringParameters.limit);
    }
  }

  var url = 'https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0' +
            '?limit=' + limit +
            '&offset=' + offset +
            '&count=true&results=true';

  try {
    var response = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Referer': 'https://data.cms.gov/provider-data/dataset/4pq5-n9py',
        'Origin': 'https://data.cms.gov'
      }
    });

    if (!response.ok) {
      var errText = await response.text();
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'CMS returned ' + response.status,
          detail: errText.substring(0, 500)
        })
      };
    }

    var data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: data
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
