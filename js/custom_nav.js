// 定义一个处理函数
function initNavButtons() {
    // 1. 找到所有的“模式切换”按钮（包括手机端菜单里的）
    const modeBtns = document.querySelectorAll('a[href="/#switch-mode"]');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认的跳转
            btf.switchDarkMode(); // 执行主题自带的切换黑夜模式函数
        });
    });

    // 2. 找到所有的“布局切换”按钮
    const layoutBtns = document.querySelectorAll('a[href="/#switch-layout"]');
    layoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认跳转
            const sidebarBtn = document.getElementById('toggle-sidebar');
            if (sidebarBtn) {
                sidebarBtn.click(); // 模拟点击右下角的设置按钮
            }
        });
    });
}

// 初始化逻辑
document.addEventListener('DOMContentLoaded', initNavButtons);

// 适配 PJAX：因为网页切换不刷新，所以每次切换完页面都要重新绑定一次事件
document.addEventListener('pjax:complete', initNavButtons);