/**
 * @author : gherardo varando (gherardo.varando@gmail.com)
 *
 * @license: GPL v3
 *     This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const fs = require('fs');
const {
    app
} = require('electron').remote;
const os = require('os');


exports.findKeyId = function(x, obj, tag) {
    tag = tag || '_id';
    for (let i in obj) {
        if (obj[i][tag] === x) return i;
    }
}


exports.nextKey = function(obj) {
    let finish = false;
    let key = 0;
    while (!finish) {
        if (Object.keys(obj).indexOf(`${key}`) >= 0) {
            key++;
        } else {
            finish = true;
        }
    }
    return key;
}

exports.parseTimeInterval = function(s) {
    if (s < 1000) {
        return `${s.toPrecision(3)} milliseconds`;
    } else if (s < 60000) {
        return `${(s/1000).toPrecision(2)} seconds`;
    } else if (s < 3600000) {
        return `${(s/60000).toPrecision(2)} minutes`;
    } else if (s < 86400000) {
        return `${(s/3600000).toPrecision(2)} hours`;
    } else {
        return `${(s/86400000).toPrecision(3)} days`;
    }
}


exports.div = function(className, text) {
    if (document) {
        let t = document.createElement('DIV');
        if (text) {
            t.innerHTML = text;
        }
        if (className) {
            t.className = className;
        }
        return t;
    }
}

exports.setProgress = function(val) {
    require('electron').remote.getCurrentWindow().setProgressBar(val / 100);
}

exports.stringify = function(object) {
    if (object) {
        return (JSON.stringify(object).replace(/\u007D/g, '').replace(/\u007B/g, '').replace(/\u0022/g, ''));
    }
    return null;
}

exports.isNode = function() {
    if (typeof module !== 'undefined' && module.exports) {
        return true;
    } else {
        return false;
    }
}

exports.isElectron = function() {
    if (process.versions.electron) {
        return true;
    } else {
        return false;
    }
}


exports.sum = function(v) {
    let sum = v.reduce((a, b) => {
        if (isNaN(b)) return a;
        return a + b;
    }, 0);
    return sum;
}


exports.mean = function(v) {
    let n = v.reduce((a, b) => {
        if (isNaN(b)) return a;
        return a + 1;
    }, 0);
    let sum = exports.sum(v);
    return (sum / n);
}

exports.clone = function(obj) {
    return Object.assign({}, obj);
    //return JSON.parse(JSON.stringify(obj));
}

exports.notifyOS = function(text) {
    var notif = new window.Notification(`${app.getName()}`, {
        body: text
    });
}

exports.readJSON = function(filename, callback, error) {
    fs.readFile(filename, 'utf-8', function(err, data) {
        if (err) {
            error(err);
            return;
        }
        var obj = JSON.parse(data);
        callback(obj);
    });
}

exports.readJSONsync = function(filename, error) {
    let data;
    try {
        data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (error) {
            error(err);
        }
        return null;
    }
}

exports.empty = function(parent, child) {
    if (parent) {
        if (child) {
            parent.removeChild(child);
            this.empty(parent, parent.firstChild);
        }
    }
}

exports.isIcon = function(icon) {
    if (icon) {
        if (icon.className) {
            if (icon.className.includes('fa') | icon.className.includes('icon')) return true;
        }
    }
    return false;
}

exports.icon = function(icon) {
    if (this.isIcon(icon)) return icon;
    if (typeof icon === 'string') {
        let ic;
        if (icon.includes('fa')) {
            ic = document.createElement('I');
            ic.className = icon;
        } else if (icon.includes('icon')) {
            ic = document.createElement('SPAN');
            ic.className = icon;
        } else {
            ic = document.createElement('SPAN');
        }
        return ic;
    } else {
        return document.createElement('DIV');
    }

}

// exports.setOne(obj, x, l) {
//     if (typeof obj[x] === 'undefined') {
//         for (let i in l) {
//             if (typeof obj[l[i]] != 'undefined') {
//                 obj[x] = obj[l[i]];
//                 break;
//             }
//         }
//
//     }
//     for (let i in l) {
//         delete obj[l[i]];
//     }
// }

//move this to appropriate util where used
// /**
//  * Layer utilities.
//  */
// exports.layers = {
//
//     /**
//      * Creates a JSON configuration file for a layer (pixels layer or points layer).
//      *
//      * @static
//      * @param {string} sourcePath - Path with source files to create JSON configuration.
//      * @param {string} destinationPath - Path where JSON configuration file will be saved.
//      * @param {Util.Layers.Mode} mode - JSON configuration mode (folder / single image / image list).
//      * @param {string} layerType - Layer type, points (objects) or pixels (holes).
//      * @param {function(string)} next - Callback for returning JSON Configuration file path.
//      */
//     createJSONConfiguration = function(sourcePath, destinationPath, mode, layerType, next) {
//         let template;
//
//         let dimPromise = new Promise((resolveDim, rejectDim) => {
//             if (mode === Util.Layers.Mode.FOLDER) {
//                 fs.readdir(sourcePath, (err, files) => {
//                     let aImage;
//                     let allStatsPromises = [];
//                     let xValues = [];
//                     let yValues = [];
//
//                     files.forEach(file => {
//                         let statPromise = new Promise((resolveStat) => {
//                             fs.stat(path.join(sourcePath, file), (err, stats) => {
//                                 if (stats.isFile()) {
//                                     let xRegex = /_X[0-9]+/g;
//                                     let yRegex = /_Y[0-9]+/g;
//
//                                     let xString = xRegex.exec(file);
//                                     let yString = yRegex.exec(file);
//
//                                     if (xString == null || yString == null) {
//                                         resolveStat();
//                                     } else {
//                                         let xNumRegex = /[0-9]+/g;
//                                         let yNumRegex = /[0-9]+/g;
//                                         let x = xNumRegex.exec(xString);
//                                         let y = yNumRegex.exec(yString);
//                                         xValues.push(x);
//                                         yValues.push(y);
//                                         if (aImage == null) aImage = file;
//                                         if (template == null) {
//                                             let xSplit = file.split(xString);
//                                             let tempTemplate = `${xSplit[0]}_X{x}${xSplit[1]}`;
//                                             let ySplit = tempTemplate.split(yString);
//                                             template = `${ySplit[0]}_Y{y}${ySplit[1]}`;
//                                         }
//                                         resolveStat();
//                                     }
//                                 } else {
//                                     resolveStat();
//                                 }
//                             });
//                         });
//                         allStatsPromises.push(statPromise);
//                     });
//
//                     Promise.all(allStatsPromises).then(() => {
//                         let xMin = Math.min(...xValues);
//                         let xMax = Math.max(...xValues);
//                         let yMin = Math.min(...yValues);
//                         let yMax = Math.max(...yValues);
//                         let xTiles = xMax - xMin + 1;
//                         let yTiles = yMax - yMin + 1;
//                         Util.Image.getSize(path.join(sourcePath, aImage), (err, width, height) => {
//                             if (!err) {
//                                 let tileSize = Math.max(width, height);
//                                 let size = Math.max(width * xTiles, height * yTiles);
//                                 resolveDim([tileSize, size]);
//                             } else {
//                                 rejectDim(err);
//                             }
//                         });
//                     });
//                 });
//             } else if (mode === Util.Layers.Mode.SINGLE_IMAGE) {
//                 Util.Image.getSize(sourcePath, (err, width, height) => {
//                     if (!err) {
//                         let tileSize = Math.max(width, height);
//                         let size = tileSize;
//                         resolveDim([tileSize, size]);
//                     } else {
//                         rejectDim(err);
//                     }
//                 });
//             } else if (mode === Util.Layers.Mode.IMAGE_LIST) {
//                 resolveDim([256, 256]); // temporary solution (bad sizes).
//             }
//         });
//
//         dimPromise.then((size) => {
//             let filename;
//             if (template != null) {
//                 filename = template;
//             } else {
//                 filename = path.basename(sourcePath);
//             }
//
//             let jsonConfig = {};
//
//             switch (layerType) {
//                 case `points`:
//                     jsonConfig = {
//                         name: `centroid_${filename}`,
//                         author: os.userInfo().username,
//                         type: `pointsLayer`,
//                         tileSize: size[0],
//                         size: size[1],
//                         pointsUrlTemplate: `points_${filename.replace(/ /g, "_")}.csv`
//                     }
//                     break;
//
//                 case `pixels`:
//                     jsonConfig = {
//                         name: `holes_${filename}`,
//                         author: os.userInfo().username,
//                         type: `pixelsLayer`,
//                         role: 'holes',
//                         tileSize: size[0],
//                         size: size[1],
//                         norm: size[2] || 1,
//                         pixelsUrlTemplate: `holes_${filename.replace(/ /g, "_")}.txt`
//                     }
//                     break;
//             }
//
//             next(jsonConfig);
//         });
//     }
//
// }
//
// /**
//  * JSON Configuration creation modes.
//  */
// exports.layers.Mode = {
//     SINGLE_IMAGE: 0,
//     FOLDER: 1,
//     IMAGE_LIST: 2
// }
//
// /**
//  * Image utilities.
//  */
// exports.image =  {
//
//     /**
//      * Calculates slice number of an image.
//      *
//      * @static
//      * @param {string} imagePath - Source image path.
//      * @returns {number} Number of slices.
//      */
//     getTotalSlices: function(imagePath) {
//         if (imagePath.endsWith(".tif") || imagePath.endsWith(".tiff")) {
//             let data = fs.readFileSync(imagePath);
//             let tiffImage = new Tiff({
//                 buffer: data
//             });
//             return tiffImage.countDirectory();
//         } else {
//             // Only tiff images have more than one slice.
//             return 1;
//         }
//     },
//
//     /**
//      * Calculates size (width and height) of an image.
//      *
//      * @static
//      * @param {string} imagePath - Source image path.
//      * @param {function(string, number, number)} next - Callback for returning image dimensions (or error).
//      */
//     getSize: function(imagePath, next) {
//         if (imagePath.endsWith(".tif") || imagePath.endsWith(".tiff")) {
//             fs.readFile(imagePath, (err, data) => {
//                 if (!err) {
//                     try {
//                         let tiffImage = new Tiff({
//                             buffer: data
//                         });
//                         tiffImage.setDirectory(0);
//                         next(null, tiffImage.toCanvas().width, tiffImage.toCanvas().height);
//                     } catch (err) {
//                         next(null, 256, 256); // default
//                     }
//                 } else {
//                     next(err);
//                 }
//             });
//         } else {
//             let dim = sizeOf(imagePath);
//             next(null, dim.width, dim.height);
//         }
//     }
//
// }
