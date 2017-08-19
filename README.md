# Online Image Resizer

## Instal steps
1. Build and run docker image
2. Configure frontend
3. Enjoy!

## Build docker image
1. Clone this repo to PC with `git clone https://github.com/larrabee/resizer.git`
2. Change parrams in `server.js` (not needed for most cases)
3. Build docker container: `cd resizer && docker build -t resizer .`
4. Run it with `docker run -d -p 7075:7075 resizer` or use docker-compose config:
```
version: '2'
services:
  resizer:
      image: resizer
      network_mode: host
      container_name: "resizer"
      restart: always
      environment:
         UV_THREADPOOL_SIZE: 64
```

## Configure frontend
This is basic Nginx config (nginx.conf) for online resizing with nginx cache.
```
events {
}

http {
    proxy_cache_path /var/www/resize_cache levels=1:2 
    keys_zone=resized_img:64m inactive=48h max_size=5G use_temp_path=off;

    server {
        listen       80;
        server_name  example.com;
        root /var/www/example.com/;

        location /img/ {
           location ~* \.(jpg|jpeg|png|ico)(\@[0-9xX]+)$ {
             proxy_pass http://localhost:7075; #Node with running image resizer
             proxy_set_header X-RESIZE-SCHEME "http";
             proxy_set_header X-RESIZE-BASE "example.com";
             #Nginx cache. Optional
             proxy_cache_valid  200 48h;
             proxy_cache_valid  404 400 5m;
             proxy_cache_valid 500 502 503 504 10s;
             add_header X-Cache-Status $upstream_cache_status;
             proxy_cache resized_img;
           }
        }
    }
}
```
You must set:
1. Replace `localhost:7075` with your hostname and port if you ran resizer in different node.
2. Set `X-RESIZE-SCHEME "http"` if your image server with original images run over http (by default use https). 
3. Set you image server hostname here: `X-RESIZE-BASE "example.com"`

## Enjoy!
* Upload [test image](http://www.publicdomainpictures.net/pictures/110000/velka/green-mountain-valley.jpg) to `/img/test.jpg` on your server
* Get original image [http://example.com/img/test.jpg](http://example.com/img/test.jpg) (naturally it must be present on your server).
* Get resized to 1280x720 version [http://example.com/img/test.jpg@1280](http://example.com/img/test.jpg@1280) (height resolution will be calculate automatically)
* Another way: [http://example.com/img/test.jpg@x720](http://example.com/img/test.jpg@x720) (width resolution will be calculate automatically)
* Get resized to 500x500 version (image will be resized and striped to 500x500) [http://example.com/img/test.jpg@500x500](http://example.com/img/test.jpg@500x500)
