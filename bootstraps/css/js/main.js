(function () {
    "use strict";

    function safeText(s) {
        if (!s) return '';
        return String(s).trim();
    }

    function filenameFromSrc(src) {
        try {
            const u = new URL(src, location.href);
            return (u.pathname.split('/').pop() || '').replace(/[-_]/g, ' ').replace(/\.[a-z0-9]+$/i, '');
        } catch {
            return '';
        }
    }

    function extractFromFigure(img) {
        const fig = img.closest('figure');
        if (!fig) return '';
        const cap = fig.querySelector('figcaption');
        return cap ? safeText(cap.textContent) : '';
    }

    // Ganti semua <img> menjadi card artikel (menghapus tag img).
    function replaceImagesWithArticles(options = {}) {
        const imgs = Array.from(document.querySelectorAll('img'));
        imgs.forEach(img => {
            const src = img.getAttribute('src') || img.dataset.src || '';
            const fromFigure = extractFromFigure(img);

            const title = safeText(
                img.getAttribute('data-title') ||
                img.alt ||
                img.getAttribute('title') ||
                fromFigure ||
                filenameFromSrc(src) ||
                'Judul artikel'
            );

            const excerpt = safeText(
                img.getAttribute('data-excerpt') ||
                img.getAttribute('data-summary') ||
                fromFigure ||
                ''
            );

            const date = safeText(
                img.getAttribute('data-date') ||
                img.dataset.date ||
                (img.closest('time') ? img.closest('time').textContent : '')
            );

            const showThumb = img.getAttribute('data-thumb') === 'true' || options.forceThumb === true;

            const article = document.createElement('article');
            article.className = 'article-card';
            article.setAttribute('role', 'article');

            // Optional thumbnail (background) — image file tetap dihapus dari DOM
            if (showThumb && src) {
                const thumb = document.createElement('div');
                thumb.className = 'article-card-thumb';
                thumb.style.backgroundImage = `url("${src}")`;
                article.appendChild(thumb);
            }

            const header = document.createElement('div');
            header.className = 'article-card-header';

            const h = document.createElement('h3');
            h.className = 'article-card-title';
            h.textContent = title;
            header.appendChild(h);

            if (date) {
                const time = document.createElement('time');
                time.className = 'article-card-date';
                time.textContent = date;
                header.appendChild(time);
            }

            const body = document.createElement('div');
            body.className = 'article-card-body';

            if (excerpt) {
                const p = document.createElement('p');
                p.className = 'article-card-excerpt';
                p.textContent = excerpt;
                body.appendChild(p);
            }

            // preserve parent link if exists
            const parentLink = img.closest('a');
            if (parentLink && parentLink.href) {
                const a = document.createElement('a');
                a.href = parentLink.href;
                a.className = 'article-card-link';
                a.appendChild(header);
                a.appendChild(body);
                article.appendChild(a);
            } else {
                article.appendChild(header);
                article.appendChild(body);
            }

            img.replaceWith(article);
        });
    }

    // Hapus semua <img> tanpa mengganti
    function removeImages() {
        document.querySelectorAll('img').forEach(i => i.remove());
    }

    // Auto-run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => replaceImagesWithArticles());
    } else {
        replaceImagesWithArticles();
    }

    // API untuk kontrol manual
    window.__imageToArticle = {
        replace: replaceImagesWithArticles,
        remove: removeImages
    };
})();