# React Webpack Babel Starter
> Minimal starter with hot module replacement (HMR) for rapid development.

* **[React](https://facebook.github.io/react/)** (18.x)
* **[Webpack](https://webpack.js.org/)** (5.x)
* **[Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/)** + [Fast Refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin)
* Image support ([Image Webpack Loader](https://github.com/tcoopman/image-webpack-loader))
* [SASS](http://sass-lang.com/) support
* Production build script
* Code formatting ([Prettier](https://github.com/prettier/prettier))
* Test frameworks ([Jest](https://facebook.github.io/jest/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro))

## Installation
1. Clone/download repo
2. `yarn install` (or `npm install` for npm)

## Usage
**Development**

`yarn run start-dev`

* Build app continously (HMR enabled)
* App served @ `http://localhost:8080`

**Production**

`yarn run start-prod`

* Build app once (HMR disabled) to `/dist/`
* App served @ `http://localhost:3000`

Note: change port number by setting the envrionment variable `PORT` 

---

**All commands**

Command | Description
--- | ---
`yarn run start-dev` | Build app continously (HMR enabled) and serve @ `http://localhost:8080`
`yarn run start-prod` | Build app once (HMR disabled) to `/dist/` @ `http://localhost:3000`
`yarn run build` | Build app to `/dist/`
`yarn run test` | Run tests
`yarn run prettier-write` | Format code and write changes
`yarn run prettier-check` | Prints the filenames of files that are different from Prettier formatting
`yarn run start` | (alias of `yarn run start-dev`)

**Note**: replace `yarn` with `npm` in `package.json` if you use npm.

## See also
* [React Webpack Typescript Starter](https://github.com/vikpe/react-webpack-typescript-starter)
* [Create React App](https://github.com/facebook/create-react-app)
* [Vite](https://vitejs.dev/)
* [Parsel](https://parceljs.org/)

