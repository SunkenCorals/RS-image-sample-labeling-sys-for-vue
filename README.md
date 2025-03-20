<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>遥感样本标注平台前端（Vue重构）</h1>
</div>


## 使用

**环境准备**

确保环境满足以下要求：

- **git**: 你需要git来克隆和管理项目版本。
- **NodeJS**: >=18.12.0，推荐 18.19.0 或更高。
- **pnpm**: >= 8.7.0，推荐 8.14.0 或更高。

**克隆项目**

```bash
git clone https://github.com/SunkenCorals/RS-image-sample-labeling-sys-for-vue.git
```

**安装依赖**

```bash
pnpm i
```
> 由于本项目采用了 pnpm monorepo 的管理方式，因此请不要使用 npm 或 yarn 来安装依赖。

**启动项目**

```bash
pnpm dev
```

**构建项目**

```bash
pnpm build
```

## Git 提交规范

本项目已内置 `commit` 命令，可以通过执行 `pnpm commit` 来生成符合 [Conventional Commits]([conventionalcommits](https://www.conventionalcommits.org/)) 规范的提交信息。在提交PR时，请务必使用 `commit` 命令来创建提交信息，以确保信息的规范性。

设置了**Vue TypeScript 编译检查（vue-tsc）**，有错误的代码不能通过提交！！！

## 介绍

前端基于[SoybeanAdmin](https://docs.soybeanjs.cn/zh/guide/intro.html)模版，主要前端技术栈： Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。

本系统的路由基于插件 [Elegant Router](https://github.com/soybeanjs/elegant-router)

## 开发日志

### 3.20

> hzh

- UI

  1. 数据管理实现文件夹管理样式（列表/图标）

- Function

  1. 修复登录跳error的错误

  2. 数据管理目前参考minio示例数据写的静态页面

     未接接口

### 3.19

> hzh

- UI

  1. 用户管理
  2. 导航栏新增类别管理

- Function

  1. 查询用户类别

  2. 查询用户并以表格形式渲染

     userID和userName非必选，isAdmin必选

  3. 删除用户未实现
     后端存在userid和user_id弄混淆的bug

  4. 编辑用户-修改类别未实现

### 3.15

> hzh

- UI
  1. 登录
  2. 注册
  3. 修改密码
- Function
  1. 登录/登出
  2. 注册
  3. 获取当前用户信息存储loaclstorage，页面加载渲染userinfo，路由加载token放行（不同用户token权限未配置）

### 3.13 

> hzh

1. 完成基本框架搭建

