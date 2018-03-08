BIN := "$(shell yarn bin)"

PKGS := reliable stable flexible flexible-protractor flexible-puppeteer flexible-selenium
DIST := $(patsubst %,@pageobject/%/dist,$(PKGS))
DOCS := $(addprefix docs/api/,$(PKGS))

.PHONY: default
default: docs

.PHONY: clean
clean:
	rm -rf @pageobject/*/dist
	rm -rf docs/api/*

.PHONY: dist
dist: $(DIST)

.PHONY: docs
docs: $(DOCS)

.PHONY: install
install: node_modules node_modules/webdriver-manager/selenium

@pageobject/%/dist: @pageobject/%/src/*.ts | install
	$(BIN)/tsc --project @pageobject/$*
	touch $@

docs/api/%: @pageobject/%/src/*.ts | dist
	rm -rf $@
	rm -rf node_modules/@types/lodash
	$(BIN)/typedoc --out $@ ./@pageobject/$*
	$(BIN)/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/api/$*/**/*.html' --isRegex --verbose

node_modules: package.json @pageobject/*/package.json
	yarn install
	touch $@

node_modules/webdriver-manager/selenium:
	$(BIN)/webdriver-manager update
