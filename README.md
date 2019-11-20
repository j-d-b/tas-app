# BCTC Truck Appointment System - Web Application

This repository contains the web application for the [KCUS](https://kcus.org)-designed custom truck appointment system for the [Beirut Container Terminal Consortium](http://bctc-lb.com).

The companion backend API can be found [here](https://github.com/j-d-b/tas-server).

## Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and I have not yet felt the need to `eject`. Thus, the standard scripts apply.

Install dependencies with

```shell
yarn install
```

## Development

### Running the app

```shell
yarn start
```

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Connecting to the GraphQL API backend ([`tas-server`](https://github.com/j-d-b/tas-server/))

This web app is designed to connect to a GraphQL API backend designed and developed as part of the same project. 

The URI of this backend is configured at line 13 of `src/index.js`.

For setting up a fresh development environment, I'd recommend setting up the backend first. Instructions for this can be found in the [project README](https://github.com/j-d-b/tas-server/blob/master/README.md). Configure the URI of the backend in `index.js`, then just run the app (`yarn start`).

## Production

```shell
yarn build
```

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## License

The TAS (and thus tas-server) was built for [BCTC](http://bctc-lb.com) by [@j-d-b](https://github.com/j-d-b) of [KCUS, Inc.](https://kcus.org) and is licensed under the [GNU General Public License, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).

See [LICENSE.md](./LICENSE.md) for details.

## Acknowledgements

This project uses some icons from Font Awesome [license here](https://fontawesome.com/license)

*Copyright 2019 KCUS, Inc.*
