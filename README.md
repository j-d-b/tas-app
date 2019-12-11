# BCTC Truck Appointment System - Web Application

This repository contains the web application for the [KCUS](https://kcus.org)-designed custom truck appointment system for the [Beirut Container Terminal Consortium](http://bctc-lb.com).

The companion backend API can be found [here](https://github.com/j-d-b/tas-server).

## Usage

### Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and I have not yet felt the need to `eject`. Thus, the standard scripts apply.

Install dependencies with

```shell
yarn install
```

### Environment Variables
`.env` and `.env.production` environment variables files are included in the project root directory. These files define two variables which specifiy backend URIs:

* `REACT_APP_GRAPHQL_API_URI`: Full URI and endpoint for the TAS GraphQL API (e.g. http://localhost:4000/graphql)
* `REACT_APP_REFRESH_TOKEN_URI`: Full URI for endpoint to get new auth token using refresh token cookie (e.g. http://localhost:4000/auth-token)

`.env` will be used in local development and testing while `.env.production` will be used when creating a production build.

**Note:** `.env` also sets `EXTEND_ESLINT=true` which allows for the extended custom rules defined in `.eslintrc.js`.

### Development

#### Running the app

```shell
yarn start
```

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Connecting to the GraphQL API backend ([`tas-server`](https://github.com/j-d-b/tas-server/))

This web app is designed to connect to a GraphQL API backend designed and developed as part of the same project.

The URI of this backend is configured at line 13 of `src/index.js`.

For setting up a fresh development environment, I'd recommend setting up the backend first. Instructions for this can be found in the [project README](https://github.com/j-d-b/tas-server/blob/master/README.md). Configure the URI of the backend in `index.js`, then just run the app (`yarn start`).

### Production

```shell
yarn build
```

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## Organization

This project organizes React components into two directories: *components* and *containers*.

This organization is based on the standard pattern in React of separating presentational components which always render the same given their props, and container components which make connections to APIs, manage state, and hydrate the presentational components. In this project, the split is a bit lax and our *containers* directory containers components that are somewhat of a hybrid between a presentational and container components--they could absolutely be further broken down. Our *components* match the typical definition.

The key factor which separates the *containers* and *components* here is that *containers* make calls to the `tas-server` backend API while *components* simply present data through the props they are given.

*The one exception is `containers/LogoutButton.js` which makes the `logout` GraphQL mutation.*

## License

The TAS (and thus tas-server) was built for [BCTC](http://bctc-lb.com) by [@j-d-b](https://github.com/j-d-b) of [KCUS, Inc.](https://kcus.org) and is licensed under the [GNU General Public License, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).

See [LICENSE.md](./LICENSE.md) for details.

## Acknowledgements

This project uses some icons from Font Awesome [license here](https://fontawesome.com/license)

*Copyright 2019 KCUS, Inc.*
