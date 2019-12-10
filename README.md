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

The TAS is deployed on Netlify and includes a `_redirects` in the `public` directory to redirect all requests to `index.html`.

## License

The TAS (and thus tas-server) was built for [BCTC](http://bctc-lb.com) by [@j-d-b](https://github.com/j-d-b) of [KCUS, Inc.](https://kcus.org) and is licensed under the [GNU General Public License, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).

See [LICENSE.md](./LICENSE.md) for details.

## Acknowledgements

This project uses some icons from Font Awesome [license here](https://fontawesome.com/license)

*Copyright 2019 KCUS, Inc.*
