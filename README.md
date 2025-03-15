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

其他的慢慢写吧……

## 开发进度

### 页面

1. 登录页面 ✅

2. 注册页面 ✅

3. 重置密码 ✅
4. 页面框架 ✅
5. 首页
6. 数据管理
7. 用户管理
8. 任务管理
9. 类别管理
10. 标注页面
11. 样本库页面
12. ……

### 接口

#### api/auth 用户管理

1. 登录 fetchLogin ✅
2. 注册 fetchRegister ✅
3. 登出 fetchLogout ✅
4. 获取 fetchCurrentUser ✅
5. 重置密码 fetchResetPassword
6. ……

