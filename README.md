# Notion-to-Markdown as a Service

This is a dirt-simple service to convert Notion pages to Markdown. This is meant to be used as part of an internal automation to convert a Notion database into a CMS for a blog. The instructions below are tailored to that use case, however feel free to close this for your own purposes.

## Setup

```docker-compose
version: "3.7"

########################### NETWORKS
networks:
  t2_proxy:
    name: t2_proxy
    external: true

########################### SERVICES
services:
  # ... 8< Snip...

  # N2M Service
  # https://github.com/sethvoltz/n2m-service
  #
  n2m-service:
    depends_on:
      - traefik
    container_name: n2m-service
    image: IMAGEHERE:latest
    restart: unless-stopped
    networks:
      - t2_proxy
    environment:
      NOTION_TOKEN: your_integration_secret_here
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n2m-service-rtr.entrypoints=https"
      - "traefik.http.routers.n2m-service-rtr.rule=HostHeader(`n2m-service.$DOMAINNAME`)"
      - "traefik.http.routers.n2m-service-rtr.middlewares=authelia@docker" # Authelia
      - "traefik.http.routers.n2m-service-rtr.service=n2m-service-svc"
      - "traefik.http.services.n2m-service-svc.loadbalancer.server.port=8080"
```
