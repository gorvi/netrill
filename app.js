// 简单的可用性增强：导航高亮、进场动效、外链新窗口
document.addEventListener('DOMContentLoaded',()=>{
  const path = location.pathname.replace(/\\/g,'/');
  document.querySelectorAll('nav a').forEach(a=>{
    if(a.getAttribute('href') && path.endsWith(a.getAttribute('href'))){
      a.classList.add('active');
    }
  });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
    })
  },{rootMargin:'-10% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // 所有外部链接在新窗口打开
  document.querySelectorAll('a[href^="http"]').forEach(a=>a.setAttribute('target','_blank'));

  // 主题切换功能
  const THEME_KEY = 'site-theme';
  const themeToggle = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem(THEME_KEY) !== 'light';
  
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }
  
  applyTheme(isDark);
  
  themeToggle?.addEventListener('click', () => {
    const currentDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!currentDark);
  });

  // 滚动高亮当前区域对应的导航项
  const navLinks = document.querySelectorAll('nav a:not(.btn)');
  const sections = document.querySelectorAll('section[id]');
  
  if(sections.length > 0){
    const navObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting && entry.intersectionRatio > 0.3){
          const id = entry.target.id;
          navLinks.forEach(a=>{
            const href = a.getAttribute('href');
            if(href && (href === `#${id}` || href.includes(`#${id}`))){
              navLinks.forEach(l=>l.classList.remove('active'));
              a.classList.add('active');
            }
          });
        }
      });
    },{threshold:0.3,rootMargin:'-80px 0px'});
    sections.forEach(s=>navObserver.observe(s));
  }

  // 语言切换功能
  const langToggle = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');
  
  if(langToggle && langDropdown){
    langToggle.addEventListener('click',(e)=>{
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click',(e)=>{
      if(!langToggle.contains(e.target) && !langDropdown.contains(e.target)){
        langDropdown.classList.remove('open');
      }
    });

    // 下拉菜单项点击切换语言
    langDropdown.querySelectorAll('.lang-dropdown-item').forEach(item=>{
      item.addEventListener('click',()=>{
        const locale = item.dataset.locale;
        if(typeof i18n !== 'undefined'){
          i18n.setLocale(locale);
        }
        langDropdown.classList.remove('open');
      });
    });

    // 订阅 i18n 变化更新 UI
    if(typeof i18n !== 'undefined'){
      i18n.subscribe(()=>{
        updateLanguageUI();
      });
    }
  }

  function updateLanguageUI(){
    const locale = typeof i18n !== 'undefined' ? i18n.getLocale() : 'zh-CN';
    const currentLang = locale === 'zh-CN' ? '中' : 'EN';
    if(langToggle) langToggle.textContent = currentLang;
    
    // 更新下拉菜单的选中状态
    if(langDropdown){
      langDropdown.querySelectorAll('.lang-dropdown-item').forEach(item=>{
        item.classList.remove('active');
        const itemLocale = item.dataset.locale;
        if(itemLocale === locale){
          item.classList.add('active');
        }
      });
    }
  }

  // 初始化语言 UI
  updateLanguageUI();
});


