# 照片墙使用说明

## "我看见的你"照片墙

主页上的"我看见的你"照片墙是一个相册翻页效果的组件，您可以添加自己的照片和描述，展示您珍贵的回忆。

## 如何添加照片

1. 准备您想要展示的照片（建议尺寸：宽度800-1200像素，高度500-800像素）
2. 将照片文件命名为`photo1.jpg`、`photo2.jpg`、`photo3.jpg`、`photo4.jpg`
3. 将这些照片放入`public/home_picture/`目录下

```
menu-app/
  ├── public/
  │   ├── home_picture/   <-- 放置照片的目录
  │   │   ├── photo1.jpg
  │   │   ├── photo2.jpg
  │   │   ├── photo3.jpg
  │   │   └── photo4.jpg
  │   └── ...
  └── ...
```

## 自定义照片描述

如果您想要自定义每张照片的标题和描述，可以编辑`src/components/PhotoAlbum.tsx`文件中的`photos`数组：

```typescript
const photos: PhotoData[] = [
  {
    id: 1,
    image: `${process.env.PUBLIC_URL}/home_picture/photo1.jpg`,
    title: "一起看海的日子",   // <-- 修改这里的标题
    description: "那天的海风很温柔，阳光很灿烂，你的笑容比阳光还要明媚。"  // <-- 修改这里的描述
  },
  // ... 其他照片
];
```

## 添加更多照片

如果您想添加更多照片，可以继续添加`photo5.jpg`、`photo6.jpg`等，并在`PhotoAlbum.tsx`文件中的`photos`数组中添加对应的条目。

## 照片格式

支持的照片格式包括：JPG、PNG、WEBP等常见网页图片格式。建议使用JPG格式以获得更好的加载性能。

## 注意事项

- 照片尺寸过大会影响页面加载速度，建议优化照片大小
- 如果照片无法加载，组件会自动显示默认的占位图片
- 相册支持鼠标拖拽翻页和按钮点击翻页两种方式

祝您使用愉快！ 