
import breakpoints from '../../../config.breakpoints.js';
import breakpointTracker from '../../../breakpointTracker.js';
import {getWindowWidth} from '../../../helpers.js';

let MosaicPlacement = function(element) {
    this.element = element;

    return this.init();
};

MosaicPlacement.prototype.init = function() {
    this.update(getWindowWidth());
    breakpointTracker.subscribe(this, this.update);
    return this;
};

MosaicPlacement.prototype.removeSizeClasses = function () {
    this.element.className = this.element.className.replace( /(?:^|\s)(f-height-[a-zA-Z]+|f-width-[a-zA-Z]+)(?!\S)/g , '' );
};

MosaicPlacement.prototype.sizeClassNames = {
    width: {
        large: "f-width-large",
        small: "f-width-small"
    },
    height: {
        large: "f-height-large",
        medium: "f-height-medium",
        small: "f-height-small"
    }
};

MosaicPlacement.prototype.getDimensions = function() {
    return {
        width: this.element.clientWidth,
        height: this.element.clientHeight
    };
};

// This defines mappings between breakpoints, widths, and heights of MosaicPlacements.
// The index of the array for each set of mappings correspond to the breakpoint
// index that they should be applied to. Within each mapping the values resolve
// height and width.
MosaicPlacement.prototype.mappings = [
    [
        [300, 0],
        [150, 320],
        [0, 160]
    ],
    [
        [300, 540],
        [150, 270],
        [0, 135]
    ],
    [
        [400, 768],
        [200, 384],
        [0, 0]
    ],
    [
        [400, 542],
        [200, 271],
        [0, 135]
    ],
    [
        [400, 542],
        [200, 271],
        [0, 135]
    ],
    [
        [400, 542],
        [200, 271],
        [0, 135]
    ]
];

MosaicPlacement.prototype.applySizeClasses = function(windowWidth) {
    var dimensions = this.getDimensions(),
        sizeClasses = {};

    for (var i = breakpoints.length - 1; i >= 0; i--) {
        if (windowWidth >= breakpoints[i]) {
            if (dimensions.height >= this.mappings[i][0][0]) { // large
                sizeClasses.h = this.sizeClassNames.height.large;
                sizeClasses.w = dimensions.width >= this.mappings[i][0][1] ? this.sizeClassNames.width.large : this.sizeClassNames.width.small;
            } else if (dimensions.height >= this.mappings[i][1][0]) {
                sizeClasses.h = this.sizeClassNames.height.medium;
                sizeClasses.w = dimensions.width >= this.mappings[i][1][1] ? this.sizeClassNames.width.large : this.sizeClassNames.width.small;
            } else {
                sizeClasses.h = this.sizeClassNames.height.small;
                sizeClasses.w = dimensions.width >= this.mappings[i][2][1] ? this.sizeClassNames.width.large : this.sizeClassNames.width.small;
            }

            break;
        }
    }

    this.element.className += " " + sizeClasses.w + " " + sizeClasses.h;
};

MosaicPlacement.prototype.update = function(windowWidth) {
    this.removeSizeClasses();
    this.applySizeClasses(windowWidth);
};

export default MosaicPlacement;