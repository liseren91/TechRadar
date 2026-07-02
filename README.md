# Tech Evolution Radar (TechRadar)

Дашборд для отслеживания технологических сигналов: как «шум» превращается в тренды. Приложение агрегирует данные из открытых источников, классифицирует их по категориям и стадиям зрелости, выявляет аномалии и показывает эволюционные цепочки технологий.

Доступны публичный веб-дашборд (без входа и серверного хранилища) и расширение для Chrome, которое заменяет страницу новой вкладки.

## Возможности

- **Tech Radar** — интерактивная scatter-карта сигналов по категориям и стадиям зрелости
- **Tech Feed** — лента событий с фильтрацией по источникам, категориям и языку
- **AI Insight** — автоматическая сводка по текущим данным, трендам и аномалиям
- **Evolution Chains** — цепочки развития технологий от research до mass-market
- **Anomaly Detection** — выявление необычных всплесков активности
- **Daily Digest** — ежедневный AI-дайджест блогов (Anthropic, OpenAI, DeepMind и др.)
- **Мультиязычность** — интерфейс и контент на английском и русском
- **Chrome Extension** — та же аналитика на странице новой вкладки

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React 19, TanStack Router, TanStack Query, Tailwind CSS 4, shadcn/ui, Recharts, Motion |
| Backend | TanStack Start (SSR), server functions |
| Runtime | Bun, Vite |
| AI | Anthropic API (генерация дайджеста в CI) |
| Тесты | Vitest, Testing Library |

## Быстрый старт

### Требования

- [Bun](https://bun.sh/) (рекомендуется) или Node.js 22+

### Установка

```bash
bun install
cp .env.example .env
# Заполните переменные окружения (см. ниже)
```

### Разработка

```bash
bun run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

### Production

```bash
bun run build
bun run start
```

Предпросмотр production-сборки без отдельного сервера:

```bash
bun run serve
```

## Переменные окружения

Дашборд публичный и не требует секретов для запуска. Опционально скопируйте `.env.example` в `.env`:

| Переменная | Описание |
|------------|----------|
| `VITE_INSTRUMENTATION_SCRIPT_SRC` | URL скрипта аналитики (опционально) |

### CI / генерация дайджеста

| Переменная | Где используется |
|------------|------------------|
| `ANTHROPIC_API_KEY` | GitHub Actions secret для `bun run generate:feed` |

> **Важно:** `ANTHROPIC_API_KEY` не должен попадать в репозиторий, клиентский код или артефакты расширения. Используется только в CI.

## Источники данных

### Live-парсеры (server functions)

| Источник | Что собирается |
|----------|----------------|
| GitHub | Репозитории по темам (stars, forks, topics) |
| arXiv | Научные препринты |
| Hacker News | Популярные истории |
| Semantic Scholar | Высокоцитируемые статьи |
| PubMed | Биомедицинские исследования |
| HAL | Французский научный архив |
| CiNii / CNKI | Японские и китайские публикации |

Данные кэшируются на сервере. Панель **Parser Control** на дашборде позволяет принудительно обновить кэш и посмотреть метрики по источникам.

### Статический дайджест

Скрипт `generate:feed` собирает RSS/Atom-ленты AI-блогов, суммаризирует посты через Anthropic и сохраняет результат в `public/data/`:

- `digest.json` — последние новости с переводом EN/RU
- `trends.json` — тренды по темам
- `history.json` — исторические снимки для momentum-анализа

## Категории и стадии

**Категории:** AI, Energy, Biotech, Robotics, Web3, Quantum, Space, Cybersecurity

**Стадии зрелости:** Research → Prototype → Early Adopter → Mass Market

## Chrome Extension

Расширение находится в `chrome-extension/` и заменяет страницу новой вкладки (`chrome_url_overrides.newtab`).

### Установка вручную

1. Откройте `chrome://extensions/`
2. Включите «Режим разработчика»
3. Нажмите «Загрузить распакованное расширение» и выберите папку `chrome-extension/`

Или скачайте ZIP через баннер на дашборде (server function `downloadExtensionFn`).

## Структура проекта

```
TechRadar/
├── chrome-extension/       # Расширение для Chrome
├── public/data/              # Статический дайджест (генерируется CI)
├── scripts/
│   ├── generate-feed/        # Пайплайн дайджеста и трендов
│   └── check-no-secrets.ts   # Проверка утечки секретов в артефактах
├── src/
│   ├── components/
│   │   ├── dashboard/        # UI дашборда (Radar, Feed, AI Insight…)
│   │   └── ui/               # shadcn/ui компоненты
│   ├── hooks/                # React hooks (feed, anomaly)
│   ├── lib/                  # Категории, i18n, утилиты
│   ├── routes/               # File-based routing (TanStack Router)
│   └── server/
│       ├── functions/        # Server functions (feed, translation…)
│       └── utils/            # Кэш, fetch helpers
├── server.ts                 # Production-сервер на Bun
└── .github/workflows/        # CI (generate-feed)
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `bun run dev` | Dev-сервер (Vite, порт 3000) |
| `bun run start` | Production-сервер (Bun) |
| `bun run build` | Сборка клиента и сервера |
| `bun run test` | Запуск тестов (Vitest) |
| `bun run lint` | ESLint |
| `bun run format` | Prettier (запись) |
| `bun run format:check` | Prettier (проверка) |
| `bun run generate:routes` | Регенерация route tree |
| `bun run generate:feed` | Генерация digest/trends/history |
| `bun run check:secrets` | Проверка секретов в data-файлах |
| `bun run clean` | Очистка артефактов сборки |

## CI: ежедневный дайджест

Workflow `.github/workflows/generate-feed.yml` запускается по расписанию (~06:17 UTC) и вручную через `workflow_dispatch`:

1. Устанавливает зависимости
2. Запускает `bun run generate:feed` с `ANTHROPIC_API_KEY`
3. Проверяет отсутствие секретов в артефактах
4. Коммитит обновлённые `public/data/*.json`

Для настройки секрета:

```bash
gh secret set ANTHROPIC_API_KEY
```

## Разработка

### Маршруты

File-based routing в `src/routes/`:

- `_public/` — публичный дашборд (`/`)
- `_api/` — API-эндпоинты

### shadcn/ui

Добавление компонентов:

```bash
pnpx shadcn@latest add button
```

### Тесты

```bash
bun run test
```

Тесты покрывают server functions, generate-feed pipeline и проверку секретов.

## Learn More

- [TanStack Router](https://tanstack.com/router)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
