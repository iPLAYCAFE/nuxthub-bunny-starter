---
title: Studio
description: Edit your Nuxt Content website directly in production with the self-hosted Studio web editor.
---

# Studio module

> Edit your Nuxt Content website directly in production with the self-hosted Studio web editor.

The **Nuxt Studio** module is a browser-based interface for editing your Nuxt Content website directly in production. Access it by GitHub, GitLab or Google authentication on your deployed site, and start managing content without any local development tools.

::callout{icon="i-lucide-rocket" to="https://nuxt.studio/introduction" type="success"}
Browse Nuxt Studio documentation to learn how to install the module.
::

<!-- NOTE: ::studio-video renders for visitors but won't appear in Studio's
     live preview due to minimark parser limitation (custom block components
     are dropped during delta updates). This is a known nuxt-studio behavior.
     Video will show correctly after deploy. -->
::studio-video{src="/videos/studio-demo.mp4" controls loop playsinline preload="metadata"}
::

The **studio editor** allows you to manage content entirely from your browser on your production website. There's no need for local development tools, Git commands, or terminal access. It's ideal for content teams who want to edit and preview changes in a familiar environment.

## Visual edition in production for your Nuxt Content website

Nuxt Studio provides **visual editing directly in production** for Nuxt Content–powered websites.

Originally offered as a standalone premium platform, Studio is now a **free, open-source, and self-hostable Nuxt module**. It enables your entire team, developers and non-technical editors alike, to create and update content safely without leaving your live website.

## Current features

| Feature | Description |
|---------|-------------|
| ✨ **TipTap Visual Editor** | Rich Markdown editor with full MDC component support |
| 💻 **Monaco Code Editor** | Advanced code editor for Markdown (MDC), YAML, and JSON files |
| 📝 **Form-based Editor** | Edit YAML, JSON, and frontmatter using auto-generated forms based on collection schemas |
| 🎨 **Vue Component Props Editor** | Visual interface to edit Vue component props directly from the editor |
| 🔄 **Real-time Preview** | Instantly preview content changes on your production website |
| 🔐 **Multi-provider Authentication** | Secure OAuth authentication with GitHub, GitLab, and Google |
| 🔑 **Custom Authentication** | Utilities to implement custom authentication flows (password, SSO, LDAP, etc.) |
| 📝 **File Management** | Create, edit, rename, and delete content files in the `content/` directory |
| 🖼 **Media Management** | Centralized media library with support for JPEG, PNG, GIF, WebP, AVIF, SVG, and more |
| 🌳 **Git Integration** | Commit content changes directly from production and rely on your CI/CD pipeline |
| 🚀 **Development Mode** | Edit content and media files directly from your local filesystem |
| 🌍 **Internationalization** | Full i18n support for 25+ languages |

## Upcoming features

| Feature | Description |
|---------|-------------|
| 📂 **Collections View** | Manage and navigate all content collections from a unified interface |
| 🖼 **Media Optimization** | Optimize images and media assets directly within the editor |
| 🤖 **AI Content Assistant** | AI-powered suggestions to improve and speed up content creation |
| 💡 **Community-driven Features** | Share your feedback and help shape the future of Nuxt Studio |
