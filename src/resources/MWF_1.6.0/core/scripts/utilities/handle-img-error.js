window.handleImgError = function(el, size) {
    el.onerror = '';

    if (size === 'small'){
        size = 'small';
    } else {
        size = 'large';
    }

    if (el.previousSibling.srcset !== null){
        var siblings = el.parentNode.childNodes;

        for (var i = 0; i < siblings.length; i++) {
            if (siblings[i] !== el && siblings[i].nodeName == 'SOURCE'){
                siblings[i].srcset = '';
            }
        }
    }
    el.srcset = '';
    el.src = '/images/content-images/generic-glyph-default-' + size + '.png';

    return true;
};

export default handleImgError;