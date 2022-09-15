document.body.addEventListener('touchmove', function (evt) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    evt.preventDefault()
}, {
    passive: false
})



/**
 *
 * 识别移动设备
 * 检测相应的设备。
 * */
var canvas = document.getElementById('Canvas');

var ua = navigator.userAgent;

var system = {
    win: false,
    mac: false,
    x11: false,
    //mobile
    iphone: false,
    ipad: false,
    ios: false,
    android: false,
    winMobile: false
};

var p = navigator.platform;
system.win = p.indexOf('Win') == 0;
system.mac = p.indexOf('Mac') == 0;
system.x11 = (p == 'x11') || (p.indexOf('Linux') == 0);

system.iphone = ua.indexOf('iPhone') > -1;
system.ipad = ua.indexOf('iPad') > -1;
system.android = ua.indexOf('Android') > -1;

var viewHeight, viewWidth, proportion;

function getViewPort() {
    viewHeight = window.innerHeight || document.documentElement.clientHeight;
    viewWidth = window.innerWidth || document.documentElement.clientWidth;
    document.body.style.width = viewWidth;
    proportion = (viewWidth / 750);
    canvas.width = viewWidth;
    canvas.height = viewHeight;

}

function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function init() {
    getViewPort();
    main();
}


$(window).resize(getViewPort);

//创建一个舞台，得到一个参考的画布
var stage = new createjs.Stage(canvas);
createjs.Touch.enable(stage)

function main() {

    var manifest;
    var preload;

    //构建显示对象的容器
    var container = new createjs.Container();
    var loadingbox = new createjs.Shape(),
        loadingbg = new createjs.Shape(),
        loadingsp = new createjs.Shape();

    //加载loading 
    loadingbox.graphics.beginFill('#73033d').rr((canvas.width - 460 * proportion) / 2, (canvas.height - 44 *
        proportion) / 2, 460 * proportion, 44 * proportion, 22 * proportion);
    loadingbg.graphics.beginFill('#000').rr((canvas.width - 450 * proportion) / 2, (canvas.height - 34 *
        proportion) / 2, 450 * proportion, 34 * proportion, 17 * proportion);

    var progressText = new createjs.Text("", "40px Arial", "#fff");
    progressText.y = (canvas.height - progressText.getMeasuredHeight() * proportion) / 2 + 44 * proportion *
        1.5;

    var ossURL = "https://oss-baijiuxuefang.oss-cn-beijing.aliyuncs.com/oss-baijiuxuefang/njjh/"
    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: "./assets/music/GoWest.mp3",
            id: "GoWest"
        }];
        for (var i = 1; i < 165; i++) {
            manifest.push({
                src: ossURL + i + ".jpg",
                id: 'bg' + i
            })
        };

    }

    //开始预加载
    function startPreload() {
        preload = new createjs.LoadQueue(true);
        //注意加载音频文件需要调用如下代码行
        preload.installPlugin(createjs.Sound);
        preload.on("fileload", handleFileLoad);
        preload.on("progress", handleFileProgress);
        preload.on("complete", loadComplete);
        preload.on("error", loadError);
        preload.loadManifest(manifest);

    }

    //处理单个文件加载
    function handleFileLoad(event) {
        var mymusic;
        if (event.item.id == "GoWest") {
            if (is_weixn()) {
                if (typeof window.WeixinJSBridge ==
                    "object" &&
                    typeof window.WeixinJSBridge
                        .invoke ==
                    "function"
                ) {
                    window.
                        WeixinJSBridge
                        .invoke(
                            'getNetworkType', {}, () => {
                                mymusic = createjs.Sound.play("GoWest");
                                mymusic.loop = -1;
                            })
                }
            } else {
                mymusic = createjs.Sound.play("GoWest");
                mymusic.loop = -1;
            }
        }
    }

    //处理加载错误：大家可以修改成错误的文件地址，可在控制台看到此方法调用
    function loadError(evt) {
        console.log("加载出错！", evt.text);
    }

    //已加载完毕进度
    function handleFileProgress(event) {
        progressText.text = (preload.progress * 100 | 0) + " %";
        progressText.x = canvas.width / 2 - progressText.getMeasuredWidth() / 2;
        // console.log(ratio*canvas.width / 100 * (preload.progress * 100 | 0));
        if ((preload.progress * 100 | 0) > 10) {
            loadingsp.graphics.beginFill('#8d0657').rr((canvas.width - 450 * proportion) / 2, (canvas.height -
                34 * proportion) / 2, 450 * proportion / 100 * (preload.progress * 100 | 0), 34 *
            proportion, 17 * proportion);
        } else {
            loadingsp.graphics.beginFill('#8d0657').rr((canvas.width - 450 * proportion) / 2, (canvas.height -
                34 * proportion) / 2, 450 * proportion / 100 * 10, 34 * proportion, 17 * proportion);
        }
        container.addChild(loadingbox, loadingbg, loadingsp, progressText);
        stage.addChild(container);
        stage.update();
    }

    //全度资源加载完毕
    function loadComplete(event) {
        console.log("已加载完毕全部资源");
        Animate_Conter_page2();
        container.removeAllChildren();
        stage.update();
    }

    setupManifest();
    startPreload();


    function Animate_Conter_page2() {

        var page2background = new createjs.Bitmap(preload.getResult("bg1"));
        page2background.x = (canvas.width - 765 * proportion) / 2;
        page2background.y = (canvas.height - 1024 * proportion) / 2;
        page2background.scaleX = proportion;
        page2background.scaleY = proportion;

        container.addChild(page2background);
        stage.addChild(container);

        var startY, moveEndY, Y, img_count = 0, speed = 100;
        canvas.addEventListener("touchstart", function (e) {
            console.log(1)
            startY = e.changedTouches[0].clientY - canvas.offsetTop;
        })

        canvas.addEventListener("touchmove", function (e) {
            container.removeAllChildren();
            console.log(2)
            console.log("滑动距离")
            moveEndY = e.changedTouches[0].clientY - canvas.offsetTop
            Y = parseInt(moveEndY - startY);
            if (Y < 0 && img_count > 0) {
                console.log("上滑")
            } else {
                console.log("下滑")
            }

            console.log(parseInt((img_count + Y) / speed))

            var page2background = new createjs.Bitmap(preload.getResult("bg" + parseInt((img_count + Y) / speed)));
            page2background.x = (canvas.width - 765 * proportion) / 2;
            page2background.y = (canvas.height - 1024 * proportion) / 2;
            page2background.scaleX = proportion;
            page2background.scaleY = proportion;

            container.addChild(page2background);
            stage.addChild(container);
        })
        canvas.addEventListener("touchend", function (e) {
            img_count = parseInt(img_count + Y)
            console.log(img_count)
        })

        createjs.Ticker.addEventListener("tick", tickhandle);
    }

    //监听事件，30fps更新stage
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tickhandle);

    function tickhandle() {
        stage.update()
    }
}

function mask_gif(gif_image) {
    // 背景特效 烦恼雪花GIF
    var gif_animate = new createjs.SpriteSheet({
        "images": gif_image,
        "frames": {
            width: 750,
            height: 1333,
            spacing: 0,
            count: 8
        },
        "animations": {
            run: [0, 7]
        }
    });
    Gif = new createjs.Sprite(gif_animate, "run");
    Gif.x = 0;
    Gif.y = 0;
    Gif.alpha = 0.3;
    Gif.framerate = 10;
    Gif.scaleX = canvas.width / gif_animate._frameWidth;
    Gif.scaleY = canvas.height / gif_animate._frameHeight;
}