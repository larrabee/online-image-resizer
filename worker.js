const URL = require('url').URL;
const util = require('util');
const http = require('http');
const https = require('https');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

module.exports.run = function(worker) {
  var server = worker.getHTTPServer();
  server.on('request', function(req, res) {
    var body = [];
    if (req.method != 'GET') {
      error(res, 400);
    }

    req.on('data', function(chunk) {
      body.push(chunk);
    });

    req.on('end', async() => {
      
      try {
        var uriData = await parseURI(req);
      } catch (e) {
        console.log(e)
        onError(res, 500)
        return
      }

      try {
        var imageData = await getImage(uriData);
      } catch (e) {
        console.log('Image download "' + uriData.uri + '" failed with error: ' + e.statusCode)
        onError(res, e.statusCode)
        return
      }

      try {
        var resizedImage = await resize(Buffer.from(imageData.data, 'binary'), uriData.resizeWidth, uriData.resizeHeight);
      } catch (e) {
        console.log('Image resize "' + uriData.uri + '" failed')
        onError(res, 500)
        return
      }

      try {
        var minifyedImage = await minify(resizedImage)
      } catch (e) {
        console.log('Image minify "' + uriData.uri + '" failed')
        var minifyedImage = resizedImage;
      }
      onSuccess(res, minifyedImage, imageData.contentType);
    });

  });
};


const parseURI = (req) => {
  return new Promise(function(resolve, reject) {
    let data = {};
    const uri = new URL(util.format("http://%s%s", req.headers.host, req.url));
    let splitedUri = uri.pathname.split('@');
    let resizeParams = splitedUri.pop();
    if (req.headers['x-resize-scheme'] === 'http') {
      data.proto = 'http';
      data.http_lib = http;
    } else {
      data.proto = 'https';
      data.http_lib = https;
    }
    data.uri = util.format('%s://%s%s%s', data.proto, req.headers['x-resize-base'], splitedUri.join('@'), uri.search);
    data.resizeWidth = +parseInt(resizeParams.split(/x|X/)[0]) || null;
    data.resizeHeight = +parseInt(resizeParams.split(/x|X/)[1]) || null;
    if (data.resizeWidth == null && data.resizeHeight == null) {
      reject('Can not parse requested URI ' + req.url.toString());
    }
    resolve(data);
  });
}

const getImage = (data) => {
  return new Promise(function(resolve, reject) {
    data.http_lib.get(data.uri, (res) => {
      let data = {
        "data": "",
        "statusCode": parseInt(res.statusCode),
        "contentType": res.headers['content-type']
      };
      res.setEncoding('binary');
      res.on('data', function(chunk) {
        data.data += chunk;
      });
      res.on('end', () => {
        if (data.statusCode == 200) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  });
}

const onError = (res, code) => {
  res.writeHead(code)
  res.end()
}

const onSuccess = (res, resultImg, contentType) => {
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(resultImg, 'binary'),
  })
  res.end(resultImg, 'binary')
}

const resize = (buffer, resizeWidth, resizeHeight) => sharp(buffer)
  .resize(resizeWidth, resizeHeight, {
    interpolator: sharp.interpolator.nohalo,
    centreSampling: true
  })
  .withoutEnlargement(true)
  .toBuffer()

const minify = image => imagemin.buffer(image, {
  plugins: [imageminMozjpeg({
      quality: 100
    }),
    imageminPngquant()
  ]
})
