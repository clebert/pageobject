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
