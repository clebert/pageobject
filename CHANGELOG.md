# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keepachangelog]
and this project adheres to [Semantic Versioning][semver-spec].

## [Unreleased]

### Added

### Changed

### Fixed

## v0.8.0 - 2017-11-09

### Added

- Added the package @pageobject/predicates.

#### @pageobject/class

- Added the class `AdapterTestSuite` a common test suite for adapters (only relevant for adapter authors).
- Added the class `AdapterMock` (only relevant for @pageobject package authors).

### Changed

#### @pageobject/class

- **Breaking:** Changed the interface `Adapter` (only relevant for adapter authors).

#### @pageobject/selenium-adapter

- **Breaking:** Removed the predicate functions.

#### @pageobject/puppeteer-adapter

- **Breaking:** Removed the predicate functions.

## v0.7.0 - 2017-11-06

### Added

- Added the package @pageobject/puppeteer-adapter.

## v0.6.0 - 2017-11-06

### Changed

#### @pageobject/class

- **Breaking:** In addition to the existing parameters, an adapter is now the first parameter of any predicate function.

## v0.5.1 - 2017-11-05

### Fixed

#### @pageobject/class

- Even during a recursive element search, the retry mechanism should only be initialized once.

## v0.5.0 - 2017-11-05

### Added

#### @pageobject/class

- Added an element search retry mechanism, it can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`.

## v0.4.0 - 2017-11-04

### Added

#### @pageobject/class

- **Breaking:** Added the required property `selectors` to the interface `PageClass`.
- **Breaking:** Added the required parameter `elements` to the type `Predicate`.

### Changed

#### @pageobject/class

- **Breaking:** Set the optional property `url` of the interface `PageClass` to required.
- **Breaking:** Changed the type of the property `url` of the interface `PageClass` from `RegExp | string` to `RegExp`.
- **Breaking:** Removed the type `InitialComponent`.
- Removed the optional property `InitialComponents` of the interface `PageClass`.
- Removed the optional property `InitialElements` of the interface `PageClass`.

## v0.3.0 - 2017-11-02

### Added

#### @pageobject/selenium-adapter

- Added the static method `launchHeadlessChrome()` to the class `SeleniumAdapter`.
- Added the method `open(Page, url)` to the class `SeleniumAdapter`.

### Changed

#### @pageobject/selenium-adapter

- **Breaking:** Removed the class `SeleniumBrowser`.

## v0.2.0 - 2017-10-29

### Added

#### @pageobject/class

- Added the optional property `InitialElements` to the interface `PageClass`.

#### @pageobject/selenium-adapter

- Added the method `setElementSearchTimeout(ms)` to the class `SeleniumBrowser`.
- Added the method `setPageLoadTimeout(ms)` to the class `SeleniumBrowser`.

### Changed

#### @pageobject/class

- Set the required properties `InitialComponents` and `url` of the interface `PageClass` to optional.

#### @pageobject/selenium-adapter

- **Breaking:** Changed the parameters of the constructor method of the class `SeleniumBrowser`.
- **Breaking:** Removed the static method `launch(capabilities)` of the class `SeleniumBrowser`.

## v0.1.0 - 2017-10-27

### Added

- Added the package @pageobject/class.
- Added the package @pageobject/selenium-adapter.

[keepachangelog]: http://keepachangelog.com/en/1.0.0/
[semver-spec]: http://semver.org/spec/v2.0.0.html
