// source/js/custom_nav.js

function initNavButtons() {
    console.log("Custom Nav: 初始化按钮事件监听...");

    // =========================================================
    // 1. 处理“模式切换”按钮 (日夜模式)
    // =========================================================
    const modeBtns = document.querySelectorAll('a[href$="#switch-mode"]');
    if (modeBtns.length > 0) {
        modeBtns.forEach(btn => {
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
                    
                    // 1. 修改 HTML 属性
                    html.setAttribute('data-theme', newMode);
                    // 2. 写入本地缓存
                    localStorage.setItem('theme', newMode);
                    // 3. 广播事件 (让其他组件感知)
                    const event = new CustomEvent('themeChange', { detail: { theme: newMode } });
                    document.dispatchEvent(event);
                }
            });
        });
    }

    // =========================================================
    // 2. 处理“布局切换”按钮 (显示/隐藏侧边栏)
    // =========================================================
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
                    // Butterfly v4+ 通过给 html 加 hide-aside 类来隐藏侧边栏
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

// 确保在页面加载后执行
document.addEventListener('DOMContentLoaded', initNavButtons);
document.addEventListener('pjax:complete', initNavButtons);

// // 定义一个处理函数
// function initNavButtons() {
//     // 1. 找到所有的“模式切换”按钮（包括手机端菜单里的）
//     const modeBtns = document.querySelectorAll('a[href="/#switch-mode"]');
//     modeBtns.forEach(btn => {
//         btn.addEventListener('click', function(e) {
//             e.preventDefault(); // 阻止默认的跳转
//             btf.switchDarkMode(); // 执行主题自带的切换黑夜模式函数
//         });
//     });

//     // 2. 找到所有的“布局切换”按钮
//     const layoutBtns = document.querySelectorAll('a[href="/#switch-layout"]');
//     layoutBtns.forEach(btn => {
//         btn.addEventListener('click', function(e) {
//             e.preventDefault(); // 阻止默认跳转
//             const sidebarBtn = document.getElementById('toggle-sidebar');
//             if (sidebarBtn) {
//                 sidebarBtn.click(); // 模拟点击右下角的设置按钮
//             }
//         });
//     });
// }

// // 初始化逻辑
// document.addEventListener('DOMContentLoaded', initNavButtons);

// // 适配 PJAX：因为网页切换不刷新，所以每次切换完页面都要重新绑定一次事件
// document.addEventListener('pjax:complete', initNavButtons);