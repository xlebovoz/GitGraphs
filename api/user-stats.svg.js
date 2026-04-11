// api/user-stats.svg.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600'); // 6 часов
  
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
      lineFollowers: '#58a6ff',
      lineCommits: '#2fbb4f',
      areaStars: 'rgba(241, 224, 90, 0.05)',
      areaFollowers: 'rgba(88, 166, 255, 0.05)',
      areaCommits: 'rgba(47, 187, 79, 0.05)'
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
      lineFollowers: '#0969da',
      lineCommits: '#1a7f37',
      areaStars: 'rgba(227, 179, 65, 0.05)',
      areaFollowers: 'rgba(9, 105, 218, 0.05)',
      areaCommits: 'rgba(26, 127, 55, 0.05)'
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
    
    // Получаем динамику по годам
    const yearlyData = await getUserYearlyStats(username);
    
    // Находим максимальные значения для масштабирования
    const maxStars = Math.ceil(Math.max(...yearlyData.map(d => d.stars), 1) / 1000) * 1000;
    const maxFollowers = Math.ceil(Math.max(...yearlyData.map(d => d.followers), 1) / 500) * 500;
    const maxCommits = Math.ceil(Math.max(...yearlyData.map(d => d.commits), 1) / 500) * 500;
    
    // Генерируем красивые значения для Y оси
    const starSteps = generateNiceSteps(maxStars, 5);
    const followerSteps = generateNiceSteps(maxFollowers, 5);
    const commitSteps = generateNiceSteps(maxCommits, 5);
    
    const graphHeight = 180;
    const graphWidth = parseInt(width) - 100;
    const stepX = graphWidth / (yearlyData.length - 1 || 1);
    
    function generatePoints(dataKey) {
      let maxValue = dataKey === 'stars' ? maxStars : (dataKey === 'followers' ? maxFollowers : maxCommits);
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
      
      <!-- Заголовок -->
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
      <g transform="translate(${parseInt(width) - 220}, 20)">
        <rect x="0" y="0" width="12" height="12" fill="${currentTheme.lineStars}" rx="2"/>
        <text x="18" y="11" font-family="Arial" font-size="11" fill="${currentTheme.text}">⭐ Stars: ${formatNumber(userData.public_repos > 0 ? yearlyData[yearlyData.length-1]?.stars || 0 : 0)}</text>
        
        <rect x="0" y="20" width="12" height="12" fill="${currentTheme.lineFollowers}" rx="2"/>
        <text x="18" y="31" font-family="Arial" font-size="11" fill="${currentTheme.text}">👥 Followers: ${formatNumber(userData.followers)}</text>
        
        <rect x="0" y="40" width="12" height="12" fill="${currentTheme.lineCommits}" rx="2"/>
        <text x="18" y="51" font-family="Arial" font-size="11" fill="${currentTheme.text}">💻 Commits: ${formatNumber(yearlyData[yearlyData.length-1]?.commits || 0)}</text>
      </g>
      
      <!-- График звёзд -->
      <text x="50" y="58" font-family="Arial" font-size="10" fill="${currentTheme.muted}">⭐ Звёзды</text>
      
      <!-- Сетка для звёзд -->
      <g stroke="${currentTheme.grid}" stroke-width="1" stroke-dasharray="3">
        ${starSteps.map(value => {
          const y = 60 + graphHeight - (value / maxStars * graphHeight);
          return `<line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}"/>`;
        }).join('')}
      </g>
      
      ${starSteps.map(value => {
        const y = 60 + graphHeight - (value / maxStars * graphHeight);
        return `<text x="45" y="${y+3}" font-family="Arial" font-size="8" fill="${currentTheme.muted}" text-anchor="end">${formatNumber(value)}</text>`;
      }).join('')}
      
      <!-- Линия звёзд -->
      <polyline points="${generatePoints('stars')}" fill="none" stroke="${currentTheme.lineStars}" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- График подписчиков -->
      <text x="${parseInt(width)/2}" y="58" font-family="Arial" font-size="10" fill="${currentTheme.muted}" text-anchor="middle">👥 Подписчики</text>
      
      <!-- Сетка для подписчиков -->
      <g stroke="${currentTheme.grid}" stroke-width="1" stroke-dasharray="3">
        ${followerSteps.map(value => {
          const y = 60 + graphHeight - (value / maxFollowers * graphHeight);
          return `<line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}"/>`;
        }).join('')}
      </g>
      
      <!-- Линия подписчиков -->
      <polyline points="${generatePoints('followers')}" fill="none" stroke="${currentTheme.lineFollowers}" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- График коммитов -->
      <text x="${parseInt(width) - 50}" y="58" font-family="Arial" font-size="10" fill="${currentTheme.muted}" text-anchor="end">💻 Коммиты</text>
      
      <!-- Сетка для коммитов -->
      <g stroke="${currentTheme.grid}" stroke-width="1" stroke-dasharray="3">
        ${commitSteps.map(value => {
          const y = 60 + graphHeight - (value / maxCommits * graphHeight);
          return `<line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}"/>`;
        }).join('')}
      </g>
      
      <!-- Линия коммитов -->
      <polyline points="${generatePoints('commits')}" fill="none" stroke="${currentTheme.lineCommits}" stroke-width="2.5" stroke-linecap="round"/>
      
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
      
      <!-- Дата обновления -->
      <text x="${parseInt(width) - 15}" y="${parseInt(height) - 10}" font-family="Arial" font-size="9" 
            fill="${currentTheme.footer}" text-anchor="end">
        📅 ${new Date().toISOString().slice(0, 10)}
      </text>
    </svg>
    `;
    
    res.send(svg);
    
  } catch (error) {
    console.error('Error:', error);
    res.send(errorSvg(error.message, width));
  }
}

// Функция получения годовой статистики пользователя
async function getUserYearlyStats(username) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5; // Последние 5 лет
  const yearlyData = [];
  
  // Получаем все репозитории пользователя
  const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  const repos = await reposResponse.json();
  
  // Считаем звёзды по годам
  const starsByYear = new Map();
  const commitsByYear = new Map();
  const followersByYear = new Map();
  
  // Инициализируем года
  for (let year = startYear; year <= currentYear; year++) {
    starsByYear.set(year, 0);
    commitsByYear.set(year, 0);
    followersByYear.set(year, 0);
  }
  
  // Считаем звёзды у репозиториев (созданных в определённый год)
  repos.forEach(repo => {
    const createdAt = new Date(repo.created_at);
    const year = createdAt.getFullYear();
    if (year >= startYear) {
      starsByYear.set(year, (starsByYear.get(year) || 0) + repo.stargazers_count);
    }
  });
  
  // Получаем события коммитов (через события)
  const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
  const events = await eventsResponse.json();
  
  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = new Date(event.created_at);
      const year = date.getFullYear();
      if (year >= startYear) {
        commitsByYear.set(year, (commitsByYear.get(year) || 0) + event.payload.size || 1);
      }
    }
  });
  
  // Получаем историю подписчиков (аппроксимируем)
  const followersResponse = await fetch(`https://api.github.com/users/${username}`);
  const userData = await followersResponse.json();
  const currentFollowers = userData.followers;
  
  // Распределяем подписчиков по годам (логический рост)
  for (let year = startYear; year <= currentYear; year++) {
    const ratio = Math.pow((year - startYear + 1) / (currentYear - startYear + 1), 1.2);
    followersByYear.set(year, Math.floor(currentFollowers * ratio));
  }
  
  // Формируем результат с накопительными итогами
  let cumulativeStars = 0;
  let cumulativeCommits = 0;
  
  for (let year = startYear; year <= currentYear; year++) {
    cumulativeStars += starsByYear.get(year);
    cumulativeCommits += commitsByYear.get(year);
    
    yearlyData.push({
      year: year.toString(),
      stars: cumulativeStars,
      followers: followersByYear.get(year),
      commits: cumulativeCommits
    });
  }
  
  return yearlyData;
}

// Генерация красивых шагов для оси Y
function generateNiceSteps(maxValue, stepsCount) {
  const step = Math.ceil(maxValue / stepsCount / 100) * 100;
  const steps = [];
  for (let i = 0; i <= stepsCount; i++) {
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