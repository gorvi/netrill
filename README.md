# Netrill | 上海络川科技有限公司

企业官网定制开发与技术顾问服务网站

## 项目信息
- **品牌名称**: Netrill
- **公司全称**: 上海络川科技有限公司
- **服务内容**: 企业官网、小程序、API集成、自动化、AI集成、性能优化

## 部署与使用说明（腾讯云轻量服务器）

## 目录结构
- `index.html` 首页
- `pages/` 流程、报价、联系
- `services/` 各项服务详情页
- `styles.css` 全站样式（科技感深色主题，参考 Apple Store 浅色主题，响应式、动效）
- `app.js` 交互增强（导航高亮、进场动效、主题切换）
- `assets/` 静态资源（图标等）

## 主题切换
- 网站支持深色/浅色主题切换
- 导航栏右上角主题切换按钮（月亮/太阳图标）
- 默认深色主题（科技感风格）
- 浅色主题参考 Apple Store 配色
- 主题偏好保存至 localStorage，刷新后保持选择

## 本地预览（Windows PowerShell）
```powershell
# 在项目根目录启动一个静态服务器（任选其一）
python -m http.server 8080
# 或
npx serve -l 8080
```
访问 `http://localhost:8080`。

## 部署到腾讯云轻量应用服务器
1. 通过宝塔/SSH 登录服务器，安装 Nginx。
2. 复制本项目到 `/var/www/site`（可自定义）。
3. 创建 Nginx 站点配置：

```nginx
server {
    listen 80;
    server_name www.netrill.com netrill.com;
    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|webp)$ {
        expires 7d;
        access_log off;
    }
}
```

4. 申请并配置 HTTPS（推荐使用 acme.sh/宝塔 Let’s Encrypt）。
5. 重载 Nginx：`sudo nginx -s reload`。

## SEO 与站点地图
- `robots.txt` 已允许索引
- `sitemap.xml` 已包含主要页面，部署后将域名改为你的域名
- 每页包含基础 `<meta name="description">` 与结构化数据（首页）

## 自定义
- 修改导航品牌名与文案：各页面 `<nav>` 与 Hero 部分
- 替换联系邮箱与微信：`pages/contact.html`
- 上传 `assets/favicon.ico` 作为站点图标（可用在线生成器）

## 维护建议
- 内容改动后，跑一次链接检查与 Lighthouse
- 按需增加案例与客户评价，提升转化

