BIN := "$(shell yarn bin)"

PKGS := reliable stable flexible flexible-protractor flexible-puppeteer flexible-selenium
DIST := $(patsubst %,@pageobject/%/dist,$(PKGS))
DOCS := $(addprefix docs/api/,$(PKGS))

.PHONY: default
default: $(DOCS)

.PHONY: clean
clean:
	rm -rf @pageobject/*/dist
	rm -rf @pageobject/*/node_modules
	rm -rf docs/api/*
	rm -rf node_modules

docs/api/%: @pageobject/%/src/*.ts | $(DIST)
	rm -rf $@
	rm -rf node_modules/@types/lodash
	$(BIN)/typedoc --out $@ ./@pageobject/$*
	$(BIN)/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/**/*.html' --isRegex --verbose

@pageobject/%/dist: @pageobject/%/src/*.ts | node_modules
	$(BIN)/tsc --project @pageobject/$*
	touch $@

node_modules: package.json @pageobject/*/package.json
	yarn install --check-files
	$(BIN)/webdriver-manager update
	touch $@
