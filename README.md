# LINE Event Module

A modular and customizable framework for LINE marketing campaigns, ideal for brand promotions and interactive events.

---

## Key Features

* **Modular Activity Flow**: Easy to replicate three-step process: Home (`/start`) → Game Interaction (`/playing`) → Result (`/result`).
* **Centralized Control**: All configurations managed via the `GameConfig` database, enabling easy updates without changing the source code.
* **Extensible Game Modes**:
  * 🖼️ **Card Maker**: Generate and share custom image cards.
  * 🎮 **Scroll Game**: Interactive gameplay with scoring and life tracking.
  * 🎰 **Spin Wheel**: Prize distribution with discount code delivery.
* **Centralized Resource Management**: Manage all images, texts, and discount codes through a single `/configs.ts` file.

---

## Tech Stack

* **Frontend**: Next.js 15, React, TailwindCSS, Konva.js
* **Backend**: Next.js API Routes
* **Database**: Prisma ORM with PostgreSQL
* **Authentication**: Clerk
* **Styling**: TailwindCSS
