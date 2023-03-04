# Platz Frontend

This repo contains Platz's frontend. In a nutshell:

* It uses Vue 3
* It's written in Typescript
* It uses [Bootstrap](https://getbootstrap.com/)
* It uses [FontAwesome](https://fontawesome.com/)

## Distribution + Local Development

The frontend, both in development and in production, serves a SPA (single page app) and forwards API calls to the backend under the same domain in all `/api` prefixes.

This means that when running locally all API calls go through the frontend development server ([webpack-dev-server](https://webpack.js.org/configuration/dev-server/)). This is defined in `vue.config.js`.

In production the frontend is deployed as a separate Helm chart using the same domain as the backend. Kubernetes handles this because the frontend uses the `pathPrefix` of `/` while the backend is served under `/api`. This allows one Ingress controller to route the traffic to each Ingress individually.

So, while users see one domain in production, any downtime of the frontend can't affect the backend.

### Developing Against The Production Backend

The easiest and most common way to develop the frontend is against the production backend. To do that, run the following command:

```
PLATZ_BACKEND=https://platz.example.com npm run serve
```

The frontend is then served from http://localhost:8080, and as mentioned above acts as a reverse-proxy to all backend traffic.

### Developing With a Local Backend

When running a backend locally, run the same command without defining the `PLATZ_BACKEND` environment variable:

```
npm run serve
```

Note that the frontend always tries to authenticate users, therefore authentication has to be properly configured in the backend for the frontend to work correctly.

## Styling (CSS)

All styles, except for component-specific styles in `<style scoped>` sections, are located in `src/style`.

Everything is based on [Bootstrap](https://getbootstrap.com/), with some adjustments of fonts, colors, etc.

FontAwesome is used in its full form, without picking specific fonts. This results in a larger distribution, but allows for users to pick any font for deployments.

## Store

The store is a big module initialized once at the application starts. It fetches all data from the backend and opens a Websocket for receiving updates on object changes from the backend side.

All API calls go through the store, including create/update/delete actions. This is done using methods like `createItem` of each collection. The store is responsible for adding the `Authorization` header to all calls. This is why the store is also responsible for authentication.

### Models

The store defines Typescript `interface`s and `type`s to match those defined in the backend, mostly in the `platz-db` crate.

## Admin vs. Env View

The app is essentially two apps in one: The "env" section is what most users see, which is one env at a time. This is served under the `/envs` prefix.

There's an "admin" section under `/admin` which contains global site configuration, such as Kubernetes clusters, Helm registries, users, etc.

Only users with the proper permission can see and access this section.
