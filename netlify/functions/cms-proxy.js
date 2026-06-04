exports.handler = async function(event) {
  var offset = event.queryStringParameters && event.queryStringParameters.offset ? event.queryStringParameters.offset : 0;
  var limit = event.queryStringParameters && event.queryStringParameters.limit ? event.queryStringParameters.limit : 2000;
  var url = 'https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0?limit=' + limit + '&offset=' + offset;
  try {
    var response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'CMS returned ' + response.status })
      };
    }
    var data = await response.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
