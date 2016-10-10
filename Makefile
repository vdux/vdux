#
# Vars
#

BIN = ./node_modules/.bin
.DEFAULT_GOAL := all

#
# Tasks
#

node_modules: package.json
	@npm install
	@touch node_modules

test: $(src) $(tests) node_modules
	@NODE_ENV=development hihat test/*.js -- \
		--debug \
		-t babelify \
		-p tap-dev-tool

validate: node_modules
	@${BIN}/standard

all: validate test

#
# Phony
#

.PHONY: test validate
