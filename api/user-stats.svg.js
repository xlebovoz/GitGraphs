// api/user-stats.svg.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600');
  
  const { username, theme = 'dark', border, width = '700', height = '400' } = req.query;
  
  const themes = {
    dark: {
      type: 'gradient',
      gradient: ['#0d1117', '#161b22', '#0d1117'],
      text: '#f0f6fc',
      muted: '#8b949e',
      divider: '#30363d',
      footer: '#6e7681',
      borderColor: '#58a6ff',
      grid: '#21262d',
      lineStars: '#f1e05a',
      lineFollowers: '#58a6ff'
    },
    light: {
      type: 'gradient',
      gradient: ['#f6f8fa', '#ffffff', '#f6f8fa'],
      text: '#24292f',
      muted: '#57606a',
      divider: '#d0d7de',
      footer: '#8b949e',
      borderColor: '#0969da',
      grid: '#e1e4e8',
      lineStars: '#e3b341',
      lineFollowers: '#0969da'
    }
  };

  let currentTheme = themes[theme] || themes.dark;
  
  let borderColor = currentTheme.borderColor || currentTheme.text;
  let borderWidth = 0;

  if (border !== undefined) {
    borderWidth = 2;
    const colorMap = {
      'red': '#f85149', 'blue': '#58a6ff', 'green': '#2fbb4f',
      'yellow': '#f1e05a', 'purple': '#a371f7', 'pink': '#f778ba',
      'orange': '#ff7b72', 'white': '#ffffff', 'black': '#000000'
    };
    
    if (border !== '' && border !== 'true' && border !== 'false') {
      const borderLower = border.toLowerCase();
      if (colorMap[borderLower]) {
        borderColor = colorMap[borderLower];
      } else {
        let hex = border.startsWith('#') ? border.slice(1) : border;
        const hexPattern = /^[0-9A-F]{6}$|^[0-9A-F]{3}$/i;
        if (hexPattern.test(hex)) borderColor = `#${hex}`;
      }
    }
  }
  
  if (!username) {
    return res.send(errorSvg('Missing username parameter', width));
  }
  
  try {
    // Получаем данные пользователя
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error(`User "${username}" not found`);
    const userData = await userResponse.json();
    
    // Получаем звёзды по годам (реальные)
    const starsByYear = await getUserStarsByYear(username);
    
    // Получаем текущее количество подписчиков
    const currentFollowers = userData.followers;
    
    // Формируем данные по годам (последние 8 лет)
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(2015, currentYear - 8);
    const yearlyData = [];
    
    let cumulativeStars = 0;
    
    for (let year = startYear; year <= currentYear; year++) {
      cumulativeStars += starsByYear.get(year) || 0;
      
      // Подписчики - прямая линия (равномерный рост)
      const yearIndex = year - startYear;
      const totalYears = currentYear - startYear;
      const followersRatio = totalYears > 0 ? yearIndex / totalYears : 1;
      const followersValue = Math.floor(currentFollowers * followersRatio);
      
      yearlyData.push({
        year: year.toString(),
        stars: cumulativeStars,
        followers: followersValue
      });
    }
    
    // Находим максимальные значения
    const maxStars = Math.ceil(Math.max(...yearlyData.map(d => d.stars), 1) / 1000) * 1000;
    const maxFollowers = Math.ceil(Math.max(...yearlyData.map(d => d.followers), 1) / 1000) * 1000;
    
    const graphHeight = 180;
    const graphWidth = parseInt(width) - 100;
    const stepX = graphWidth / (yearlyData.length - 1 || 1);
    
    function generatePoints(dataKey) {
      let maxValue = dataKey === 'stars' ? maxStars : maxFollowers;
      return yearlyData.map((data, index) => {
        const x = 50 + (index * stepX);
        const y = 60 + graphHeight - (data[dataKey] / maxValue * graphHeight);
        return `${x},${y}`;
      }).join(' ');
    }
    
    function formatNumber(num) {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
    }
    
    // Генерируем шаги для сетки
    const starSteps = generateNiceSteps(maxStars);
    const followerSteps = generateNiceSteps(maxFollowers);
    
    let background = '';
    if (currentTheme.type === 'gradient') {
      background = `
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${currentTheme.gradient[0]}"/>
          <stop offset="50%" stop-color="${currentTheme.gradient[1]}"/>
          <stop offset="100%" stop-color="${currentTheme.gradient[2]}"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="${parseInt(width)-4}" height="${parseInt(height)-4}" fill="url(#gradient)" rx="12" 
            stroke="${borderColor}" stroke-width="${borderWidth * 2}"/>`;
    }
    
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${background}
      
      <!-- Заголовок с аватаром -->
      <g transform="translate(20, 20)">
        <image x="0" y="0" width="40" height="40" href="${userData.avatar_url}" rx="20" clip-path="url(#circle)"/>
        <circle cx="20" cy="20" r="20" fill="none" stroke="${currentTheme.borderColor}" stroke-width="2"/>
        <text x="55" y="18" font-family="Arial, sans-serif" font-size="16" fill="${currentTheme.text}" font-weight="600">
          ${userData.name || username}
        </text>
        <text x="55" y="35" font-family="Arial, sans-serif" font-size="12" fill="${currentTheme.muted}">
          @${username}
        </text>
      </g>
      
      <!-- Легенда -->
      <g transform="translate(${parseInt(width) - 160}, 20)">
        <rect x="0" y="0" width="12" height="12" fill="${currentTheme.lineStars}" rx="2"/>
        <text x="18" y="11" font-family="Arial" font-size="11" fill="${currentTheme.text}">⭐ Stars: ${formatNumber(yearlyData[yearlyData.length-1]?.stars || 0)}</text>
        
        <rect x="0" y="22" width="12" height="12" fill="${currentTheme.lineFollowers}" rx="2"/>
        <text x="18" y="33" font-family="Arial" font-size="11" fill="${currentTheme.text}">👥 Followers: ${formatNumber(currentFollowers)}</text>
      </g>
      
      <!-- Линия звёзд -->
      <text x="45" y="55" font-family="Arial" font-size="9" fill="${currentTheme.muted}" text-anchor="end">⭐</text>
      ${starSteps.map(value => {
        const y = 60 + graphHeight - (value / maxStars * graphHeight);
        return `
          <line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}" stroke="${currentTheme.grid}" stroke-width="1" stroke-dasharray="3"/>
          <text x="45" y="${y+3}" font-family="Arial" font-size="8" fill="${currentTheme.muted}" text-anchor="end">${formatNumber(value)}</text>
        `;
      }).join('')}
      <polyline points="${generatePoints('stars')}" fill="none" stroke="${currentTheme.lineStars}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Точки на линии звёзд -->
      ${yearlyData.map((data, index) => {
        const x = 50 + (index * stepX);
        const y = 60 + graphHeight - (data.stars / maxStars * graphHeight);
        return `<circle cx="${x}" cy="${y}" r="3" fill="${currentTheme.lineStars}" stroke="${currentTheme.text}" stroke-width="1.5"/>`;
      }).join('')}
      
      <!-- Линия подписчиков -->
      <text x="${parseInt(width) - 45}" y="55" font-family="Arial" font-size="9" fill="${currentTheme.muted}" text-anchor="start">👥</text>
      ${followerSteps.map(value => {
        const y = 60 + graphHeight - (value / maxFollowers * graphHeight);
        return `
          <line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}" stroke="${currentTheme.grid}" stroke-width="1" stroke-dasharray="3"/>
          <text x="${parseInt(width) - 45}" y="${y+3}" font-family="Arial" font-size="8" fill="${currentTheme.muted}" text-anchor="start">${formatNumber(value)}</text>
        `;
      }).join('')}
      <polyline points="${generatePoints('followers')}" fill="none" stroke="${currentTheme.lineFollowers}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6,4"/>
      
      <!-- Точки на линии подписчиков -->
      ${yearlyData.map((data, index) => {
        const x = 50 + (index * stepX);
        const y = 60 + graphHeight - (data.followers / maxFollowers * graphHeight);
        return `<circle cx="${x}" cy="${y}" r="3" fill="${currentTheme.lineFollowers}" stroke="${currentTheme.text}" stroke-width="1.5"/>`;
      }).join('')}
      
      <!-- Ось X -->
      <line x1="50" y1="${60 + graphHeight}" x2="${parseInt(width) - 50}" y2="${60 + graphHeight}" stroke="${currentTheme.divider}" stroke-width="1.5"/>
      
      <!-- Подписи годов -->
      ${yearlyData.map((data, index) => {
        const show = yearlyData.length <= 10 || index % Math.ceil(yearlyData.length / 8) === 0;
        const x = 50 + (index * stepX);
        return show ? `
          <text x="${x}" y="${60 + graphHeight + 15}" font-family="Arial" font-size="9" 
                fill="${currentTheme.muted}" text-anchor="middle">
            ${data.year}
          </text>
        ` : '';
      }).join('')}
      
      <!-- Подвал -->
      <text x="15" y="${parseInt(height) - 10}" font-family="Arial" font-size="9" 
            fill="${currentTheme.footer}">📊 Накопленные звёзды | 📈 Прямая линия подписчиков</text>
      
      <text x="${parseInt(width) - 15}" y="${parseInt(height) - 10}" font-family="Arial" font-size="9" 
            fill="${currentTheme.footer}" text-anchor="end">📅 ${new Date().toISOString().slice(0, 10)}</text>
    </svg>
    `;
    
    res.send(svg);
    
  } catch (error) {
    console.error('Error:', error);
    res.send(errorSvg(error.message, width));
  }
}

// Функция получения реальных звёзд по годам
async function getUserStarsByYear(username) {
  const starsByYear = new Map();
  
  // Получаем все репозитории пользователя
  const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=created`);
  const repos = await reposResponse.json();
  
  // Считаем звёзды по году создания репозитория
  repos.forEach(repo => {
    const year = new Date(repo.created_at).getFullYear();
    const currentStars = starsByYear.get(year) || 0;
    starsByYear.set(year, currentStars + repo.stargazers_count);
  });
  
  return starsByYear;
}

function generateNiceSteps(maxValue) {
  const step = Math.ceil(maxValue / 4 / 100) * 100;
  const steps = [];
  for (let i = 0; i <= 4; i++) {
    steps.push(i * step);
  }
  return steps;
}

function errorSvg(message, width) {
  const w = parseInt(width) || 700;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="200">
    <rect x="2" y="2" width="${w-4}" height="196" fill="#f85149" rx="12" opacity="0.9"/>
    <text x="${w/2}" y="80" font-family="Arial" font-size="16" fill="white" text-anchor="middle" font-weight="600">
      ❌ Ошибка
    </text>
    <text x="${w/2}" y="110" font-family="Arial" font-size="13" fill="rgba(255,255,255,0.9)" text-anchor="middle">
      ${message}
    </text>
    <text x="${w/2}" y="140" font-family="Arial" font-size="11" fill="rgba(255,255,255,0.7)" text-anchor="middle">
      Пример: ?username=vercel
    </text>
    <text x="${w-15}" y="185" font-family="Arial" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="end">
      ${new Date().toISOString().slice(0, 10)}
    </text>
  </svg>
  `;
}