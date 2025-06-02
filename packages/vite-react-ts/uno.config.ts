import { defineConfig, presetIcons, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: [
    // 常用布局
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    
    // 常用组件样式 - 使用CSS变量
    ['btn', 'px-4 py-2 rounded inline-block cursor-pointer disabled:cursor-default disabled:opacity-50 transition-colors'],
    ['btn-primary', 'bg-[var(--btn-bg)] text-white hover:bg-[var(--btn-hover)] active:bg-[var(--btn-active)]'],
    ['btn-success', 'bg-[var(--success-500)] text-white hover:bg-[var(--success-900)]'],
    ['btn-warning', 'bg-[var(--warning-500)] text-black hover:bg-[var(--warning-900)] hover:text-white'],
    ['btn-danger', 'bg-[var(--error-500)] text-white hover:bg-[var(--error-900)]'],
    
    // 卡片组件
    ['card', 'bg-[var(--card-bg)] rounded-lg shadow-md overflow-hidden border-[var(--border-color)] border'],
    ['card-header', 'p-4 border-b border-[var(--border-color)]'],
    ['card-body', 'p-4'],
    ['card-footer', 'p-4 border-t border-[var(--border-color)]'],
    
    // 导航栏
    ['navbar', 'flex flex-col items-center p-4 bg-[var(--navbar-bg)] text-[var(--text-primary)] shadow-md'],
    ['navbar-brand', 'text-xl font-bold text-[var(--text-primary)]'],
    ['navbar-item', 'px-3 py-2 rounded hover:bg-[var(--table-row-hover)] cursor-pointer text-[var(--text-primary)] transition-colors'],
    
    // 表单元素
    ['input', 'px-4 py-2 bg-[var(--input-bg)] rounded border border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent text-[var(--text-primary)]'],
    ['select', 'px-4 py-2 bg-[var(--input-bg)] rounded border border-[var(--input-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent text-[var(--text-primary)]'],
    ['checkbox', 'w-4 h-4 text-[var(--primary-600)] bg-[var(--input-bg)] border-[var(--input-border)] rounded focus:ring-[var(--primary-500)]'],
    
    // 表格样式
    ['table-container', 'overflow-x-auto border border-[var(--border-color)] rounded-lg'],
    ['table-header', 'bg-[var(--table-header-bg)] text-[var(--text-primary)]'],
    ['table-row-hover', 'hover:bg-[var(--table-row-hover)]'],
  ],
  theme: {
    colors: {
      // 使用CSS变量定义颜色
      primary: 'var(--primary-500)',
      secondary: 'var(--secondary-500)',
      success: 'var(--success-500)',
      warning: 'var(--warning-500)',
      error: 'var(--error-500)',
      background: 'var(--bg-primary)',
      paper: 'var(--bg-paper)',
      text: 'var(--text-primary)',
      'text-secondary': 'var(--text-secondary)',
      'text-disabled': 'var(--text-disabled)',
      divider: 'var(--divider-color)',
      border: 'var(--border-color)'
    }
  }
})