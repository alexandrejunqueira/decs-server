'use strict';

const {send} = require('micro');
const fetch = require('node-fetch');
const iconv = require('iconv-lite');

const BASE_URL = 'http://decs.bvsalud.org/cgi-bin/mx/cgi=@vmx/decs/';

module.exports = (req, microRes) => {
  const pathname = req.url.split('/');
  const method = pathname[1];
  const params = pathname.slice(2);

  microRes.setHeader('Access-Control-Allow-Origin', '*');
  microRes.setHeader('Content-Type', 'text/xml; charset=UTF-8');

  let url = '';

  switch (method) {
    case 'words':
      url = `${BASE_URL}?lang=${params[0]}&words=${params[1]}`;
      break;
    case 'tree_id':
      url = `${BASE_URL}?lang=${params[0]}&tree_id=${params[1]}`;
      break;
    default:
      return send(microRes, 400, 'Bad Request');
  }

  fetch(url)
    .then(fetchRes => fetchRes.arrayBuffer())
    .then(buffer => {
      send(microRes, 200, iconv.decode(Buffer.from(buffer), 'iso-8859-1'));
    })
    .catch(err => {
      console.error(err);
      send(microRes, 500, 'Internal Server Error');
    });
};
