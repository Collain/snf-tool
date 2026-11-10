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

  var cmsEndpoint = 'https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0' +
                    '?limit=' + limit +
                    '&offset=' + offset +
                    '&count=true&results=true';

  // If Netlify's AWS IP is blocked by Akamai, route through alternative clean edges
  var sources = [
    // Route 1: Clean edge proxy via AllOrigins
    'https://api.allorigins.win/raw?url=' + encodeURIComponent(cmsEndpoint),
    // Route 2: Clean edge proxy via CorsProxy
    'https://corsproxy.io/?' + encodeURIComponent(cmsEndpoint),
    // Route 3: Direct CMS
    cmsEndpoint
  ];

  var lastError = '';

  for (var i = 0; i < sources.length; i++) {
    try {
      var res = await fetch(sources[i], {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        lastError = 'Route ' + i + ' returned HTTP ' + res.status;
        continue;
      }

      var text = await res.text();

      // Ensure we got actual JSON, not an Akamai HTML error page
      if (text.trim().startsWith('<') || text.indexOf('Access Denied') >= 0) {
        lastError = 'Route ' + i + ' returned Akamai block page';
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
        body: text
      };
    } catch (e) {
      lastError = 'Route ' + i + ' error: ' + e.message;
    }
  }

  return {
    statusCode: 502,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: 'All fetch routes failed',
      detail: lastError
    })
  };
};
