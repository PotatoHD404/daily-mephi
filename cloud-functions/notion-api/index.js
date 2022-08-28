const axios = require('axios');
module.exports.handler = async function (event, context) {
    const params = event["queryStringParameters"]

    let data = JSON.stringify({
      "bucket": "public",
      "name": params["filename"],
      "contentType": params["mime"],
      "record": {
        "table": "block",
        "id": params["block"],
        "spaceId": params["space_id"]
      }
    });
    
    let config = {
      method: 'post',
      url: 'https://www.notion.so/api/v3/getUploadFileUrl',
      headers: { 
        'Content-Type': 'application/json', 
        'Cookie': `token_v2=${params["token_v2"]}`
      },
      data : data,
      validateStatus: () => true
    };
    let res1 = null
    while(res1?.status !== 200) {
      res1 = await axios(config)
    }
        return {
            statusCode: 200,
            headers: {
            'content-type': 'application/json',
            },
            body: JSON.stringify({signedPutUrl: res1.data["signedPutUrl"]}),
        };
    };
    