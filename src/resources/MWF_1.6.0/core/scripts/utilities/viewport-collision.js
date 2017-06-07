import {getClientRect, isObjectEmpty} from './helpers.js';

const ViewportCollision = {
    collidesWith: function(el) {
        var elRect = getClientRect(el);
        var collisionDetected = {};
        //Detecting width to account for lingering listeners and hidden elements - without it collision would be detected at 0,0 (top,left) for hidden elements or non removed listeners.
        if (elRect.width !== 0) {
            if (elRect.top <= 0) {
                collisionDetected.top = true;
            }
            if (elRect.bottom >= (window.innerHeight || document.documentElement.clientHeight)) {
                collisionDetected.bottom = true;
            }
            if (elRect.left <= 0) {
                collisionDetected.left = true;
            }
            if(elRect.right >= (window.innerWidth || document.documentElement.clientWidth)) {
                collisionDetected.right = true;
            }
        }

        if (isObjectEmpty(collisionDetected) === false) {
            return collisionDetected;
        }

        return false;
    }
};

export default ViewportCollision;