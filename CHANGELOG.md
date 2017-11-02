# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keepachangelog]
and this project adheres to [Semantic Versioning][semver-spec].

## [Unreleased]

### Added

### Changed

### Fixed

## v0.3.0 - 2017-11-02

### Added

#### @pageobject/selenium-adapter

- Added the static `launchHeadlessChrome()` method to the `SeleniumAdapter` class.
- Added the `open(Page, url)` method to the `SeleniumAdapter` class.

### Changed

#### @pageobject/selenium-adapter

- **Breaking:** Removed the `SeleniumBrowser` class.

## v0.2.0 - 2017-10-29

### Added

#### @pageobject/class

- Added the optional `InitialElements` property to the `PageClass` interface.

#### @pageobject/selenium-adapter

- Added the `setElementSearchTimeout(ms)` method to the `SeleniumBrowser` class.
- Added the `setPageLoadTimeout(ms)` method to the `SeleniumBrowser` class.

### Changed

#### @pageobject/class

- Set the required `InitialComponents` and `url` properties of the `PageClass` interface to optional.

#### @pageobject/selenium-adapter

- **Breaking:** Changed the parameters of the constructor method of the `SeleniumBrowser` class.
- **Breaking:** Removed the static `launch(capabilities)` method of the `SeleniumBrowser` class.

## v0.1.0 - 2017-10-27

### Added

- Added the @pageobject/class package.
- Added the @pageobject/selenium-adapter package.

[keepachangelog]: http://keepachangelog.com/en/1.0.0/
[semver-spec]: http://semver.org/spec/v2.0.0.html
