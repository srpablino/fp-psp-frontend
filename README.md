
# Poverty Stoplight
Fundación Paraguaya (FP from now on) has developed a methodology called 
“Poverty Stoplight”. The Poverty Stoplight seeks to eliminate the 
multidimensional poverty that affects many families. It allows families to 
trace their own poverty map and develop and implement a clear plan to 
overcome it.

Through a visual survey that shows photographs, families self-assess their 
level of poverty with 50 indicators. These indicators are in turn grouped 
into 6 different dimensions of poverty.

## Poverty Stoplight Frontend

Single Page Application working as a web client for [FP-PSP-SERVER](https://github.com/FundacionParaguaya/FP-PSP-SERVER).

## Credits

This project has been built with [Joko Starter Kit](https://github.com/jokoframework/joko_spa_starter_kit) as a skeleton.

## Requirements

  * [Node.js](https://nodejs.org/) v5.0.0 or above

## Getting Started

### Clone this repo

```shell
$ git clone https://github.com/FundacionParaguaya/fp-psp-frontend.git
$ cd fp-psp-frontend
```

### Development

Run:

```shell
npm install
npm run start
```

This will create the bundle from the sources in `/src` and output it to `/dist`.

Finally, open up your browser in:
> [http://localhost:9000/](http://localhost:9000/)

### Environment

If you need to, change the `API` value in `config/env_develpment.json` to point to the FP-SERVER running in your local machine. By default this should work without any modification. 

Use `config/env_production.json` in production environments.

### Build for production

Run:

```shell
$ npm run build
```

### Tests

Unit and integration tests are run with [Karma](http://karma-runner.github.io/0.12/index.html), [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/):

```shell
$ npm test
```

To detect potential errors and bugs we use [JSHint](http://jshint.com/):

```shell
$ npm run lint
```