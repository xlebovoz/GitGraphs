// api/user-stats.svg.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=21600, s-maxage=21600');
  
  const { username, theme = 'dark', border, width = '700', height = '220', followers } = req.query;
  const showFollowers = followers === 'true' || followers === '1' || followers === 'yes';
  
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
    
    // Получаем год создания аккаунта
    const createdAt = new Date(userData.created_at);
    const startYear = createdAt.getFullYear();
    const currentYear = new Date().getFullYear();
    
    // Получаем звёзды по годам (реальные)
    const starsByYear = await getUserStarsByYear(username);
    
    // Получаем текущее количество подписчиков
    const currentFollowers = userData.followers;
    
    // Формируем данные по годам (с года создания аккаунта)
    const yearlyData = [];
    let cumulativeStars = 0;
    
    for (let year = startYear; year <= currentYear; year++) {
      cumulativeStars += starsByYear.get(year) || 0;
      
      // Подписчики - прямая линия (равномерный рост от 0 до текущего)
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
    
    // АДАПТИВНОЕ МАСШТАБИРОВАНИЕ
    const maxStars = Math.max(...yearlyData.map(d => d.stars), 1);
    const maxFollowers = Math.max(...yearlyData.map(d => d.followers), 1);
    
    // Генерируем красивые шаги для сетки (адаптивные)
    const starSteps = generateAdaptiveSteps(maxStars);
    const followerSteps = generateAdaptiveSteps(maxFollowers);
    
    const graphHeight = 110; // Уменьшил высоту графика
    const graphTopOffset = 70;
    const graphWidth = parseInt(width) - 100;
    const stepX = graphWidth / (yearlyData.length - 1 || 1);
    
    function generatePoints(dataKey, maxValue) {
      return yearlyData.map((data, index) => {
        const x = 50 + (index * stepX);
        const y = graphTopOffset + graphHeight - (data[dataKey] / maxValue * graphHeight);
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
        <clipPath id="circleClip">
          <circle cx="17.5" cy="17.5" r="17.5"/>
        </clipPath>
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
      
      <!-- Заголовок с аватаром (круглый) -->
      <g transform="translate(60, 20)">
        <image x="0" y="0" width="35" height="35" href="${userData.avatar_url}" clip-path="url(#circleClip)"/>
        <circle cx="17.5" cy="17.5" r="17.5" fill="none" stroke="${currentTheme.borderColor}" stroke-width="1.5"/>
        <text x="65" y="16" font-family="Arial, sans-serif" font-size="13" fill="${currentTheme.text}" font-weight="600">
          ${userData.name || username}
        </text>
        <text x="65" y="30" font-family="Arial, sans-serif" font-size="9" fill="${currentTheme.muted}">
          @${username} • с ${startYear} года
        </text>
      </g>
      
      <!-- Легенда -->
      <g transform="translate(${parseInt(width) - 80}, 20)">
        <rect x="0" y="0" width="10" height="10" fill="${currentTheme.lineStars}" rx="2"/>
        <text x="15" y="9" font-family="Arial" font-size="9" fill="${currentTheme.text}">⭐ ${formatNumber(yearlyData[yearlyData.length-1]?.stars || 0)}</text>
        
        ${showFollowers ? `
        <rect x="0" y="18" width="10" height="10" fill="${currentTheme.lineFollowers}" rx="2"/>
        <text x="15" y="27" font-family="Arial" font-size="9" fill="${currentTheme.text}">👥 ${formatNumber(currentFollowers)}</text>
        ` : ''}
      </g>

      <!-- Линия подписчиков (СЛЕВА) -->
      ${showFollowers ? `
      ${followerSteps.map(({ value, yPercent }) => {
        const y = graphTopOffset + graphHeight - (yPercent * graphHeight);
        return `
          <line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}" stroke="${currentTheme.grid}" stroke-width="0.5" stroke-dasharray="3"/>
          <text x="45" y="${y+2}" font-family="Arial" font-size="7" fill="${currentTheme.muted}" text-anchor="end">${formatNumber(value)}</text>
        `;
      }).join('')}
      <polyline points="${generatePoints('followers', maxFollowers)}" fill="none" stroke="${currentTheme.lineFollowers}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4,3"/>
      <!-- Точки на линии подписчиков -->
      ${yearlyData.map((data, index) => {
        const x = 50 + (index * stepX);
        const y = graphTopOffset + graphHeight - (data.followers / maxFollowers * graphHeight);
        return `<circle cx="${x}" cy="${y}" r="2" fill="${currentTheme.lineFollowers}" stroke="${currentTheme.text}" stroke-width="1"/>`;
      }).join('')}
      ` : ''}
      
      <!-- Линия звёзд (СПРАВА) -->
      ${starSteps.map(({ value, yPercent }) => {
        const y = graphTopOffset + graphHeight - (yPercent * graphHeight);
        return `
          <line x1="50" y1="${y}" x2="${parseInt(width) - 50}" y2="${y}" stroke="${currentTheme.grid}" stroke-width="0.5" stroke-dasharray="3"/>
          <text x="${parseInt(width) - 45}" y="${y+2}" font-family="Arial" font-size="7" fill="${currentTheme.muted}" text-anchor="start">${formatNumber(value)}</text>
        `;
      }).join('')}
      <polyline points="${generatePoints('stars', maxStars)}" fill="none" stroke="${currentTheme.lineStars}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Точки на линии звёзд -->
      ${yearlyData.map((data, index) => {
        const x = 50 + (index * stepX);
        const y = graphTopOffset + graphHeight - (data.stars / maxStars * graphHeight);
        return `<circle cx="${x}" cy="${y}" r="2" fill="${currentTheme.lineStars}" stroke="${currentTheme.text}" stroke-width="1"/>`;
      }).join('')}
      
      <!-- Ось X -->
      <line x1="50" y1="${graphTopOffset + graphHeight}" x2="${parseInt(width) - 50}" y2="${graphTopOffset + graphHeight}" stroke="${currentTheme.divider}" stroke-width="1"/>
      
      <!-- Подписи годов -->
      ${yearlyData.map((data, index) => {
        const show = yearlyData.length <= 12 || index % Math.ceil(yearlyData.length / 10) === 0;
        const x = 50 + (index * stepX);
        return show ? `
          <text x="${x}" y="${graphTopOffset + graphHeight + 12}" font-family="Arial" font-size="7" 
                fill="${currentTheme.muted}" text-anchor="middle">
            ${data.year}
          </text>
        ` : '';
      }).join('')}
      
      <!-- ИКОНКИ ВНИЗУ (ДОБАВИТЬ ЭТОТ БЛОК) -->
      ${showFollowers ? `
      <text x="40" y="${graphTopOffset + graphHeight + 2}" font-family="Arial" font-size="8" fill="${currentTheme.lineFollowers}" text-anchor="end">👥</text>
      ` : ''}
      <text x="${parseInt(width) - 40}" y="${graphTopOffset + graphHeight + 2}" font-family="Arial" font-size="8" fill="${currentTheme.lineStars}" text-anchor="start">⭐</text>
      
      <!-- Подвал -->
      <text x="15" y="${parseInt(height) - 8}" font-family="Arial" font-size="7" 
            fill="${currentTheme.footer}">📊 powered by Xlebovoz</text>
      
      <text x="${parseInt(width) - 15}" y="${parseInt(height) - 8}" font-family="Arial" font-size="7" 
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

// АДАПТИВНЫЕ шаги для сетки
// АДАПТИВНЫЕ шаги для сетки
function generateAdaptiveSteps(maxValue) {
  if (maxValue === 0) {
    return [
      { value: 0, yPercent: 0 },
      { value: 1, yPercent: 1 }
    ];
  }
  
  // Определяем шаг в зависимости от величины
  let step;
  if (maxValue <= 5) step = 1;      // 1,2,3,4,5
  else if (maxValue <= 10) step = 2;  // 0,2,4,6,8,10
  else if (maxValue <= 50) step = 10;
  else if (maxValue <= 100) step = 25;
  else if (maxValue <= 500) step = 100;
  else if (maxValue <= 1000) step = 250;
  else step = Math.ceil(maxValue / 4 / 100) * 100;
  
  const steps = [];
  // Для маленьких значений показываем все числа
  if (maxValue <= 5) {
    for (let i = 0; i <= maxValue; i++) {
      const yPercent = maxValue > 0 ? i / maxValue : 0;
      steps.push({ value: i, yPercent });
    }
  } else {
    for (let i = 0; i <= 4; i++) {
      let value = i * step;
      if (value > maxValue && i > 0) break;
      const yPercent = maxValue > 0 ? value / maxValue : 0;
      steps.push({ value, yPercent });
    }
  }
  
  // Всегда добавляем максимальное значение
  const lastStep = steps[steps.length - 1];
  if (lastStep && lastStep.value !== maxValue) {
    steps.push({ value: maxValue, yPercent: 1 });
  }
  
  return steps;
}

function errorSvg(message, width) {
  const w = parseInt(width) || 700;
  const h = 220;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="#f85149" rx="12" opacity="0.9"/>
    <text x="${w/2}" y="${h/2 - 15}" font-family="Arial" font-size="13" fill="white" text-anchor="middle" font-weight="600">
      ❌ Ошибка
    </text>
    <text x="${w/2}" y="${h/2 + 10}" font-family="Arial" font-size="10" fill="rgba(255,255,255,0.9)" text-anchor="middle">
      ${message}
    </text>
    <text x="${w/2}" y="${h/2 + 30}" font-family="Arial" font-size="9" fill="rgba(255,255,255,0.7)" text-anchor="middle">
      Пример: ?username=vercel
    </text>
    <text x="${w-15}" y="${h-10}" font-family="Arial" font-size="8" fill="rgba(255,255,255,0.7)" text-anchor="end">
      ${new Date().toISOString().slice(0, 10)}
    </text>
  </svg>
  `;
}