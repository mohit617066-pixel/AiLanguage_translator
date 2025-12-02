# Language Translator

**A fast, modular language translation API using FastAPI and Hugging Face MarianMT.**

## Overview

This project provides a backend API for translating text between languages, detecting language, and (optionally) converting translated text to speech. It is intended as a lightweight microservice you can connect to any frontend (web, mobile, or CLI).

Key components:

* FastAPI server exposing translation and utility endpoints
* Hugging Face `MarianMTModel` + tokenizer for translation
* Optional TTS integration (local or cloud provider)
* CORS-enabled for easy frontend connection

---

## Features

* Translate text between supported language pairs
* Detect source language
* Optional text-to-speech endpoint (generate audio from translated text)
* Simple JSON API and example `curl` usage

---

## Requirements

* Python 3.10+
* pip
* (Optional) GPU and PyTorch with CUDA for faster model inference

---

## Installation & Setup

1. Clone the repo:

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

> If you don't have a `requirements.txt`, typical dependencies are:
>
> ```text
> fastapi
> uvicorn[standard]
> transformers
> torch
> sentencepiece
> python-multipart  # if you accept file uploads
> pydantic
> aiofiles  # optional
> pyngrok  # optional, for exposing local server
> ```

---

## Environment variables

Create a `.env` (or set in your environment) with values like:

```
PORT=8000
MODEL_NAME=Helsinki-NLP/opus-mt-en-de  # default model (replace with desired model)
TTS_PROVIDER=none  # or `gtts`, `coqui`, `aws-polly`, etc.
NGROK_AUTHTOKEN=  # if you use pyngrok, set your authtoken
```

---

## Running the API

Run the server locally with Uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port ${PORT:-8000}
```

If you're using Google Colab / remote dev and want a public URL, set up `pyngrok` and provide your ngrok authtoken (see ngrok docs). Note: ngrok now requires a verified account and authtoken; if you get `authentication failed` errors, sign up at ngrok and run `ngrok authtoken <token>`.

---

## API Endpoints (example)

### POST /translate

Request body:

```json
{
  "text": "Hello world",
  "source": "en",
  "target": "es"
}
```

Response:

```json
{
  "translated_text": "Hola mundo",
  "source_language": "en",
  "target_language": "es"
}
```

### POST /detect

Request body:

```json
{ "text": "Bonjour" }
```

Response:

```json
{ "language": "fr", "confidence": 0.98 }
```

### POST /tts (optional)

Request body:

```json
{ "text": "Hola mundo", "voice": "alloy" }
```

Response: audio file (or URL) depending on implementation.

---

## Example: simple client `curl` request

```bash
curl -X POST "http://localhost:8000/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"How are you?","source":"en","target":"hi"}'
```

---

## Frontend tips

* Enable CORS for the frontend origin during development. The server in this repo allows `*` by default for convenience; restrict in production.
* For production, serve via a process manager (systemd, Docker, or Gunicorn/Uvicorn behind nginx).

---

## Troubleshooting

* `RuntimeWarning: coroutine 'Server.serve' was never awaited` — make sure you run Uvicorn using the CLI (e.g. `uvicorn main:app`) rather than trying to call the server serve coroutine directly in an async environment.
* `ngrok authentication failed` — you need to register an ngrok account and set your authtoken.
* `500 Internal Server Error` — check your logs; common causes: model path incorrect, missing env vars, or model loading failing due to missing packages.
* `argument should be a str or os.PathLike, not 'NoneType'` — ensure file paths and env vars are set correctly before passing to file-handling code.

---

## Contributing

PRs welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with tests and a clear description

---

## License

Choose a license (MIT, Apache-2.0, etc.) and add a `LICENSE` file.

---

## Contact

Maintainer: Mohit Kumar
Email: [mohit617066@gmail.com](mailto:mohit617066@gmail.com)

---

If you'd like, I can also:

* generate a `requirements.txt`
* create a Dockerfile and `docker-compose.yml`
* provide example frontend (React) that connects to the API
