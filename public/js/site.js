document.addEventListener('DOMContentLoaded', () => {
  // 1. 移动端导航开关与子菜单折叠
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('.mobile-sub-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = btn.closest('li.has-mega');
      if (parentLi) parentLi.classList.toggle('sub-open');
    });
  });

  // 2. 通用轮播初始化（首页大轮播 & 产品详情图集轮播）
  function initSlider(selector, autoInterval = 4500) {
    const box = document.querySelector(selector);
    if (!box) return;
    const slides = Array.from(box.querySelectorAll('.bd ul > li'));
    const thumbs = Array.from(box.querySelectorAll('.hd ul > li'));
    const prevBtn = box.querySelector('.prev');
    const nextBtn = box.querySelector('.next');
    if (slides.length <= 1) {
      if (slides[0]) slides[0].classList.add('is-active');
      if (thumbs[0]) thumbs[0].classList.add('on');
      return;
    }

    let current = 0;
    let timer = null;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((el, i) => el.classList.toggle('is-active', i === current));
      thumbs.forEach((el, i) => el.classList.toggle('on', i === current));
    };

    const startAuto = () => {
      stopAuto();
      timer = setInterval(() => goTo(current + 1), autoInterval);
    };
    const stopAuto = () => {
      if (timer) clearInterval(timer);
    };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('mouseenter', () => {
        if (window.innerWidth > 640) { goTo(i); stopAuto(); }
      });
      thumb.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    box.addEventListener('mouseenter', stopAuto);
    box.addEventListener('mouseleave', startAuto);

    goTo(0);
    startAuto();
  }

  initSlider('.slideBox', 3800);
  initSlider('.slideBox-2', 4000);

  // 3. 通用 Tab 切换（首页 5大产品、7大优势、4大FAQ）
  function initTabs(selector) {
    document.querySelectorAll(selector).forEach((box) => {
      const tabs = Array.from(box.querySelectorAll('.hd ul > li'));
      const panels = Array.from(box.querySelectorAll('.bd > .bd-div'));
      if (!tabs.length || !panels.length) return;

      const activate = (idx) => {
        tabs.forEach((t, i) => t.classList.toggle('on', i === idx));
        panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      };

      tabs.forEach((tab, idx) => {
        tab.addEventListener('mouseenter', () => {
          if (window.innerWidth > 640) activate(idx);
        });
        tab.addEventListener('click', () => activate(idx));
      });
      activate(0);
    });
  }

  initTabs('.slideTxtBox');
  initTabs('.slideTxtBox-2');
  initTabs('.slideTxtBox-3');

  // 4. 页脚二维码切换
  const qrItems = Array.from(document.querySelectorAll('.bot-qiehuan .hd ul > li'));
  qrItems.forEach((li) => {
    const activate = () => {
      qrItems.forEach((item) => item.classList.toggle('on', item === li));
    };
    li.addEventListener('mouseenter', () => {
      if (window.innerWidth > 640) activate();
    });
    li.addEventListener('click', activate);
  });

  // 5. 工程案例弹窗预览
  const modal = document.querySelector('.zhezhaoceng');
  if (modal) {
    const modalImg = modal.querySelector('.li-cont img');
    const modalTitle = modal.querySelector('.li-cont h5 a');
    const modalDesc = modal.querySelector('.li-cont p a');
    const shutBtn = modal.querySelector('.shut');

    document.querySelectorAll('.list-5 ul > li[data-modal="true"]').forEach((li) => {
      li.addEventListener('click', (e) => {
        e.preventDefault();
        if (modalImg) modalImg.src = li.dataset.img || '';
        if (modalTitle) {
          modalTitle.textContent = li.dataset.title || '';
          modalTitle.href = li.dataset.href || '#';
        }
        if (modalDesc) {
          modalDesc.textContent = li.dataset.desc || '';
          modalDesc.href = li.dataset.href || '#';
        }
        modal.style.display = 'block';
      });
    });

    const closeModal = () => { modal.style.display = 'none'; };
    shutBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 6. 顶部及移动端菜单搜索框无参数跳转（地址栏只显示 /search/，不带 ?q=）
  document.querySelectorAll('form.search-form').forEach((searchForm) => {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = searchForm.querySelector('input[name="q"]');
      const q = (input?.value || '').trim();
      try {
        sessionStorage.setItem('yinai_search_q', q);
      } catch {}
      window.location.href = '/search/';
    });
  });
});