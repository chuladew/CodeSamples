/**
 * Created by chulas on 11/06/2020.
 */

(function () {
    function TableSeats (options) {
        this.options = {
            seatsPerShape:  {
                square: {
                    2: [1, 0, 1, 0],
                    4: [1, 1, 1, 1],
                    6: [2, 1, 2, 1],
                    8: [2, 2, 2, 2]
                },
                wideRect: {
                    2: [1, 0, 1, 0],
                    4: [2, 0, 2, 0],
                    6: [3, 0, 3, 0],
                    8: [3, 1, 3, 1]
                },
                tallRect: {
                    2: [0, 1, 0, 1],
                    4: [0, 2, 0, 2],
                    6: [0, 3, 0, 3],
                    8: [1, 3, 1, 3]
                }
            }
        };
        if (options && typeof options === "object" && !_.isArray(options) && !_.isEmpty(options)) {
            this.options = _(this.options).extend(options);
        }
        this._init();
    }

    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = TableSeats;
    } else {
        window.TableSeats = TableSeats;
    }
})();

/**
 * Initialize Highlighter
 * @private
 */
TableSeats.prototype.getSeatPositions = function (shape, tableSize, tblWidth, tblHeight, fill, isOccupied) {
    let self = this,
        styles = [],
        size = parseInt(tableSize),
        width = parseInt(tblWidth),
        height = parseInt(tblHeight);

    switch (shape) {
        case "quad":
        case "quad rotated":
            styles = self._getSeatPositionsForRect(size, width, height, fill, isOccupied);
        break;
        case "custom":
        case "quad custom":
            styles = self._getSeatPositionsForRect(2, width, height, fill, isOccupied);
        break;
        case "ellipse":
            styles = self._getSeatPositionsForEllipse(size, width, fill, isOccupied);
        break;
    }

    return styles;
}

/**
 * Initialize Highlighter
 * @private
 */
TableSeats.prototype._getSeatPositionsForRect = function (size, width, height, fill, isOccupied) {
    let angle = 90,
        rotation = 0,
        offset = 4,
        rectType,
        length,
        translateY,
        translateX,
        item,
        i, x,
        spacing,
        radius,
        top,
        numOfSeats,
        styles = [];

    if (width === height) {
        rectType ='square';
    } else if (width > height) {
        rectType ='wideRect';
    } else {
        rectType ='tallRect';
    }

    var seatsPerSide = this.options.seatsPerShape[rectType][size];

    if (! seatsPerSide) {
        return styles;
    }

    for (i = 0; i < 4; i++) {
        radius = (rotation === 0 || rotation === 180) ? height : width;
        translateY = Math.ceil(radius / 2) + offset;

        numOfSeats = seatsPerSide[i];
        length = (rotation === 0 || rotation === 180) ? width : height;
        spacing = (length - (numOfSeats * 30)) / (numOfSeats + 1);
        translateX = Math.ceil(length / 2);
        top = -translateX + 15 + spacing;

        for (x = 0; x < numOfSeats; x++) {
            item = {
                transform: 'rotate('+rotation+'deg) translate('+top+'px, '+-translateY+'px)'
            };
            if (isOccupied) {
                item.background = fill;
            }
            styles.push(item);
            top += 30 + spacing;
        }
        rotation += angle;
    }
    return styles;
};


TableSeats.prototype._getSeatPositionsForEllipse = function (size, diameter, fill, isOccupied) {
    let angle = 360 / size,
        rotation = 0,
        transforms = [],
        offset = 2;

    for (let i = 0; i < size; i++) {
        const translateY = Math.ceil(parseInt(diameter) / 2) + offset,
            style = {
                transform: 'rotate(' + rotation + 'deg) translate(0px, ' + -translateY + 'px)'
            };
        if (isOccupied) {
            style.background = fill;
        }
        transforms.push(style);
        rotation = rotation + angle;
    }
    return transforms;
};
