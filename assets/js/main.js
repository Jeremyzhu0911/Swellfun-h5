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

    var btnContainer = new createjs.Container(),
        btn2Container = new createjs.Container(),
        btn3Container = new createjs.Container(),
        btn4Container = new createjs.Container(),
        btn5Container = new createjs.Container();

    var alertContainer = new createjs.Container(),
        alert2Container = new createjs.Container(),
        alert3Container = new createjs.Container(),
        alert4Container = new createjs.Container(),
        alert5Container = new createjs.Container();


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

    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: ossURL + "close.png",
            id: "closeBtn"
        }, {
            // src: "./assets/music/GoWest.mp3",
            // id: "GoWest"
            src: ossURL + "music/music1.mp3",
            id: "music1"
        }];
        for (var i = 1; i < fps_count; i++) {
            manifest.push({
                src: ossURL + "bg/" + i + ".jpg",
                id: 'bg' + i
            })
        };
        manifest.push({
            src: ossURL + "music/music2.mp3",
            id: "music2"
        })
        for (var i = 1; i < 3; i++) {
            manifest.push({
                src: ossURL + "click_" + i + ".png",
                id: 'btn' + i
            })
        };
        for (var i = 1; i < 6; i++) {
            manifest.push({
                src: ossURL + "alert" + i + ".png",
                id: 'alert' + i
            })
        };
        for (var i = 1; i < 26; i++) {
            manifest.push({
                src: ossURL + "lizi/" + i + ".png",
                id: 'lizi' + i
            })
        };
        manifest.push({
            src: ossURL + "music/music3.mp3",
            id: "music3"
        }, {
            src: ossURL + "play.png",
            id: "play"
        }, {
            src: ossURL + "stop.png",
            id: "stop"
        })
        for (var i = 0; i < 9; i++) {
            manifest.push({
                // src: ossURL + "num/" + i + ".png",
                src: ossURL + "num/" + i + ".png",
                id: 'num' + i
            })
        };
        for (var i = 1; i < 75; i++) {
            manifest.push({
                src: ossURL + "ms/" + i + ".png",
                id: 'ms' + i
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
    var mymusic;
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

        /**
         * 第一个按钮
         */

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

        btnContainer.addChild(btn, btn_shou, btnText);

        /**
         * 第二个按钮
         */

        var btn2 = new createjs.Bitmap(preload.getResult("btn1"))
        btn2.x = (canvas.width - 169 * proportion + 450 * proportion) / 2;
        btn2.y = (canvas.height - 169 * proportion + 230 * proportion) / 2;
        btn2.scaleX = proportion / 3;
        btn2.scaleY = proportion / 3;

        var btn_shou2 = new createjs.Bitmap(preload.getResult("btn2"))
        btn_shou2.x = (canvas.width - 175 * proportion + 550 * proportion) / 2;
        btn_shou2.y = (canvas.height - 230 * proportion + 400 * proportion) / 2;
        btn_shou2.scaleX = proportion / 3;
        btn_shou2.scaleY = proportion / 3;
        createjs.Tween.get(btn_shou2, { loop: true })
            .wait(500)
            .to({
                x: (canvas.width - 175 * proportion + 500 * proportion) / 2,
                y: (canvas.height - 230 * proportion + 350 * proportion) / 2
            }, 1000);

        var btnText2 = new createjs.Text("点击查看知识点", "25px Arial", "#000");
        btnText2.y = (canvas.height - btnText2.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
            1.5 + 150 * proportion;
        btnText2.x = canvas.width / 2 - btnText2.getMeasuredWidth() / 2 + 220 * proportion;
        createjs.Tween.get(btnText2, { loop: true })
            .wait(500)
            .to({
                x: canvas.width / 2 - btnText2.getMeasuredWidth() / 2 + 190 * proportion,
                y: (canvas.height - btnText2.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
                    1.5 + 120 * proportion
            }, 1000);

        btn2Container.addChild(btn2, btn_shou2, btnText2);

        /**
         * 第三个按钮
         */

        var btn3 = new createjs.Bitmap(preload.getResult("btn1"))
        btn3.x = (canvas.width - 169 * proportion + 450 * proportion) / 2;
        btn3.y = (canvas.height - 169 * proportion + 230 * proportion) / 2;
        btn3.scaleX = proportion / 3;
        btn3.scaleY = proportion / 3;

        var btn_shou3 = new createjs.Bitmap(preload.getResult("btn2"))
        btn_shou3.x = (canvas.width - 175 * proportion + 550 * proportion) / 2;
        btn_shou3.y = (canvas.height - 230 * proportion + 400 * proportion) / 2;
        btn_shou3.scaleX = proportion / 3;
        btn_shou3.scaleY = proportion / 3;
        createjs.Tween.get(btn_shou3, { loop: true })
            .wait(500)
            .to({
                x: (canvas.width - 175 * proportion + 500 * proportion) / 2,
                y: (canvas.height - 230 * proportion + 350 * proportion) / 2
            }, 1000);

        var btnText3 = new createjs.Text("点击查看知识点", "25px Arial", "#000");
        btnText3.y = (canvas.height - btnText3.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
            1.5 + 150 * proportion;
        btnText3.x = canvas.width / 2 - btnText3.getMeasuredWidth() / 2 + 220 * proportion;
        createjs.Tween.get(btnText3, { loop: true })
            .wait(500)
            .to({
                x: canvas.width / 2 - btnText3.getMeasuredWidth() / 2 + 190 * proportion,
                y: (canvas.height - btnText3.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
                    1.5 + 120 * proportion
            }, 1000);

        btn3Container.addChild(btn3, btn_shou3, btnText3);

        /**
         * 第四个按钮
         */

        var btn4 = new createjs.Bitmap(preload.getResult("btn1"))
        btn4.x = (canvas.width - 169 * proportion + 450 * proportion) / 2;
        btn4.y = (canvas.height - 169 * proportion + 230 * proportion) / 2;
        btn4.scaleX = proportion / 3;
        btn4.scaleY = proportion / 3;

        var btn_shou4 = new createjs.Bitmap(preload.getResult("btn2"))
        btn_shou4.x = (canvas.width - 175 * proportion + 550 * proportion) / 2;
        btn_shou4.y = (canvas.height - 230 * proportion + 400 * proportion) / 2;
        btn_shou4.scaleX = proportion / 3;
        btn_shou4.scaleY = proportion / 3;
        createjs.Tween.get(btn_shou4, { loop: true })
            .wait(500)
            .to({
                x: (canvas.width - 175 * proportion + 500 * proportion) / 2,
                y: (canvas.height - 230 * proportion + 350 * proportion) / 2
            }, 1000);

        var btnText4 = new createjs.Text("点击查看知识点", "25px Arial", "#000");
        btnText4.y = (canvas.height - btnText4.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
            1.5 + 150 * proportion;
        btnText4.x = canvas.width / 2 - btnText4.getMeasuredWidth() / 2 + 220 * proportion;
        createjs.Tween.get(btnText4, { loop: true })
            .wait(500)
            .to({
                x: canvas.width / 2 - btnText4.getMeasuredWidth() / 2 + 190 * proportion,
                y: (canvas.height - btnText4.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
                    1.5 + 120 * proportion
            }, 1000);

        btn4Container.addChild(btn4, btn_shou4, btnText4);

        /**
         * 第五个按钮
         */

        var btn5 = new createjs.Bitmap(preload.getResult("btn1"))
        btn5.x = (canvas.width - 169 * proportion + 130 * proportion) / 2;
        btn5.y = (canvas.height - 169 * proportion + 200 * proportion) / 2;
        btn5.scaleX = proportion / 3;
        btn5.scaleY = proportion / 3;

        var btn_shou5 = new createjs.Bitmap(preload.getResult("btn2"))
        btn_shou5.x = (canvas.width - 175 * proportion + 230 * proportion) / 2;
        btn_shou5.y = (canvas.height - 230 * proportion + 360 * proportion) / 2;
        btn_shou5.scaleX = proportion / 3;
        btn_shou5.scaleY = proportion / 3;
        createjs.Tween.get(btn_shou5, { loop: true })
            .wait(500)
            .to({
                x: (canvas.width - 175 * proportion + 190 * proportion) / 2,
                y: (canvas.height - 230 * proportion + 320 * proportion) / 2
            }, 1000);

        var btnText5 = new createjs.Text("点击查看知识点", "25px Arial", "#000");
        btnText5.y = (canvas.height - btnText5.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
            1.5 + 130 * proportion;
        btnText5.x = canvas.width / 2 - btnText5.getMeasuredWidth() / 2 + 80 * proportion;
        createjs.Tween.get(btnText5, { loop: true })
            .wait(500)
            .to({
                x: canvas.width / 2 - btnText5.getMeasuredWidth() / 2 + 60 * proportion,
                y: (canvas.height - btnText5.getMeasuredHeight() * proportion) / 2 + 25 * proportion *
                    1.5 + 110 * proportion
            }, 1000);

        btn5Container.addChild(btn5, btn_shou5, btnText5);

        /**
         * 第一个按钮
         * 弹窗
         */

        var alertImg = new createjs.Bitmap(preload.getResult("alert1"));
        alertImg.x = (canvas.width - 768 * proportion) / 2;
        alertImg.y = (canvas.height - 1024 * proportion) / 2;
        alertImg.scaleX = proportion;
        alertImg.scaleY = proportion;

        var closeBtn = new createjs.Bitmap(preload.getResult("closeBtn"));
        closeBtn.x = (canvas.width - 57 * proportion + 380 * proportion) / 2;
        closeBtn.y = (canvas.height - 56 * proportion - 560 * proportion) / 2;
        closeBtn.scaleX = proportion;
        closeBtn.scaleY = proportion;

        alertContainer.addChild(alertImg, closeBtn)

        /**
         * 第二个按钮
         * 弹窗
         */

        var alert2Img = new createjs.Bitmap(preload.getResult("alert2"));
        alert2Img.x = (canvas.width - 768 * proportion) / 2;
        alert2Img.y = (canvas.height - 1024 * proportion) / 2;
        alert2Img.scaleX = proportion;
        alert2Img.scaleY = proportion;

        var lizi_img = new Array();
        for (var i = 1; i < 26; i++) {
            lizi_img[i - 1] = preload.getResult("lizi" + i);
        }

        var lizi_animate = new createjs.SpriteSheet({
            "images": lizi_img,
            "frames": {
                width: 768,
                height: 1024,
                spacing: 0,
                count: 25
            },
            "animations": {
                run: [0, 24, 'end'],
                end: [24]
            },
            "framerate": 25
        });
        var lizi = new createjs.Sprite(lizi_animate, "run");
        lizi.scaleX = proportion / 2;
        lizi.scaleY = proportion / 2;
        lizi.x = (canvas.width - lizi_animate._frameWidth * proportion + 320 * proportion) / 2;
        lizi.y = (canvas.height - lizi_animate._frameHeight * proportion + 820 * proportion) / 2;
        lizi.framerate = 24;

        var ms_img = new Array();
        for (var i = 1; i < 75; i++) {
            ms_img[i - 1] = preload.getResult("ms" + i);
        }

        var ms_animate = new createjs.SpriteSheet({
            "images": ms_img,
            "frames": {
                width: 200,
                height: 100,
                spacing: 0,
                count: 74
            },
            "animations": {
                run: [0, 73],
                end: [73]
            },
            "framerate": 74
        });

        var alert2ms = new createjs.Sprite(ms_animate, "run");
        alert2ms.scaleX = proportion / 2;
        alert2ms.scaleY = proportion / 2;
        alert2ms.x = (canvas.width - ms_animate._frameWidth * proportion - 80 * proportion) / 2;
        alert2ms.y = (canvas.height - ms_animate._frameHeight * proportion - 130 * proportion) / 2;
        alert2ms.framerate = 74;

        var alert2playBtn = new createjs.Bitmap(preload.getResult("play"));
        alert2playBtn.x = (canvas.width - 57 * proportion - 300 * proportion) / 2;
        alert2playBtn.y = (canvas.height - 57 * proportion - 160 * proportion) / 2;
        alert2playBtn.scaleX = proportion / 1.5;
        alert2playBtn.scaleY = proportion / 1.5;
        alert2playBtn.alpha = 0;

        var alert2stopBtn = new createjs.Bitmap(preload.getResult("stop"));
        alert2stopBtn.x = (canvas.width - 57 * proportion - 300 * proportion) / 2;
        alert2stopBtn.y = (canvas.height - 57 * proportion - 160 * proportion) / 2;
        alert2stopBtn.scaleX = proportion / 1.5;
        alert2stopBtn.scaleY = proportion / 1.5;


        var close2Btn = new createjs.Bitmap(preload.getResult("closeBtn"));
        close2Btn.x = (canvas.width - 57 * proportion + 530 * proportion) / 2;
        close2Btn.y = (canvas.height - 56 * proportion - 760 * proportion) / 2;
        close2Btn.scaleX = proportion;
        close2Btn.scaleY = proportion;

        alert2Container.addChild(alert2Img, close2Btn, lizi, alert2ms, alert2playBtn, alert2stopBtn)

        /**
         * 第三个按钮
         * 弹窗
         */

        var alert3Img = new createjs.Bitmap(preload.getResult("alert3"));
        alert3Img.x = (canvas.width - 768 * proportion) / 2;
        alert3Img.y = (canvas.height - 1024 * proportion) / 2;
        alert3Img.scaleX = proportion;
        alert3Img.scaleY = proportion;

        var num_img = new Array();
        for (var i = 0; i < 9; i++) {
            num_img[i] = preload.getResult("num" + i);
        }

        var num_animate = new createjs.SpriteSheet({
            "images": num_img,
            "frames": {
                width: 768,
                height: 1024,
                spacing: 0,
                count: 9
            },
            "animations": {
                run: [0, 8, 'end'],
                end: [8]
            },
            "framerate": 9
        });

        var alert2num = new createjs.Sprite(num_animate, "run");
        alert2num.scaleX = proportion / 1.15;
        alert2num.scaleY = proportion / 1.15;
        alert2num.x = (canvas.width - num_animate._frameWidth * proportion / 1.15) / 2;
        alert2num.y = (canvas.height - num_animate._frameHeight * proportion / 1.15 - 8 * proportion / 1.15) / 2;
        alert2num.framerate = 9;

        var lizi2 = new createjs.Sprite(lizi_animate, "run");
        lizi2.scaleX = proportion / 2;
        lizi2.scaleY = proportion / 2;
        lizi2.x = (canvas.width - lizi_animate._frameWidth * proportion + 360 * proportion) / 2;
        lizi2.y = (canvas.height - lizi_animate._frameHeight * proportion + 720 * proportion) / 2;
        lizi2.framerate = 24;

        var close3Btn = new createjs.Bitmap(preload.getResult("closeBtn"));
        close3Btn.x = (canvas.width - 57 * proportion + 530 * proportion) / 2;
        close3Btn.y = (canvas.height - 56 * proportion - 760 * proportion) / 2;
        close3Btn.scaleX = proportion;
        close3Btn.scaleY = proportion;

        alert3Container.addChild(alert3Img, close3Btn, alert2num, lizi2)

        /**
         * 第四个按钮
         * 弹窗
         */

        var alert4Img = new createjs.Bitmap(preload.getResult("alert4"));
        alert4Img.x = (canvas.width - 768 * proportion) / 2;
        alert4Img.y = (canvas.height - 1024 * proportion) / 2;
        alert4Img.scaleX = proportion;
        alert4Img.scaleY = proportion;

        var alert4ms = new createjs.Sprite(ms_animate, "run");
        alert4ms.scaleX = proportion / 2;
        alert4ms.scaleY = proportion / 2;
        alert4ms.x = (canvas.width - ms_animate._frameWidth * proportion - 110 * proportion) / 2;
        alert4ms.y = (canvas.height - ms_animate._frameHeight * proportion + 90 * proportion) / 2;
        alert4ms.framerate = 74;

        var alert4playBtn = new createjs.Bitmap(preload.getResult("play"));
        alert4playBtn.x = (canvas.width - 57 * proportion - 330 * proportion) / 2;
        alert4playBtn.y = (canvas.height - 57 * proportion + 60 * proportion) / 2;
        alert4playBtn.scaleX = proportion / 1.5;
        alert4playBtn.scaleY = proportion / 1.5;
        alert4playBtn.alpha = 0;

        var alert4stopBtn = new createjs.Bitmap(preload.getResult("stop"));
        alert4stopBtn.x = (canvas.width - 57 * proportion - 330 * proportion) / 2;
        alert4stopBtn.y = (canvas.height - 57 * proportion + 60 * proportion) / 2;
        alert4stopBtn.scaleX = proportion / 1.5;
        alert4stopBtn.scaleY = proportion / 1.5;

        var close4Btn = new createjs.Bitmap(preload.getResult("closeBtn"));
        close4Btn.x = (canvas.width - 57 * proportion + 450 * proportion) / 2;
        close4Btn.y = (canvas.height - 56 * proportion - 640 * proportion) / 2;
        close4Btn.scaleX = proportion;
        close4Btn.scaleY = proportion;

        alert4Container.addChild(alert4Img, close4Btn, alert4ms, alert4playBtn, alert4stopBtn)

        /**
         * 第五个按钮
         * 弹窗
         */

        var alert5Img = new createjs.Bitmap(preload.getResult("alert5"));
        alert5Img.x = (canvas.width - 768 * proportion) / 2;
        alert5Img.y = (canvas.height - 1024 * proportion) / 2;
        alert5Img.scaleX = proportion;
        alert5Img.scaleY = proportion;

        var alert5ms = new createjs.Sprite(ms_animate, "run");
        alert5ms.scaleX = proportion / 2;
        alert5ms.scaleY = proportion / 2;
        alert5ms.x = (canvas.width - ms_animate._frameWidth * proportion - 90 * proportion) / 2;
        alert5ms.y = (canvas.height - ms_animate._frameHeight * proportion + 50 * proportion) / 2;
        alert5ms.framerate = 74;

        var alert5playBtn = new createjs.Bitmap(preload.getResult("play"));
        alert5playBtn.x = (canvas.width - 57 * proportion - 290 * proportion) / 2;
        alert5playBtn.y = (canvas.height - 57 * proportion + 20 * proportion) / 2;
        alert5playBtn.scaleX = proportion / 1.5;
        alert5playBtn.scaleY = proportion / 1.5;
        alert5playBtn.alpha = 0;

        var alert5stopBtn = new createjs.Bitmap(preload.getResult("stop"));
        alert5stopBtn.x = (canvas.width - 57 * proportion - 290 * proportion) / 2;
        alert5stopBtn.y = (canvas.height - 57 * proportion + 20 * proportion) / 2;
        alert5stopBtn.scaleX = proportion / 1.5;
        alert5stopBtn.scaleY = proportion / 1.5;

        var close5Btn = new createjs.Bitmap(preload.getResult("closeBtn"));
        close5Btn.x = (canvas.width - 57 * proportion + 450 * proportion) / 2;
        close5Btn.y = (canvas.height - 56 * proportion - 600 * proportion) / 2;
        close5Btn.scaleX = proportion;
        close5Btn.scaleY = proportion;

        alert5Container.addChild(alert5Img, close5Btn, alert5ms, alert5playBtn, alert5stopBtn)

        alert2playBtn.addEventListener("click", function () {
            mymusic.paused = false;
            alert2playBtn.alpha = 0;
            alert2stopBtn.alpha = 1;
            alert2ms.gotoAndPlay("run")
        })

        alert2stopBtn.addEventListener("click", function () {
            mymusic.paused = true;
            alert2playBtn.alpha = 1;
            alert2stopBtn.alpha = 0;
            alert2ms.gotoAndPlay("end")
        })

        alert4playBtn.addEventListener("click", function () {
            mymusic.paused = false;
            alert4playBtn.alpha = 0;
            alert4stopBtn.alpha = 1;
            alert4ms.gotoAndPlay("run")
        })

        alert4stopBtn.addEventListener("click", function () {
            mymusic.paused = true;
            alert4playBtn.alpha = 1;
            alert4stopBtn.alpha = 0;
            alert4ms.gotoAndPlay("end")
        })

        alert5playBtn.addEventListener("click", function () {
            mymusic.paused = false;
            alert5playBtn.alpha = 0;
            alert5stopBtn.alpha = 1;
            alert5ms.gotoAndPlay("run")
        })

        alert5stopBtn.addEventListener("click", function () {
            mymusic.paused = true;
            alert5playBtn.alpha = 1;
            alert5stopBtn.alpha = 0;
            alert5ms.gotoAndPlay("end")
        })

        closeBtn.addEventListener("click", function () {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(page2background, btnContainer);
        })

        close2Btn.addEventListener("click", function () {
            createjs.Sound.stop();
            container.removeAllChildren();
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.addChild(page2background, btn2Container);
        })

        close3Btn.addEventListener("click", function () {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(page2background, btn3Container);
        })

        close4Btn.addEventListener("click", function () {
            createjs.Sound.stop();
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(page2background, btn4Container);
        })

        close5Btn.addEventListener("click", function () {
            createjs.Sound.stop();
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(page2background, btn5Container);
        })

        btnContainer.addEventListener("click", function () {
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(page2background, btnContainer, alertContainer);
        })

        btn2Container.addEventListener("click", function () {
            mymusic = createjs.Sound.play("music1");
            mymusic.paused = false;
            alert2playBtn.alpha = 0;
            alert2stopBtn.alpha = 1;
            alert2ms.gotoAndPlay("run")
            lizi.gotoAndPlay("run")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(page2background, btn2Container, alert2Container);
        })

        btn3Container.addEventListener("click", function () {
            alert2num.gotoAndPlay("run")
            lizi2.gotoAndPlay("run")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(page2background, btn3Container, alert3Container);
        })

        btn4Container.addEventListener("click", function () {
            mymusic = createjs.Sound.play("music2");
            mymusic.paused = false;
            alert4playBtn.alpha = 0;
            alert4stopBtn.alpha = 1;
            alert4ms.gotoAndPlay("run")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(page2background, btn4Container, alert4Container);
        })

        btn5Container.addEventListener("click", function () {
            mymusic = createjs.Sound.play("music3");
            mymusic.paused = false;
            alert5playBtn.alpha = 0;
            alert5stopBtn.alpha = 1;
            alert5ms.gotoAndPlay("run")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(page2background, btn5Container, alert5Container);
        })

        var startY, moveEndY, Y, img_count = 1, speed = 70, counts = 0;

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
                    if (counts > 160 && counts < 168) {
                        container.addChild(page2background, btnContainer);
                    } else if (counts > 179 && counts < 182) {
                        container.addChild(page2background, btn2Container);
                    } else if (counts > 182 && counts < 187) {
                        container.addChild(page2background, btn3Container);
                    } else if (counts > 219 && counts < 224) {
                        container.addChild(page2background, btn4Container);
                    } else if (counts > 318 && counts < 323) {
                        container.addChild(page2background, btn5Container);
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
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener("tick", tickhandle);

    function tickhandle() {
        stage.update()
    }
}