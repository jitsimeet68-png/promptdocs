# Развёртывание в Amvera

Этот каталог содержит минимальную инфраструктурную конфигурацию для сервиса [Amvera](https://amvera.ru), который разворачивает контейнеры по описанию в `amvera.yml`. Конфиг ориентирован на практики Amvera Container Cloud: собственный приватный registry, декларативное описание сервисов и health-check, минимально необходимые ресурсы и откат без простоя.

## Структура

- `amvera.yml` — основной манифест проекта: описание сборки Docker-образа, домена, сервиса и параметров деплоя.
- `.env.amvera.example` — шаблон переменных окружения для GitLab/GitHub CI, который прокидывает учётные данные registry и идентификаторы проекта.

## Рекомендованный процесс деплоя

1. **Соберите образ** локально или в CI: `docker build -t registry.amvera.ru/promptdocs/catalog:latest -f Dockerfile .`.
2. **Аутентифицируйтесь** в контейнерном registry Amvera (`docker login registry.amvera.ru`).
3. **Запушьте** образ: `docker push registry.amvera.ru/promptdocs/catalog:latest`.
4. **Примените манифест** через CLI/веб-интерфейс Amvera: `amvera apply -f deploy/amvera/amvera.yml`.
5. **Отслеживайте health-check** `/` (он уже настроен в Dockerfile и в `amvera.yml`).

## Настройка переменных окружения

Скопируйте `.env.amvera.example` в `.env.amvera` и заполните:

```bash
cp deploy/amvera/.env.amvera.example deploy/amvera/.env.amvera
```

- `AMVERA_PROJECT` — идентификатор проекта в панели Amvera.
- `AMVERA_REGISTRY_USER` и `AMVERA_REGISTRY_PASSWORD` — доступы к приватному registry.
- `AMVERA_DOMAIN` — выделенный под сервис домен/поддомен.

Эти значения можно подключить в CI/CD, чтобы автоматически подставлять их в `amvera.yml` (например, через templating в `envsubst`).

## Обновление конфигурации

- Меняйте количество реплик и ресурсы в блоке `services.web`.
- Для blue/green деплоя измените `deployStrategy.type` на `blueGreen`.
- При добавлении новых переменных среды добавляйте их одновременно в `.env.amvera.example` и в `amvera.yml`.

