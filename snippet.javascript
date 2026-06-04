exports.handler = async function(event) {
  const offset = event.queryStringParameters.offset || 0;
  const limit  = event.queryStringParameters.limit  || 2000;
  
  const url = 'https://data.cms.gov/provider-data/api/1/' +
              'datastore/query/4pq5-n9py/0' +
              '?limit=' + limit + '&offset=' + offset;
  
  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'CMS API returned ' + response.status })
      };
    }
    
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
