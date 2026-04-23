<div align="center">

# 📊 Статистический график профиля для GitHub

**Украсте ваш README с помощью статистики на GitHub в режиме реального времени.**

[![Powered by Vercel](https://img.shields.io/badge/powered_by-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

*Красивый и настраиваемый график, который украсит ваш профиль*

</div>

<p align="center">
  <a href="../README.md">English</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.de.md">Deutsch</a>
</p>

---


## Как мне добавить его в свой README?

### Добавьте следующий markdown код в свой README, заменив `YourUsername` на ваше имя пользователя на GitHub.


```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername)
```

### В настоящее время доступны 2 варианта отображения диаграммы: только звезды и звезды с подписчиками. Изначально отображаются только звезды. Если вы хотите добавить подписчиков, добавьте `&followers=true` в ссылку

> ⚠️ **важно**: Значения подписчиков на графике являются демонстрационными (тестовыми) значениями и могут не соответствовать вашим фактическим данным на GitHub

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&followers=true)
```

### Вы можете добавить обводку для своей диаграммы, сейчас доступны следующие цвета:

| цвет | значение | HEX |
|-------|-----------|-----|
| красный | `red` | `#f85149` |
| синий | `blue` | `#58a6ff` |
| зелёный | `green` | `#2fbb4f` |
| жёлтый | `yellow` | `#f1e05a` |
| фиолетовый | `purple` | `#a371f7` |
| розовый | `pink` | `#f778ba` |
| оранжевый | `orange` | `#ff7b72` |
| белый | `white` | `#ffffff` |
| чёрный | `black` | `#000000` |


```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=red)
```

### вы также можете ввести свой собственный цвет для обводки:

> ⚠️ **важно**: Вам нужно добавить hex цвет без `#` в начале!


```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=87a96b)
```