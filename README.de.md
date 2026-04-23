<div align="center">

# 📊 GitHub Profilstatistik-Graph

**Verbessere dein README mit Echtzeit-GitHub-Statistiken.**

[![Powered by Vercel](https://img.shields.io/badge/powered_by-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

*Ein schöner und anpassbarer Graph zur Verbesserung deines GitHub-Profils.*

</div>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.de.md">Deutsch</a>
</p>

---

## Wie man es zum README hinzufügt

### Füge den folgenden Markdown-Code zu deinem README hinzu und ersetze `YourUsername` durch deinen GitHub-Benutzernamen.

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername)
```
Es gibt derzeit 2 Anzeigeoptionen: nur Sterne oder Sterne mit Followern. Standardmäßig werden nur Sterne angezeigt. Um Follower einzuschließen, füge &followers=true zur URL hinzu.

> ⚠️ **Wichtig**: Die im Graph angezeigten Follower-Werte sind Demo-Werte und entsprechen möglicherweise nicht deinen echten GitHub-Daten.

```
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&followers=true)
```
## Rahmenfarbe hinzufügen
### Du kannst deinem Diagramm eine farbige Umrandung hinzufügen. Folgende Farben sind verfügbar:

| Farbe | Parameter | HEX |
|-------|-----------|-----|
| Rot | `red` | `#f85149` |
| Blau | `blue` | `#58a6ff` |
| Grün | `green` | `#2fbb4f` |
| Gelb | `yellow` | `#f1e05a` |
| Lila | `purple` | `#a371f7` |
| Pink | `pink` | `#f778ba` |
| Orange | `orange` | `#ff7b72` |
| Weiß | `white` | `#ffffff` |
| Schwarz | `black` | `#000000` |


```
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=red)
```
Du kannst auch eine benutzerdefinierte HEX-Farbe verwenden:

> ⚠️ **Wichtig**: Gib den HEX-Wert ohne das `#` Symbol ein.

```
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=YourUsername&border=87a96b)
```