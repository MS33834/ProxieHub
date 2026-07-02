# ProxieHub backend Docker image
FROM python:3.12-slim AS base

LABEL org.opencontainers.image.title="ProxieHub Backend"
LABEL org.opencontainers.image.source="https://github.com/MS33834/ProxieHub"

# Install curl (needed by the crawler fallback) and clean up.
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install.
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy the project root (scripts/, config/, backend/).
# The pipeline imports from scripts/ so we need the full tree.
COPY . /app

WORKDIR /app/backend

# Expose the FastAPI port.
EXPOSE 8000

# Run with gunicorn + uvicorn workers in production.
CMD ["gunicorn", "app.main:app", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--workers", "2", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120"]
