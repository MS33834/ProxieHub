.PHONY: install test test-backend update verify clean lint lint-web build-web run-backend deploy

install:
	pip3 install -r requirements.txt
	pip3 install -r backend/requirements.txt

test:
	python3 tests/test_utils.py
	python3 tests/test_parser.py
	python3 tests/test_formatter.py
	python3 tests/test_verifier.py

test-backend:
	cd backend && python3 tests/test_api.py

update:
	python3 scripts/update.py

verify:
	PROXIEHUB_VERIFY_NODES=true python3 scripts/update.py --verify

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

lint:
	python3 -m py_compile scripts/*.py tests/*.py
	python3 -m ruff check scripts tests

lint-web:
	cd web && npm run lint

build-web:
	cd web && npm run build

run-backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

deploy:
	cd backend && docker compose up -d --build

