# @pageobject/engine [![Package Version][badge-npm-image]][badge-npm-link] [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link]

This package allows you to execute unreliable, asynchronous, and [idempotent][wiki-idempotence] commands reliably.

## Installation

```sh
yarn add @pageobject/engine
```

## API

Please find the API documentation [here][repo-api-engine].

## Usage

### Import the package

```js
import {createRetryEngine} from '@pageobject/engine';
```

### Create a retry engine

```js
const defaultTimeout = 10000 /* 10 seconds */;

const {retryOnError} = createRetryEngine(defaultTimeout);
```

### Execute an idempotent command

```js
const erroneousTwoTimes = async () => /* ... */;
const neverEnding = async () => /* ... */;
```

In the following, the `erroneousTwoTimes` command is executed a total of 3 times. The third time the execution ends successfully.

```js
retryOnError(erroneousTwoTimes).then(() => {
  console.log('Yeah!');
});
```

The following execution of the `neverEnding` command results in a timeout error after 10 seconds.

```js
retryOnError(neverEnding).catch(() => {
  console.error('Oops!');
});
```

The following execution of the `neverEnding` command results in a timeout error after 5 seconds.

```js
const timeout = 5000 /* 5 seconds */;

retryOnError(neverEnding, timeout).catch(() => {
  console.error('Oops!');
});
```

---

Built by (c) Clemens Akens. Released under the terms of the [MIT License][repo-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-npm-image]: https://img.shields.io/npm/v/@pageobject/engine.svg
[badge-npm-link]: https://yarnpkg.com/en/package/@pageobject/engine
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject
[repo-api-engine]: https://pageobject.js.org/api/engine/
[repo-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[wiki-idempotence]: https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning
