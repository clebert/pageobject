BIN := "$(shell yarn bin)"
PKGS := base web protractor puppeteer selenium-webdriver todomvc

.PHONY: docs
docs: $(addprefix docs/api/,$(PKGS)) docs/index.md

.PHONY: dist
dist: $(patsubst %,@pageobject/%/dist,$(PKGS))

.PHONY: clean
clean:
	rm -rf @pageobject/*/dist
	rm -rf docs/api/*

@pageobject/%/dist: @pageobject/%/src/*.ts @pageobject/%/src/tests/*.ts | node_modules node_modules/webdriver-manager/selenium
	$(BIN)/tsc --project @pageobject/$*
	touch $@

docs/api/%: @pageobject/%/README.md @pageobject/%/src/*.ts docs/images/* typedoc.js | dist
	rm -rf $@
	rm -rf node_modules/@types/lodash
	$(BIN)/typedoc --out $@ --readme @pageobject/$*/README.md ./@pageobject/$*
	$(BIN)/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/api/$*/**/*.html' --isRegex --verbose
	$(BIN)/replace-in-file '/\/docs\/images\//g' '/images/' 'docs/api/$*/**/*.html' --isRegex --verbose

docs/index.md: README.md
	cp $< $@

node_modules: package.json @pageobject/*/package.json
	yarn install --check-files
	touch $@

node_modules/webdriver-manager/selenium:
	$(BIN)/webdriver-manager update --gecko false
