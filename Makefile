BIN := "$(shell yarn bin)"
PKGS := reliable stable flexible flexible-protractor flexible-puppeteer flexible-selenium

.PHONY: docs
docs: $(addprefix docs/api/,$(PKGS))

.PHONY: dist
dist: $(patsubst %,@pageobject/%/dist,$(PKGS))

.PHONY: clean
clean:
	rm -rf @pageobject/*/dist
	rm -rf docs/api/*

@pageobject/%/dist: @pageobject/%/src/*.ts | node_modules
	$(BIN)/tsc --project @pageobject/$*
	touch $@

docs/api/%: @pageobject/%/src/*.ts | dist
	rm -rf $@
	rm -rf node_modules/@types/lodash
	$(BIN)/typedoc --out $@ ./@pageobject/$*
	$(BIN)/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/api/$*/**/*.html' --isRegex --verbose

node_modules: package.json @pageobject/*/package.json
	yarn install --check-files
	$(BIN)/webdriver-manager update --gecko false
	touch $@
