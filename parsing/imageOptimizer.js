const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// import files from the directory
const files = fs.readdirSync(path.join(__dirname, './home/tutor_imgs'));
// convert files to webp
// resize the image to 500px width keeping the aspect ratio
files.forEach(file => {
    sharp(path.join(__dirname, './home/tutor_imgs', file)).resize(56)
        .webp({ quality: 75 })
        .toFile(path.join(__dirname, './../../tutors-resized', file.split('.')[0] + '.webp'));
});
