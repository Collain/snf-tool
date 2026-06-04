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

  // Try multiple URL formats — CMS DKAN API variations
  var urls = [
    'https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0?limit=' + limit + '&offset=' + offset + '&count=true&results=true',
    'https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0?limit=' + limit + '&offset=' + offset,
    'https://data.cms.gov/provider-data/api/1/datastore/sql?query=%5BSELECT%20*%20FROM%204pq5-n9py%5D%5BLIMIT%20' + limit + '%20OFFSET%20' + offset + '%5D'
  ];

  var lastError = '';
  var i;

  for (i = 0; i < urls.length; i++) {
    try {
      var response = await fetch(urls[i], {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      var responseText = await response.text();

      if (!response.ok) {
        lastError = 'URL ' + i + ' HTTP ' + response.status + ': ' + responseText.substring(0, 200);
        continue;
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: responseText
      };

    } catch(err) {
      lastError = 'URL ' + i + ' threw: ' + err.message;
    }
  }

  // All URLs failed — return detailed error for debugging
  return {
    statusCode: 500,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      error: 'All CMS URL formats failed',
      detail: lastError,
      urls_tried: urls
    })
  };
};
