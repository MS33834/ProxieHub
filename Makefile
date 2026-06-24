.PHONY: install test update clean lint lint-web build-web

install:
	pip install -r requirements.txt

test:
	python tests/test_utils.py
	python tests/test_parser.py
	python tests/test_formatter.py
	python tests/test_verifier.py

update:
	python scripts/update.py

verify:
	PROXIEHUB_VERIFY_NODES=true python scripts/update.py --verify

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

lint:
	python -m py_compile scripts/*.py tests/*.py
	python -m ruff check scripts tests

lint-web:
	cd web && npm run lint

build-web:
	cd web && npm run build
