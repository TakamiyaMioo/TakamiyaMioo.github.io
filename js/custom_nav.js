/* Homepage modules, navigation helpers and data-driven pages. */
(function () {
  'use strict';

  var blog = window.TakamiyaBlog = window.TakamiyaBlog || {};

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeHref(value) {
    var href = String(value || '');
    return href.indexOf('/') === 0 || href.indexOf('https://') === 0 ? href : '#';
  }

  function bindOnce(element, key, handler) {
    if (!element || element.dataset[key]) return;
    element.dataset[key] = 'true';
    element.addEventListener('click', handler);
  }

  function customizeAuthor() {
    var author = document.querySelector('.author-info-name');
    if (!author || author.dataset.takamiyaAuthor) return;
    author.dataset.takamiyaAuthor = 'true';
    author.innerHTML = 'TakamiyaMioo<br><span class="author-real-name">(Zhao Haoyu)</span>';
  }

  function ensureVisitorFallback() {
    var visitor = document.getElementById('busuanzi_value_site_uv');
    if (!visitor || visitor.dataset.takamiyaVisitorFallback) return;
    visitor.dataset.takamiyaVisitorFallback = 'true';

    window.setTimeout(function () {
      if (visitor.querySelector('.fa-spin') || !visitor.textContent.trim()) {
        visitor.textContent = '0';
      }
    }, 12000);
  }

  function numberArticleHeadings() {
    var container = document.querySelector('#article-container.post-content');
    if (!container) return;

    var counters = [0, 0, 0, 0, 0, 0];
    container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function (heading) {
      var level = Number(heading.tagName.slice(1));
      var oldNumber = heading.firstElementChild;
      if (oldNumber && oldNumber.classList.contains('article-heading-number')) {
        oldNumber.remove();
      }

      counters[level - 1] += 1;
      for (var index = level; index < counters.length; index += 1) {
        counters[index] = 0;
      }

      var number = document.createElement('span');
      number.className = 'article-heading-number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = counters.slice(0, level).join('.') + ' ';
      heading.insertBefore(number, heading.firstChild);
    });
  }

  function initNavButtons() {
    document.querySelectorAll('a[href$="#switch-mode"]').forEach(function (button) {
      bindOnce(button, 'takamiyaModeBound', function (event) {
        event.preventDefault();
        var darkmodeButton = document.getElementById('darkmode');
        if (darkmodeButton) {
          darkmodeButton.click();
        }
      });
    });

    document.querySelectorAll('a[href$="#switch-layout"]').forEach(function (button) {
      bindOnce(button, 'takamiyaLayoutBound', function (event) {
        event.preventDefault();
        var hideAsideButton = document.getElementById('hide-aside-btn');
        if (hideAsideButton) {
          hideAsideButton.click();
        }
      });
    });
  }

  function ensureHeroActions() {
    var siteInfo = document.querySelector('#page-header.full_page #site-info');
    if (!siteInfo || siteInfo.querySelector('.home-hero-actions')) return;

    var actions = [
      ['开始阅读', '/archives/', 'fas fa-book-open'],
      ['学习路线', '/roadmap/', 'fas fa-route'],
      ['项目作品', '/projects/', 'fas fa-code-branch']
    ];
    var wrapper = document.createElement('div');
    wrapper.className = 'home-hero-actions';
    wrapper.innerHTML = actions.map(function (item) {
      return '<a class="home-hero-action" href="' + safeHref(item[1]) + '"><i class="' + item[2] + '"></i><span>' + item[0] + '</span></a>';
    }).join('');
    siteInfo.appendChild(wrapper);
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error('Unable to load ' + url);
      return response.json();
    });
  }

  function renderResearchCards(items) {
    return (items || []).map(function (item) {
      return '<a class="home-link-card research-card" href="' + safeHref(item.href) + '">' +
        '<span class="home-card-icon"><i class="' + escapeHtml(item.icon || 'fas fa-book') + '"></i></span>' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p>' + escapeHtml(item.description) + '</p>' +
        '</a>';
    }).join('');
  }

  function renderFeatured(items) {
    return (items || []).map(function (item) {
      return '<div class="featured-item"><a href="' + safeHref(item.href) + '">' + escapeHtml(item.title) + '</a><span class="featured-note">' + escapeHtml(item.note) + '</span></div>';
    }).join('');
  }

  function renderProjectLogos(item) {
    var logos = item.logos || [];
    var labels = item.logo_alts || [];
    if (!logos.length) return '';

    return '<div class="project-card-logos" aria-label="项目标识">' + logos.map(function (logo, index) {
      var href = safeHref(logo);
      if (href === '#') return '';
      return '<img src="' + escapeHtml(href) + '" alt="' + escapeHtml(labels[index] || '项目标识') + '" loading="lazy">';
    }).join('') + '</div>';
  }

  function renderProjectMedia(item) {
    var images = (item.images || []).map(function (image) {
      return safeHref(image);
    }).filter(function (image) {
      return image !== '#';
    });

    if (!images.length) {
      return '<div class="project-media project-media-empty"><i class="fas fa-images"></i><span>图片待补充</span></div>';
    }

    return '<div class="project-media" data-images="' + escapeHtml(JSON.stringify(images)) + '">' +
      '<img data-project-image src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(item.name) + ' 项目图片" loading="lazy">' +
      (images.length > 1 ? '<span class="project-media-count">1 / ' + images.length + '</span>' : '') +
      '</div>';
  }

  function renderProjectCards(items, limit, wide) {
    return (items || []).slice(0, limit || items.length).map(function (item) {
      var links = [];
      if (item.github) links.push('<a href="' + safeHref(item.github) + '">GitHub</a>');
      if (item.article) links.push('<a href="' + safeHref(item.article) + '">相关文章</a>');
      var cardClass = wide ? ' project-card-wide' : '';
      var content = '<h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.summary) + '</p>' +
        '<p class="project-meta">' + escapeHtml(item.stack) + '</p>' +
        (links.length ? '<div class="project-links">' + links.join(' · ') + '</div>' : '');

      return '<article class="project-card' + cardClass + '">' +
        (wide ? renderProjectMedia(item) + '<div class="project-card-content">' + renderProjectLogos(item) + content + '</div>' : content) +
        '</article>';
    }).join('');
  }

  function initProjectSlides() {
    document.querySelectorAll('.project-media[data-images]').forEach(function (media) {
      if (media.dataset.slideReady) return;
      media.dataset.slideReady = 'true';

      var image = media.querySelector('[data-project-image]');
      var count = media.querySelector('.project-media-count');
      var images;
      try {
        images = JSON.parse(media.dataset.images || '[]');
      } catch (error) {
        images = [];
      }
      if (!image || images.length < 2) return;

      var index = 0;
      window.setInterval(function () {
        image.classList.add('is-fading');
        window.setTimeout(function () {
          index = (index + 1) % images.length;
          image.src = images[index];
          if (count) count.textContent = (index + 1) + ' / ' + images.length;
          image.classList.remove('is-fading');
        }, 260);
      }, 4200);
    });
  }

  function renderHome(homeData, projectData) {
    var recent = document.querySelector('#recent-posts');
    if (!recent || recent.querySelector('.home-upgrade')) return;

    var intro = homeData.intro || {};
    var shell = document.createElement('div');
    shell.className = 'home-upgrade';
    shell.innerHTML =
      '<section class="home-section home-intro">' +
        '<p class="home-kicker">首页结构 · Part 1</p>' +
        '<div class="home-section-header"><h2>学习档案、研究方向、精选内容、项目与实践</h2></div>' +
        '<p class="home-structure-note">首页分为两部分：上方是我的学习与科研档案，下方是博客文章列表。你可以先从研究方向和精选内容开始，也可以直接进入文章归档。</p>' +
        '<p>' + escapeHtml(intro.text) + '</p>' +
        '<div class="home-intro-actions"><a class="home-inline-action" href="/archives/"><i class="fas fa-book-open"></i><span>查看全部文章</span></a><a class="home-inline-action" href="/about/"><i class="fas fa-user"></i><span>了解关于我</span></a></div>' +
      '</section>' +
      '<section class="home-section home-research-section"><div class="home-section-header"><div><p class="home-kicker">Research focus</p><h2>研究方向</h2></div></div>' +
        '<div class="research-grid">' + renderResearchCards(homeData.directions) + '</div></section>' +
      '<section class="home-section home-projects-section"><div class="home-section-header"><div><p class="home-kicker">Projects & practice</p><h2>项目与实践</h2></div><a href="/projects/">项目页</a></div>' +
        '<div class="project-preview-grid">' + renderProjectCards((projectData || {}).projects, 3, false) + '</div></section>' +
      '<section class="home-section home-posts-guide"><div class="home-section-header"><div><p class="home-kicker">首页结构 · Part 2</p><h2>所有博客文章</h2></div><a href="/archives/">进入文章归档</a></div>' +
        '<p>下面是博客目前收录的全部文章，按发布时间倒序排列。点击文章标题即可阅读正文。</p></section>';

    var articleList = recent.querySelector('.recent-post-items');
    recent.insertBefore(shell, articleList || recent.firstChild);
  }

  function initHome() {
    var recent = document.querySelector('#recent-posts');
    if (!recent) return;
    ensureHeroActions();
    if (recent.querySelector('.home-upgrade')) return;
    Promise.all([fetchJson('/data/homepage.json'), fetchJson('/data/projects.json')])
      .then(function (data) { renderHome(data[0], data[1]); })
      .catch(function (error) { console.warn('[TakamiyaBlog] homepage data unavailable', error); });
  }

  function initProjectsPage() {
    var page = document.querySelector('#projects-page');
    if (!page || page.dataset.loaded) return;
    page.dataset.loaded = 'true';
    fetchJson('/data/projects.json').then(function (data) {
      var grid = page.querySelector('.project-data-grid');
      if (grid) {
        grid.innerHTML = renderProjectCards(data.projects, 0, true) || '<p>项目数据暂未添加。</p>';
        initProjectSlides();
      }
    }).catch(function () {
      var grid = page.querySelector('.project-data-grid');
      if (grid) grid.innerHTML = '<p>项目数据暂时无法加载，请检查本地构建结果。</p>';
    });
  }

  function init() {
    initNavButtons();
    customizeAuthor();
    ensureVisitorFallback();
    numberArticleHeadings();
    initHome();
    initProjectsPage();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();
