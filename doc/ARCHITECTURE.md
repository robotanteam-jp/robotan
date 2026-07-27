# Robotan Architecture

## Overview

Robotan is an AI companion that supports the user's mental well-being.

The application consists of four layers.

Browser (Next.js)
│
▼
API Route (/api/chat)
│
▼
Gemini API
│
▼
Robotan System Prompt


---

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

Responsible for:

- UI
- Chat
- Robot animation
- Status display
- Mission display

---

## Backend

API Route

/api/chat

Responsibilities:

- Receive user message
- Build system prompt
- Send request to Gemini
- Parse response
- Return Robotan response

---

## AI Layer

Gemini generates:

- Reply
- Power
- Fuel
- Status
- Mode
- Expression
- Mission
- Zipper

The AI follows the specifications defined in:

- SKILL.md
- SAFETY.md
- DIALOGUE.md
- POWER-FUEL.md
- STATUS.md
- MISSION.md
- EXPRESSION.md
- ZIPPER.md
- MODE.md
- examples.md

---

## Assets

public/

robotan/

Contains:

- Robot images
- Expressions
- Front / Back
- Zipper variations

---

## Deployment

Production:

- Vercel

AI:

- Gemini API

---

## Future Architecture

Planned:

- Long-term memory database
- User authentication
- Claude support
- Live2D support


## Design Philosophy

Robotan is not designed to solve problems.

Robotan is designed to stay beside the user,
protect them,
and support one small step at a time.