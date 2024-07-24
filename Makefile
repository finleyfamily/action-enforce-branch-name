CI := $(if $(CI),yes,no)
SHELL := /bin/bash

ifeq ($(CI), yes)
	POETRY_OPTS = "-v"
	PRE_COMMIT_OPTS = --show-diff-on-failure --verbose
endif

help: ## show this message
	@awk \
		'BEGIN {FS = ":.*##"; printf "\nUsage: make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' \
		$(MAKEFILE_LIST)

build: ## build action
	@npm run-script bundle

fix: fix-prettier run-pre-commit ## run all automatic fixes

fix-prettier: ## run prettier
	@npm run-script format:write

lint: lint-prettier lint-eslint ## run all linters

lint-eslint: ## run eslint
	@npm run-script lint

lint-prettier: ## run prettier (check only)
	@npm run-script format:check

run-pre-commit: ## run pre-commit for all files
	@poetry run pre-commit run $(PRE_COMMIT_OPTS) \
		--all-files \
		--color always

setup: setup-poetry setup-pre-commit setup-npm ## setup development environment

setup-npm: ## install node dependencies with npm
	@npm ci

setup-poetry: ## setup python virtual environment
	@if [[ -d .venv ]]; then \
		poetry run python -m pip --version >/dev/null 2>&1 || rm -rf ./.venv/* ./.venv/.*; \
	fi
	@poetry check
	@poetry install $(POETRY_OPTS) --sync

setup-pre-commit: ## install pre-commit git hooks
	@poetry run pre-commit install

spellcheck: ## run cspell
	@echo "Running cSpell to checking spelling..."
	@npm exec --no -- cspell lint . \
		--color \
		--config .vscode/cspell.json \
		--dot \
		--gitignore \
		--must-find-files \
		--no-progress \
		--relative \
		--show-context

test: ## run tests
	@npm run-script test
	@npm run-script coverage
