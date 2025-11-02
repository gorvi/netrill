// 国际化模块
class I18n {
  constructor() {
    this.locale = 'zh-CN';
    this.translations = {};
    this.loading = false;
    this.listeners = [];
  }

  async loadLocale(locale) {
    if (this.loading) return Promise.resolve();
    this.loading = true;
    
    try {
      const response = await fetch(`/i18n/${locale}.json`);
      if (!response.ok) throw new Error(`Failed to load locale: ${locale}`);
      const translations = await response.json();
      this.translations = translations;
      this.locale = locale;
      this.notifyListeners();
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading locale:', error);
      // 如果加载失败，尝试加载默认语言
      if (locale !== 'zh-CN') {
        return this.loadLocale('zh-CN');
      }
      return Promise.resolve();
    } finally {
      this.loading = false;
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // 返回 key 如果找不到翻译
      }
    }
    return value || key;
  }

  setLocale(locale) {
    if (this.locale === locale) return;
    localStorage.setItem('site-locale', locale);
    this.loadLocale(locale);
  }

  getLocale() {
    return this.locale;
  }

  // 订阅者模式：通知所有监听器
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.locale));
  }

  // 渲染页面文本
  render() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text !== key) {
        // 支持textContent和placeholder属性
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          // 优先使用 innerHTML 以支持 HTML 内容
          el.innerHTML = text;
        }
      }
    });
  }
}

// 创建全局实例
const i18n = new I18n();

// 初始化：从 localStorage 加载用户偏好
const savedLocale = localStorage.getItem('site-locale') || 'zh-CN';
i18n.loadLocale(savedLocale).then(() => {
  // 确保 DOM 加载完成后再渲染
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.render());
  } else {
    i18n.render();
  }
});

// 订阅语言变化自动渲染
i18n.subscribe(() => {
  i18n.render();
});

