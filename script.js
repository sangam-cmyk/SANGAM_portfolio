// duplicate marquees for seamless loop
for (const id of ['mq', 'lt1', 'lt2']) {
    const el = document.getElementById(id);
    if (el) el.innerHTML += el.innerHTML;
}

// scroll progress + nav shrink
const prog = document.getElementById('progress'),
      nav = document.getElementById('nav');

let ticking = false;

function onScroll() {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight);

    prog.style.width = (p * 100) + '%';
    nav.classList.toggle('tight', h.scrollTop > 60);

    // hero parallax
    const par = document.querySelector('[data-parallax]');
    if (
        par &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        par.style.transform =
            'translate3d(0,' +
            (h.scrollTop * parseFloat(par.dataset.parallax)) +
            'px,0) scale(1.08)';
    }

    ticking = false;
}

addEventListener(
    'scroll',
    () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    },
    { passive: true }
);

onScroll();

// reveal animations
const io = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

document
    .querySelectorAll('.rv, .stagger')
    .forEach(el => io.observe(el));

// animated counter
const counter = document.querySelector('[data-count]');

if (counter) {
    const target = +counter.dataset.count;

    const counterObserver = new IntersectionObserver(
        entries => {
            if (!entries[0].isIntersecting) return;

            counterObserver.disconnect();

            if (
                matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                counter.textContent = '+' + target + '%';
                return;
            }

            const start = performance.now();
            const duration = 1400;

            const animate = now => {
                const progress = Math.min(
                    (now - start) / duration,
                    1
                );

                const eased = 1 - Math.pow(1 - progress, 3);

                counter.textContent =
                    '+' + Math.round(target * eased) + '%';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        },
        {
            threshold: 0.5
        }
    );

    counterObserver.observe(counter);
}