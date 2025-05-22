# 少女Elenaの菜单 - Vercel部署指南

这个指南将帮助您在Vercel上部署前后端一体的少女Elenaの菜单应用。

## 准备工作

1. 确保您已经有一个[GitHub](https://github.com/)账号
2. 注册一个[Vercel](https://vercel.com)账号
3. 将项目代码上传到GitHub仓库

## 部署步骤

### 1. 准备环境变量

在部署之前，您需要准备好以下环境变量：

- `EMAIL_PASS`：您的QQ邮箱授权码

### 2. Vercel导入项目

1. 登录Vercel
2. 点击"New Project"按钮
3. 选择您的GitHub仓库
4. 在配置页面：
   - Framework Preset选择"Other"
   - Root Directory保持默认
   - Build Command填写：`cd menu-app && npm install && npm run build`
   - Output Directory填写：`menu-app/build`
   - 点击"Environment Variables"，添加您的`EMAIL_PASS`环境变量

### 3. 部署

点击"Deploy"按钮，Vercel将自动构建和部署您的应用。

## 验证部署

部署完成后，您可以访问Vercel提供的域名(通常是`项目名.vercel.app`)来测试您的应用。

## 自定义域名(可选)

如果您有自己的域名，可以在Vercel项目的Settings > Domains中添加并配置它。

## 常见问题

### 环境变量未生效

如果您发现邮件发送功能不工作，检查环境变量是否正确设置。可以在Vercel项目的Settings > Environment Variables中确认。

### API路径错误

如果前端无法连接到API，确保API路径正确设置为相对路径`/api/send-order-email`。

### 部署失败

检查Vercel提供的构建日志，查找错误信息。常见原因包括：
- 依赖项安装失败
- 构建脚本错误
- 环境变量缺失

## 更新应用

当您更新代码并推送到GitHub时，Vercel会自动重新部署您的应用。 