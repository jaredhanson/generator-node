include node_modules/@jaredhanson/make-node/main.mk


SOURCES = app/*.js
TESTS = test/*.test.js

LCOVFILE = ./reports/coverage/lcov.info

MOCHAFLAGS = --require ./test/bootstrap/node


view-docs:
	open ./docs/index.html

view-cov:
	open ./reports/coverage/lcov-report/index.html

clean: clean-docs clean-cov
	-rm -r $(REPORTSDIR)

clobber: clean
	-rm -r node_modules


.PHONY: clean clobber
