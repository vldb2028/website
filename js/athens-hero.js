/**
 * Hero-only carousel: three random images from img/athens/, rotate every few seconds.
 * Expects merged.js to target a separate hidden .carousel[data-images] decoy on index.html.
 */
(function (doc) {
    var root = doc.querySelector('.carousel.hero');
    if (!root) {
        return;
    }

    var POOL = [
        'img/athens/athens_vldb_22.webp',
        'img/athens/athens_vldb_updated_5.webp',
        'img/athens/athens_vldb_3.webp'
    ];

    var ROTATE_MS = 5000;

    var queue = POOL.slice();
    var preLoaded = [];

    function clearPrev() {
        [].forEach.call(root.querySelectorAll('div:not(:last-child)'), function (el) {
            root.removeChild(el);
        });
    }

    function loadNext() {
        if (queue.length === 0) {
            return startRotate();
        }
        var url = queue.shift();
        var img = new Image();
        img.onload = function () {
            this.onerror = this.onabort = this.onload = null;
            preLoaded.push({ i: url, t: 'Athens' });
            loadNext();
        };
        img.onerror = img.onabort = function () {
            this.onerror = this.onabort = this.onload = null;
            loadNext();
        };
        img.src = url;
    }

    var idx = -1;
    var empty = true;

    root.addEventListener('transitionend', function () {
        clearPrev();
    });

    function startRotate() {
        if (preLoaded.length === 0) {
            return;
        }

        (function showNext() {
            var n = preLoaded.length;
            if (n === 0) {
                return;
            }
            idx = (idx + 1) % n;
            var obj = preLoaded[idx];
            var url = obj && obj.i;
            if (!url) {
                setTimeout(showNext, ROTATE_MS);
                return;
            }

            var child = doc.createElement('div');
            child.style.backgroundImage = 'url("' + url.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '")';
            child.setAttribute('data-url', url);
            doc.body.setAttribute('carousel-img', url);

            if (obj.t) {
                var credit = doc.createElement('div');
                credit.classList.add('carousel-credit');
                credit.innerHTML = obj.t;
                child.appendChild(credit);
            }

            root.appendChild(child);

            setTimeout(function () {
                child.style.opacity = 1;
                empty = false;
            }, empty ? 100 : 1000);

            setTimeout(function () {
                clearPrev();
            }, 3000);

            setTimeout(showNext, ROTATE_MS);
        })();
    }

    loadNext();
})(document);
