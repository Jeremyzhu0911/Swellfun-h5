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

var fps_count = 379;//379  165

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
    var btnContainer = new createjs.Container();
    var alertContainer = new createjs.Container();

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

    var ossURL = "https://oss-baijiuxuefang.oss-cn-beijing.aliyuncs.com/oss-baijiuxuefang/njjh/";

    // var ossURL = "./assets/images/";

    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: "./assets/music/GoWest.mp3",
            id: "GoWest"
        }];
        for (var i = 1; i < fps_count; i++) {
            manifest.push({
                src: ossURL + i + ".jpg",
                id: 'bg' + i
            })
        };
        for (var i = 1; i < 3; i++) {
            manifest.push({
                src: "./assets/images/click_" + i + ".png",
                id: 'btn' + i
            })
        };
        for (var i = 1; i < 2; i++) {
            manifest.push({
                src: "./assets/images/alert" + i + ".png",
                id: 'alert' + i
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
        // var mymusic;
        // if (event.item.id == "GoWest") {
        //     if (is_weixn()) {
        //         if (typeof window.WeixinJSBridge ==
        //             "object" &&
        //             typeof window.WeixinJSBridge
        //                 .invoke ==
        //             "function"
        //         ) {
        //             window.
        //                 WeixinJSBridge
        //                 .invoke(
        //                     'getNetworkType', {}, () => {
        //                         mymusic = createjs.Sound.play("GoWest");
        //                         mymusic.loop = -1;
        //                     })
        //         }
        //     } else {
        //         mymusic = createjs.Sound.play("GoWest");
        //         mymusic.loop = -1;
        //     }
        // }
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

        stage.addChild(page2background);

        var btn = new createjs.Bitmap(preload.getResult("btn1"))
        btn.x = (canvas.width - 169 * proportion - 200 * proportion) / 2;
        btn.y = (canvas.height - 169 * proportion + 230 * proportion) / 2;
        btn.scaleX = proportion / 3;
        btn.scaleY = proportion / 3;

        var btn_shou = new createjs.Bitmap(preload.getResult("btn2"))
        btn_shou.x = (canvas.width - 175 * proportion - 90 * proportion) / 2;
        btn_shou.y = (canvas.height - 230 * proportion + 400 * proportion) / 2;
        btn_shou.scaleX = proportion / 3;
        btn_shou.scaleY = proportion / 3;
        createjs.Tween.get(btn_shou, { loop: true })
            .wait(500)
            .to({
                x: (canvas.width - 175 * proportion - 140 * proportion) / 2,
                y: (canvas.height - 230 * proportion + 350 * proportion) / 2
            }, 1000);

        var btnText = new createjs.Text("点击查看知识点", "25px Arial", "#000");
        btnText.y = (canvas.height - btnText.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
            1.5 + 150 * proportion;
        btnText.x = canvas.width / 2 - btnText.getMeasuredWidth() / 2 - 90 * proportion;
        createjs.Tween.get(btnText, { loop: true })
            .wait(500)
            .to({
                x: canvas.width / 2 - btnText.getMeasuredWidth() / 2 - 120 * proportion,
                y: (canvas.height - btnText.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
                    1.5 + 120 * proportion
            }, 1000);

        btnContainer.addChild(btn, btn_shou, btnText)

        var alertImg = new createjs.Bitmap(preload.getResult("alert1"));
        alertImg.x = (canvas.width - 768 * proportion) / 2;
        alertImg.y = (canvas.height - 1024 * proportion) / 2;
        alertImg.scaleX = proportion;
        alertImg.scaleY = proportion;
        ;
        var closeBtn = new createjs.Shape();
        closeBtn.graphics.beginFill("blue").drawRect((canvas.width - 100 * proportion) / 2 + 200 * proportion, (canvas.width - 100 * proportion) / 2 - 150 * proportion, 100, 100);
        closeBtn.alpha = 0

        alertContainer.addChild(alertImg, closeBtn)

        alertContainer.addEventListener("click", function () {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(page2background, btnContainer);
        })

        btnContainer.addEventListener("click", function () {
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(page2background, btnContainer, alertContainer);
        })

        var startY, moveEndY, Y, img_count = 1, speed = 10, counts = 0;

        function handleTouchstart(e) {
            startY = e.changedTouches[0].clientY - canvas.offsetTop;
        }

        function handleTouchmove(e) {
            container.removeAllChildren();
            console.log("滑动距离")
            moveEndY = e.changedTouches[0].clientY - canvas.offsetTop
            Y = parseInt(startY - moveEndY);
            if (Y > 0 && img_count > 0) {
                console.log("上滑")
            } else {
                console.log("下滑")
            }
            console.log("当前img index")
            console.log(img_count)
            counts = parseInt(img_count + Y / speed)
            console.log("NEW img index")
            console.log(counts)
            if (Math.sign(counts) === 1) {
                if (counts > 0 && counts < fps_count) {
                    page2background = new createjs.Bitmap(preload.getResult("bg" + counts));
                    page2background.x = (canvas.width - 765 * proportion) / 2;
                    page2background.y = (canvas.height - 1024 * proportion) / 2;
                    page2background.scaleX = proportion;
                    page2background.scaleY = proportion;
                    if (counts > 160 && counts < 167) {
                        container.addChild(page2background, btnContainer);
                    } else {
                        container.addChild(page2background);
                    }
                } else {
                    counts = fps_count
                    container.addChild(page2background);
                    // console.log(parseInt(img_count + Y / speed))
                }
            }

            stage.addChild(container);
        }
        function handleTouchend(e) {
            if (Math.sign(counts) === 1) {
                if (counts > 0 && counts < fps_count) {
                    img_count = parseInt(img_count + Y / speed)
                } else {
                    img_count = counts
                }
            } else {
                img_count = 1
            }

            console.log("END img index")
            console.log(img_count)
        }

        canvas.addEventListener("touchstart", handleTouchstart)
        canvas.addEventListener("touchmove", handleTouchmove)
        canvas.addEventListener("touchend", handleTouchend)

        // canvas.removeEventListener("touchmove", handleTouchmove)

        createjs.Ticker.addEventListener("tick", tickhandle);
    }

    //监听事件，30fps更新stage
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tickhandle);

    function tickhandle() {
        stage.update()
    }
}