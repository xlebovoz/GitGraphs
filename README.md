<div align="center">

# 📊 Statistical graph of the GitHub profile

**Elevate your README with real-time GitHub stats.**

[![Powered by Vercel](https://img.shields.io/badge/powered_by-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

*A beautiful and customizable graph that will beautify your profile*

</div>

---




## How do I add it to my README?

### Add the following markdown to your README, replacing `YourUsername` with your GitHub username.


```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername)
```

### There are currently 2 chart display options available: stars only and stars with subscribers. Initially, only stars are displayed. If you want to add subscribers, add `&followers=true` in the link

> ⚠️ **important**: The subscriber values on the graph are demo (test) values and may not correspond to your actual data on GitHub

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&followers=true)
```

### You can add an outline for your chart, the following colors are available now:

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

### you can also enter your own color for the outline:

> ⚠️ **important**: You need to add a hex color without # at the beginning!


```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=87a96b)
```