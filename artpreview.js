

var imageLoadedCallback = null;

(function($){

    var radius = 0.5;

    imageLoadedCallback = function() {

        $('#load-controls').hide();
        $('#image-controls').show();

        var $canvas = $('#canvas');
        var $cursor = $('#cursor');
        var ctx = $canvas[0].getContext('2d');

        $canvas.mousemove(function(e) {
            var offset = $canvas.offset();

            var x = e.pageX - offset.left + 0.5;
            var y = e.pageY - offset.top + 0.5;

            var rSum = 0;
            var gSum = 0;
            var bSum = 0;
            var samples = 0;

            for(var x1 = x - radius; x1 < (x + radius); x1 += 1) {
                for(var y1 = y - radius; y1 < (y + radius); y1 += 1) {
                    var p = ctx.getImageData(x1, y1, 1, 1).data;
                    rSum += p[0];
                    gSum += p[1];
                    bSum += p[2];
                    samples += 1;
                }
            }

            var r = Math.round(rSum/samples);
            var g = Math.round(gSum/samples);
            var b = Math.round(bSum/samples);
            var hex = "#" + ("000000" + rgbToHex(r,g,b)).slice(-6);
            $('#colour-preview').css({
               backgroundColor: hex
            });
            $('#status').html(hex);
        });


        updateCursorSize();
        $('#averager').val(radius * 2).change(function(){
            radius = $(this).val() / 2;
            updateCursorSize();
        });

        $(document).on('mousemove', function(e){
            $cursor.css({
                left:  e.pageX - radius,
                top:   e.pageY - radius
            });
        });

        function updateCursorSize() {
            $cursor.css({
                width: radius * 2,
                height: radius * 2
            });
        }

    }

})(jQuery);


function euclidean(x1,x2,y1,y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt( a*a + b*b );
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function loadImage() {
    var input, file, fr, img;

    if (typeof window.FileReader !== 'function') {
        write("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('imgfile');
    if (!input) {
        write("Um, couldn't find the imgfile element.");
    }
    else if (!input.files) {
        write("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        write("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = createImage;
        fr.readAsDataURL(file);
    }

    function createImage() {
        img = new Image();
        img.onload = imageLoaded;
        img.src = fr.result;
    }

    function imageLoaded() {
        var canvas = document.getElementById("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0);
        if (imageLoadedCallback) {
            imageLoadedCallback();
        }
    }

    function write(msg) {
        var p = document.getElementsByTagName("BODY")[0];
        p.innerHTML = msg;
    }
}