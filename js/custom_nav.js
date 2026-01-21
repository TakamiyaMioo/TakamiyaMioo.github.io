// source/js/custom_nav.js

/**
 * 1. 修改侧边栏作者名字的函数
 * 将 "TakamiyaMioo(Zhao Haoyu)" 分割为两行显示，并优化第二行的样式
 */
function customizeAuthor() {
    // 获取侧边栏作者名的 DOM 元素
    const authorNameElement = document.querySelector('.author-info__name');
    
    // 只有当元素存在且内容包含我们想要修改的文本时才执行，防止重复修改
    if (authorNameElement) {
        // 这里的 innerHTML 会覆盖 _config.yml 里的纯文本配置
        // 第一行是网名，<br>换行，第二行用 span 包裹真名，字体调小、透明度降低
        authorNameElement.innerHTML = "TakamiyaMioo<br><span style='font-size: 0.8em; opacity: 0.8; font-weight: normal;'>(Zhao Haoyu)</span>";
    }
}

/**
 * 2. 初始化导航栏按钮事件监听 (日夜模式 & 布局切换)
 * 保留了你之前的稳健逻辑，包含 btf 缺失时的保底方案
 */
function initNavButtons() {
    console.log("Custom Nav: 初始化按钮事件监听...");

    // ---------------------------------------------------------
    // 处理“模式切换”按钮 (日夜模式)
    // ---------------------------------------------------------
    const modeBtns = document.querySelectorAll('a[href$="#switch-mode"]');
    if (modeBtns.length > 0) {
        modeBtns.forEach(btn => {
            // 先解绑旧事件（防止 PJAX 重复绑定），虽然 addEventListener 通常不怕重复，但保险起见
            // 这里为了简单直接绑定，依靠外部的 mainInit 控制频次
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 方案 A: 尝试调用主题自带方法
                if (typeof btf !== 'undefined' && typeof btf.switchDarkMode === 'function') {
                    console.log("调用 btf.switchDarkMode()");
                    btf.switchDarkMode();
                } 
                // 方案 B: 手动切换 (保底方案)
                else {
                    console.warn("btf 未定义，启用手动切换模式");
                    const html = document.documentElement;
                    const nowMode = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                    const newMode = nowMode === 'dark' ? 'light' : 'dark';
                    
                    html.setAttribute('data-theme', newMode);
                    localStorage.setItem('theme', newMode);
                    const event = new CustomEvent('themeChange', { detail: { theme: newMode } });
                    document.dispatchEvent(event);
                }
            });
        });
    }

    // ---------------------------------------------------------
    // 处理“布局切换”按钮 (显示/隐藏侧边栏)
    // ---------------------------------------------------------
    const layoutBtns = document.querySelectorAll('a[href$="#switch-layout"]');
    if (layoutBtns.length > 0) {
        layoutBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();

                // 方案 A: 尝试调用主题自带方法
                if (typeof btf !== 'undefined' && typeof btf.hideAsideBtn === 'function') {
                    console.log("调用 btf.hideAsideBtn()");
                    btf.hideAsideBtn();
                } 
                // 方案 B: 手动切换 (保底方案)
                else {
                    console.warn("btf 未定义，启用手动布局切换");
                    const html = document.documentElement;
                    if (html.classList.contains('hide-aside')) {
                        html.classList.remove('hide-aside');
                    } else {
                        html.classList.add('hide-aside');
                    }
                }
            });
        });
    }
}

/**
 * 3. 统一入口函数
 * 将所有需要初始化的功能集中在这里调用
 */
function mainInit() {
    initNavButtons();   // 初始化按钮逻辑
    customizeAuthor();  // 初始化作者名修改逻辑
}

// ---------------------------------------------------------
// 4. 事件监听配置
// ---------------------------------------------------------

// 页面首次加载完成时执行
document.addEventListener('DOMContentLoaded', mainInit);

// 适配 PJAX (页面内部跳转时执行，防止功能失效)
document.addEventListener('pjax:complete', mainInit);

// // source/js/custom_nav.js

// function initNavButtons() {
//     console.log("Custom Nav: 初始化按钮事件监听...");

//     // =========================================================
//     // 1. 处理“模式切换”按钮 (日夜模式)
//     // =========================================================
//     const modeBtns = document.querySelectorAll('a[href$="#switch-mode"]');
//     if (modeBtns.length > 0) {
//         modeBtns.forEach(btn => {
//             btn.addEventListener('click', function(e) {
//                 e.preventDefault();
                
//                 // 方案 A: 尝试调用主题自带方法
//                 if (typeof btf !== 'undefined' && typeof btf.switchDarkMode === 'function') {
//                     console.log("调用 btf.switchDarkMode()");
//                     btf.switchDarkMode();
//                 } 
//                 // 方案 B: 手动切换 (保底方案)
//                 else {
//                     console.warn("btf 未定义，启用手动切换模式");
//                     const html = document.documentElement;
//                     const nowMode = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
//                     const newMode = nowMode === 'dark' ? 'light' : 'dark';
                    
//                     // 1. 修改 HTML 属性
//                     html.setAttribute('data-theme', newMode);
//                     // 2. 写入本地缓存
//                     localStorage.setItem('theme', newMode);
//                     // 3. 广播事件 (让其他组件感知)
//                     const event = new CustomEvent('themeChange', { detail: { theme: newMode } });
//                     document.dispatchEvent(event);
//                 }
//             });
//         });
//     }

//     // =========================================================
//     // 2. 处理“布局切换”按钮 (显示/隐藏侧边栏)
//     // =========================================================
//     const layoutBtns = document.querySelectorAll('a[href$="#switch-layout"]');
//     if (layoutBtns.length > 0) {
//         layoutBtns.forEach(btn => {
//             btn.addEventListener('click', function(e) {
//                 e.preventDefault();

//                 // 方案 A: 尝试调用主题自带方法
//                 if (typeof btf !== 'undefined' && typeof btf.hideAsideBtn === 'function') {
//                     console.log("调用 btf.hideAsideBtn()");
//                     btf.hideAsideBtn();
//                 } 
//                 // 方案 B: 手动切换 (保底方案)
//                 else {
//                     console.warn("btf 未定义，启用手动布局切换");
//                     const html = document.documentElement;
//                     // Butterfly v4+ 通过给 html 加 hide-aside 类来隐藏侧边栏
//                     if (html.classList.contains('hide-aside')) {
//                         html.classList.remove('hide-aside');
//                     } else {
//                         html.classList.add('hide-aside');
//                     }
//                 }
//             });
//         });
//     }
// }

// // 确保在页面加载后执行
// document.addEventListener('DOMContentLoaded', initNavButtons);
// document.addEventListener('pjax:complete', initNavButtons);