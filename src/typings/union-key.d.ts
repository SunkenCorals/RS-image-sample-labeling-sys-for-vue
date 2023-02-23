declare namespace UnionKey {
  /** http请求头的content-type类型 */
  type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';

  /**
   * 登录模块
   * - pwd-login: 账密登录
   * - code-login: 手机验证码登录
   * - register: 注册
   * - reset-pwd: 重置密码
   * - bind-wechat: 微信绑定
   */
  type LoginModule = 'pwd-login' | 'code-login' | 'register' | 'reset-pwd' | 'bind-wechat';

  /**
   * 布局模式
   * - vertical: 左侧菜单模式
   * - horizontal: 顶部菜单模式
   * - vertical-mix: 左侧菜单混合模式
   * - horizontal-mix: 顶部菜单混合模式
   */
  type ThemeLayoutMode = 'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix';

  /**
   * 多页签风格
   * - chrome: 谷歌风格
   * - button: 按钮风格
   */
  type ThemeTabMode = 'chrome' | 'button';

  /**
   * 水平模式的菜单位置
   * - flex-start: 居左
   * - center: 居中
   * - flex-end: 居右
   */
  type ThemeHorizontalMenuPosition = 'flex-start' | 'center' | 'flex-end';

  /**
   * 过渡动画类型
   * - zoom-fade: 渐变
   * - zoom-out: 闪现
   * - fade-slide: 滑动
   * - fade: 消退
   * - fade-bottom: 底部消退
   * - fade-scale: 缩放消退
   */
  type ThemeAnimateMode = 'zoom-fade' | 'zoom-out' | 'fade-slide' | 'fade' | 'fade-bottom' | 'fade-scale';

  /**
   * 布局组件的名称
   * - basic 基础布局
   * - blank 空白布局
   */
  type LayoutComponentName = 'basic' | 'blank';
}
