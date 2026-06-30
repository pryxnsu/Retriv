# Retriv

![Retriv Image](public/og-image.png)

Retriv is a no-code platform that enables businesses to deploy AI chatbots trained on their website content. It automatically crawls and indexes website pages, generates embeddings, and provides an embeddable chat widget with real-time AI responses.

## Features

- **No-Code AI Agent Creation** – Create AI agents by simply submitting a website URL.
- **Automated Website Crawling** – Crawl and extract content from website pages for knowledge ingestion.
- **Embeddable Chat Widget** – Integrate AI agents into any website using a single script.
- **Streaming AI Responses** – Deliver real-time streamed responses for a smooth chat experience.
- **Knowledge-Based Answers** – Generate responses using retrieved website content with source references.
- **Analytics Dashboard** – Monitor conversations, response quality, and agent usage.
- **Customizable Agents** – Configure agent behavior and settings for different use cases.

## Architecture & Tech Stack

Retriv is built as a multi-service architecture, where each service is responsible for a specific part of the AI pipeline.

| Repository | Description |
|------------|-------------|
| **[Frontend](https://github.com/pryxnsu/Retriv)** | Next.js dashboard, authentication, billing, and chatbot management (this repository). |
| **[Node.js API](https://github.com/pryxnsu/retriv-nodejs-api)** | REST API, authentication, agent management, chat APIs, and job orchestration. |
| **[Python Worker](https://github.com/pryxnsu/retriv-python)** | Website crawling, document processing, embedding generation, and vector indexing. |

### Tech Stack

- **Frontend:** Next.js, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, Python, FastAPI
- **Database:** PostgreSQL, Prisma
- **Vector Database:** Qdrant
- **Queue & Cache:** Redis
- **AI:** LangChain, Langfuse
- **Web Crawling:** BeautifulSoup

## Demo

[![Watch Demo](public/thumbnail.png)](https://youtu.be/_V30qqdX1p4)

The chatbot is embedded on my portfolio website, where it answers questions using content indexed from the website itself.

## Architecture

The diagram below illustrates the high-level workflow for agent creation and chat requests.

![Architecture Design](public/architecture.png)