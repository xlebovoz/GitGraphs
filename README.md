<div align="center">

# 📊 GitHub Profile Statistics Graph

**Elevate your README with real-time GitHub stats.**

[![Powered by Vercel](https://img.shields.io/badge/powered_by-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

*A beautiful and customizable graph to enhance your GitHub profile.*

</div>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README-langs/README.ru.md">Русский</a> |
  <a href="README-langs/README.de.md">Deutsch</a>
</p>

---

## How to add it to your README

Add the following markdown to your README, replacing `YourUsername` with your GitHub username.

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername)
```

There are currently 2 display options available: stars only, and stars with followers. By default, only stars are shown. To include followers, add `&followers=true` to the URL.

> ⚠️ **Important**: The follower values displayed on the graph are demo values and may not reflect your actual GitHub data.

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&followers=true)
```

## Adding a border color

You can add a colored outline to your chart. The following colors are currently available:

| Color | Parameter | HEX |
|-------|-----------|-----|
| Red | `red` | `#f85149` |
| Blue | `blue` | `#58a6ff` |
| Green | `green` | `#2fbb4f` |
| Yellow | `yellow` | `#f1e05a` |
| Purple | `purple` | `#a371f7` |
| Pink | `pink` | `#f778ba` |
| Orange | `orange` | `#ff7b72` |
| White | `white` | `#ffffff` |
| Black | `black` | `#000000` |

```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=red)
```

You can also use a custom hex color for the border:

> ⚠️ **Important**: Enter the hex value without the `#` symbol.

```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=87a96b)
```