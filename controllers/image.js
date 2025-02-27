const XMLHttpRequest = require('node-http-xhr');

const KEY = 'AIzaSyDrUL_mEhIkXXBt3zj-AqQCXgUsqf0uT1k';

const image = db => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1)
    .returning('entries').then(entries => res.json(entries[0].entries))
    .catch(err => res.status(400).json('Unable to get entries'));
};

const url = (req, res) => {
    const input = "https://imagex.aratech.co?url=" + req.body.input.replace('https://', '').replace('http://', '') + '&w=720&h=720&t=absolute';
    const request = {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({
          "requests": [
            {
              "image": {
                "source": {
                  "imageUri": input
                }
              },
              "features": [
                {
                  "type": "FACE_DETECTION",
                },
                {
                  "type": "IMAGE_PROPERTIES",
                  "maxResults": 10
                }
              ]
            }
          ]
      });
      
      console.log(input);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', "https://vision.googleapis.com/v1/images:annotate?key=" + KEY);
      xhr.addEventListener('load', () => {
        if (input) {
            const response = JSON.parse(xhr.response);
            if (response) {
                console.log(response);
                res.json(response);
            }
        }
      });
      xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
      xhr.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
      xhr.setRequestHeader('Pragma', 'no-cache');
      xhr.send(body);
}

module.exports = {
    image: image,
    url: url
};