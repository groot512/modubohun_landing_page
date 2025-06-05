// 모두보훈 랜딩페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 요소들
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // 모바일 메뉴 토글
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
        });
    }

    // 네비게이션 링크 클릭 시 메뉴 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });

    // 스크롤 시 헤더 스타일 변경
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // 부드러운 스크롤 구현
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 숫자 애니메이션 함수
    function animateNumber(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateNumber() {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString('ko-KR');
            } else {
                element.textContent = Math.floor(start).toLocaleString('ko-KR');
                requestAnimationFrame(updateNumber);
            }
        }

        updateNumber();
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');

                // 통계 숫자 애니메이션
                if (entry.target.classList.contains('stat__number')) {
                    const target = parseInt(entry.target.dataset.target);
                    animateNumber(entry.target, target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들 관찰
    const animateElements = document.querySelectorAll(`
        .overview__card,
        .feature__card,
        .step,
        .partner__card,
        .contact__card,
        .stat__number
    `);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 폼 유효성 검사 (연락처 폼이 있다면)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 간단한 성공 메시지
            alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
        });
    }

    // 키보드 네비게이션 향상
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모바일 메뉴 닫기
        if (e.key === 'Escape' && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });

    // 터치 이벤트 최적화 (모바일)
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartY - touchEndY;

        // 위로 스와이프 시 헤더 숨기기 (선택사항)
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // 위로 스와이프
                header.style.transform = 'translateY(-100%)';
            } else {
                // 아래로 스와이프
                header.style.transform = 'translateY(0)';
            }
        }
    }

    // 성능 최적화: 스크롤 이벤트 throttling
    let ticking = false;

    function updateOnScroll() {
        // 스크롤 기반 애니메이션이나 효과가 있다면 여기에 추가
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', function(e) {
        // URL 해시에 따른 섹션 스크롤
        if (location.hash) {
            const target = document.querySelector(location.hash);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    // 페이지 로드 시 해시 처리
    if (location.hash) {
        setTimeout(() => {
            const target = document.querySelector(location.hash);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // 이미지 지연 로딩 (Lazy Loading)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 다크 모드 감지 및 처리 (선택사항)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function handleColorSchemeChange(e) {
        // 다크 모드 스타일이 있다면 여기에 적용
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // 초기 체크
    handleColorSchemeChange(prefersDarkScheme);

    // 변경 감지
    prefersDarkScheme.addListener(handleColorSchemeChange);

    // 접근성 향상: 포커스 표시
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // 에러 처리
    window.addEventListener('error', function(e) {
        console.error('JavaScript 오류:', e.error);
        // 프로덕션에서는 에러 리포팅 서비스로 전송
    });

    // 페이지 언로드 시 정리
    window.addEventListener('beforeunload', function() {
        // 필요한 정리 작업이 있다면 여기에 추가
        observer.disconnect();
        imageObserver.disconnect();
    });

    console.log('모두보훈 랜딩페이지가 성공적으로 로드되었습니다.');
});

// 유틸리티 함수들
const Utils = {
    // 디바운스 함수
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // 스로틀 함수
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 엘리먼트가 뷰포트에 있는지 확인
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 쿠키 설정/가져오기 (필요한 경우)
    setCookie: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    },

    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};

// 글로벌 설정
window.ModubohunConfig = {
    version: '1.0.0',
    launchDate: '2025-08-01',
    debug: false
};