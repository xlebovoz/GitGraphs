<div align="center">

# 📊 Gráfico de Estadísticas de Perfil de GitHub

**Eleva tu README con estadísticas de GitHub en tiempo real.**

[![Desarrollado por Vercel](https://img.shields.io/badge/powered_by-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

*Un gráfico hermoso y personalizable para mejorar tu perfil de GitHub.*

</div>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README-langs/README.ru.md">Русский</a> |
  <a href="README-langs/README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a>
</p>

---

## Cómo agregarlo a tu README

Agrega el siguiente markdown a tu README, reemplazando `TuUsuario` con tu nombre de usuario de GitHub.

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=TuUsuario)
```

Actualmente hay 2 opciones de visualización disponibles: solo estrellas, y estrellas con seguidores. De forma predeterminada, solo se muestran las estrellas. Para incluir seguidores, agrega `&followers=true` a la URL.

> ⚠️ **Importante**: Los valores de seguidores mostrados en el gráfico son valores de demostración y pueden no reflejar tus datos reales de GitHub.

```md
![GitHub Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=TuUsuario&followers=true)
```

## Agregar un color de borde

Puedes agregar un contorno de color a tu gráfico. Los siguientes colores están disponibles actualmente:

| Color | Parámetro | HEX |
|-------|-----------|-----|
| Rojo | `red` | `#f85149` |
| Azul | `blue` | `#58a6ff` |
| Verde | `green` | `#2fbb4f` |
| Amarillo | `yellow` | `#f1e05a` |
| Morado | `purple` | `#a371f7` |
| Rosa | `pink` | `#f778ba` |
| Naranja | `orange` | `#ff7b72` |
| Blanco | `white` | `#ffffff` |
| Negro | `black` | `#000000` |

```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=TuUsuario&border=red)
```

También puedes usar un color hexadecimal personalizado para el borde:

> ⚠️ **Importante**: Ingresa el valor hexadecimal sin el símbolo `#`.

```md
![Stats](https://git-graphs.vercel.app/api/user-stats.svg?username=TuUsuario&border=87a96b)
```
