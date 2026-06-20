.PHONY: install test update clean lint

install:
	pip install -r requirements.txt

test:
	python tests/test_parser.py
	python tests/test_formatter.py
	python tests/test_verifier.py

update:
	python scripts/update.py

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

lint:
	python -m py_compile scripts/*.py tests/*.py
