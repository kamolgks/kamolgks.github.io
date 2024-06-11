$(function () {
    var title = document.title,
        animSeq = ["/", "-", "\\", "|"],
        animIndex = 0,
        titleIndex = 0;

    function doInverseSpinZeroPitch() {
        var loadTitle = title.substring(0, titleIndex);
        if (titleIndex >= title.length) {
            titleIndex = 0;
        }
        document.title = loadTitle + animSeq[animIndex];
        animIndex = (animIndex + 1) % animSeq.length;
        titleIndex++;
    }

    window.setInterval(doInverseSpinZeroPitch, 150);
});
