SOURCES ?= lib/*.js
TESTS ?= test/*.test.js

test: test-mocha
test-cov: test-istanbul-mocha
view-cov: view-istanbul-report
lint: lint-jshint


# ==============================================================================
# Node.js
# ==============================================================================
include support/mk/node.mk
include support/mk/test/mocha.mk
include support/mk/test/istanbul.mk

# ==============================================================================
# Analysis
# ==============================================================================
include support/mk/analysis/notes.mk
include support/mk/analysis/jshint.mk

# ==============================================================================
# Reports
# ==============================================================================
include support/mk/reports/coveralls.mk

# ==============================================================================
# Continuous Integration
# ==============================================================================
submit-cov-to-coveralls: submit-istanbul-lcov-to-coveralls

# Travis CI
ci-travis: test test-cov

# ==============================================================================
# Clean
# ==============================================================================
clean:
	rm -rf build
	rm -rf reports

clobber: clean clobber-node


.PHONY: test test-cov view-cov lint submit-cov-to-coveralls ci-travis clean clobber
