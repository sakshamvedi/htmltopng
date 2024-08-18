
(function loadHtml2Canvas() {
    var script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.js';
    script.async = true;
    document.head.appendChild(script);
})();


function takeshot(containerSelectors, outputSelector, filename) {
    if (!Array.isArray(containerSelectors)) {
        containerSelectors = [containerSelectors];
    }

    var output = document.querySelector(outputSelector);
    var originalViewportMeta = document.querySelector('meta[name="viewport"]');
    var originalViewportContent = originalViewportMeta ? originalViewportMeta.getAttribute('content') : null;
    var originalBodyOverflow = document.body.style.overflow;


    if (originalViewportMeta) {
        document.head.removeChild(originalViewportMeta);
    }


    var desktopViewportMeta = document.createElement('meta');
    desktopViewportMeta.name = "viewport";
    desktopViewportMeta.content = "width=1024";
    document.head.appendChild(desktopViewportMeta);


    document.body.style.overflow = "auto";

    output.innerHTML = "";
    output.style.display = "block";


    let capturePromises = containerSelectors.flatMap(selector => {
        let container = document.querySelector(selector);
        return Array.from(container.children).map(child =>
            html2canvas(child, { scale: 1 })
        );
    });

    Promise.all(capturePromises).then(canvases => {
        canvases.forEach(canvas => output.appendChild(canvas));

        html2canvas(output, { scale: 1 }).then(canvas => {
            var image = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.href = image;
            link.download = filename || 'screenshot.png';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (originalViewportMeta) {
                document.head.appendChild(originalViewportMeta);
            }
            document.body.style.overflow = originalBodyOverflow;
            output.style.display = "none";
        });
    });
}


window.takeshot = takeshot;