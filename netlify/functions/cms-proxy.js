exports.handler = async function(event) {
  var offset = 0;
  var limit = 2000;

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
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      var errText = await response.text();
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: err.message,
        note: 'fetch failed in Node — check Node version'
      })
    };
  }
};
