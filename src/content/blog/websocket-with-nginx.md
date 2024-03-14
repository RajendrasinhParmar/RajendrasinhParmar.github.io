---
title: Websocket with Nginx
description: Expose a websocket with the Nginx server
pubDatetime: 2024-03-14T23:50:59+05:30
postSlug: websocket-with-nginx
featured: false
draft: false
tags:
  - nginx
---

![tp.web.random_picture](https://images.unsplash.com/photo-1542305392-0d42cefe4f47?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8dHJlZSxsYW5kc2NhcGUsd2F0ZXJ8fHx8fHwxNzEwNDQwNDYw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900)

Expose a websocket with the Nginx server

## Table of contents

Expose a WebSocket with the Nginx server

## Table of contents

## TL;DR

- Expose the configuration that upgrades the http connection into the WebSocket.

```nginx
location /wsapp/ {
	proxy_pass http://backend;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "Upgrade";
	proxy_set_header Host $host;
}
```

In the example above `/wsapp/` is a rule to capture the request and pass it to `backend`. and the `backend` is an upstream server that will receive the WebSocket request.

## Introduction

While working on application deployment with more than one service we usually prefer using Nginx as a proxy server. That will parse the requests based on the rule configuration and forward it to the configured service. For normal web applications which only use REST APIs this works perfectly fine with normal configuration.
when it comes to `WebSockets` we need to add a bit more configuration to the Nginx setup.

## Nginx configuration for REST API

### Upstream server setup

To use Nginx as a proxy server to handle and route requests to different services we will configure the upstream servers section in Nginx. Upstream is the configuration that creates a named upstream server that can be used in other Nginx configuration blocks.

```nginx
upstream backend-rest1 {
	server apisvc1:8000;
}

upstream backend-rest2 {
	server apicommon:8001;
}
```

- In the example above we've defined two upstream servers `backend-rest1` and `backend-rest2`.
- This code clock will be used in server block configuration

### Server Block setup

Set up a proxy server to listen and handle requests coming to servers. For this, we will configure server blocks that will receive requests, and parse the request according to configured location blocks.

```nginx
server {
	listen 80;
	server_name localhost;

	location /apiv1/ {
		proxy_pass http://backend-rest1;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
	}

	location /apiv2/ {
		proxy_pass http://backend-rest2;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
	}

	location / {
		proxy_pass http://<frontend_url>
	}
}
```

The above block of configuration will listen on `Port 80` of `localhost` and any request coming to the endpoint `/apiv1` will be forwarded to `backend-rest1` and requests coming to the endpoint `/apiv2` will be forwarded to `backend-rest2`.
Any Other request not matching with these 2 routes will go to the final default block.

### Complete configuration

The complete configuration of Nginx for two services looks like the following

```nginx
upstream backend-rest1 {
	server apirest1:8000;
}

upstream backend-rest2 {
	server apicommon:8001;
}

server {
	listen 80;
	server_name localhost;

	location /apiv1/ {
		proxy_pass http://backend-rest1;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
	}

	location /apiv2/ {
		proxy_pass http://backend-rest2;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
	}

	location / {
		proxy_pass http://<frontend_url>
	}
}
```

## Nginx Issue with socket

If you have a new chat feature, we need to implement a web socket. In our example above, let's say `apicommon` is a service having an endpoint for the WebSocket which is exposed.

If we try to connect to the WebSocket with the above configuration, we will get issues of `route not found`.

## Adding location block for `WebSocket` setup

To enable the WebSocket connection to pass through the Nginx proxy, we need to explicitly configure the location block that allows the WebSocket connection to go to the backend service.

To do that we will need to set the `http_upgrade` header for the request and also need to update the version of http to 1.1

```nginx
location /ws/ {
	proxy_pass http://apicommon;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "Upgrade";
	proxy_set_header Host $host;
}
```

All the requests coming to `/ws/` will be upgraded and forwarded to the `apicommon` server where our WebSocket endpoint is implemented. This above code block can be placed just above the final catch-call route.

## Conclusion

When we use Nginx as a reverse proxy and we have WebSockets in our application, we need to make sure that there is a `location` block configured that upgrades the connection and forwards it to the WebSocket endpoint.
