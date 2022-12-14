document.body.addEventListener('touchmove', function (evt) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    evt.preventDefault()
}, {
    passive: false
})

var canvas = document.getElementById('Canvas');

var fps_count = 237;

var viewHeight, viewWidth, proportion;

function getViewPort() {
    viewHeight = window.innerHeight || document.documentElement.clientHeight;
    viewWidth = window.innerWidth || document.documentElement.clientWidth;
    document.body.style.width = viewWidth;
    proportion = (viewWidth / 765);
    canvas.width = viewWidth;
    canvas.height = viewHeight;
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
    var ossURL = "https://oss-baijiuxuefang.oss-cn-beijing.aliyuncs.com/oss-baijiuxuefang/njjh/";

    //构建显示对象的容器
    var container = new createjs.Container(),
        container2 = new createjs.Container(),
        container3 = new createjs.Container();

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

    // var pageTop = new createjs.Bitmap(ossURL + "page_top.png");
    // pageTop.x = (canvas.width - 750 * proportion) / 2;
    // pageTop.y = canvas.height >= 1024 ? 0 : -222 * proportion;
    // pageTop.scaleX = canvas.width / 750;
    // pageTop.scaleY = canvas.width / 750;

    // var pageBottom = new createjs.Bitmap(ossURL + "page_bottom.png");
    // pageBottom.x = (canvas.width - 750 * proportion) / 2;
    // pageBottom.y = canvas.height > 1024 ? (canvas.height - 204 * proportion) : canvas.height;
    // pageBottom.scaleX = canvas.width / 750;
    // pageBottom.scaleY = canvas.width / 750;

    // var background = new createjs.Bitmap("./assets/images/background.jpg");
    // background.x = (canvas.width - 750 * proportion) / 2;
    // background.y = (canvas.height - 1624 * proportion) / 2;
    // background.scaleX = canvas.width / 750;
    // background.scaleY = canvas.width / 750;

    var pagebackground = new createjs.Bitmap(ossURL + "bg/6.jpg");
    pagebackground.x = (canvas.width - 768 * proportion) / 2;
    pagebackground.y = (canvas.height - 1024 * proportion) / 2;
    pagebackground.scaleX = proportion * 768 / 375;
    pagebackground.scaleY = proportion * 768 / 375;

    //加载loading 
    loadingbox.graphics.beginFill('#000').rr((canvas.width - 445 * proportion) / 2, (canvas.height - 712 *
        proportion) / 2, 445 * proportion, 22 * proportion, 11 * proportion);
    loadingbg.graphics.beginFill('#fff').rr((canvas.width - 435 * proportion) / 2, (canvas.height - 707 *
        proportion) / 2, 435 * proportion, 17 * proportion, 8.5 * proportion);

    var loading_logo = new createjs.Bitmap(ossURL + "loading_logo.png");
    loading_logo.x = (canvas.width - 446 * proportion) / 2;
    loading_logo.y = (canvas.height - 753 * proportion) / 2;
    loading_logo.scaleX = proportion;
    loading_logo.scaleY = proportion;

    var progressText = new createjs.Text("", "40px Arial", "#fff");
    progressText.y = (canvas.height - (progressText.getMeasuredHeight() + 730) * proportion) / 2 + 44 * proportion *
        1.5;

    var mask = new createjs.Shape()
    mask.graphics.beginFill("#000").rr(0, 0, canvas.width, canvas.height, 0);
    mask.alpha = .5

    var logo = new createjs.Bitmap(ossURL + "logo.png")
    logo.x = (canvas.width - 445 * proportion) / 2;
    logo.y = (canvas.height - 500 * proportion) / 2; //190
    logo.scaleX = proportion;
    logo.scaleY = proportion;

    var loading_shuoming = new createjs.Bitmap(ossURL + "loading_shuoming.png");
    loading_shuoming.x = (canvas.width - 460 * proportion) / 2;
    loading_shuoming.y = (canvas.height - 33 * proportion) / 2; //383
    loading_shuoming.scaleX = proportion;
    loading_shuoming.scaleY = proportion;
    loading_shuoming.alpha = 0
    createjs.Tween.get(loading_shuoming)
        .wait(500)
        .to({
            alpha: 1
        }, 800);

    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: ossURL + "close.png",
            id: "closeBtn"
        }, {
            src: ossURL + "music/music1.mp3",
            id: "music1"
        }, {
            src: ossURL + "play.png",
            id: "play"
        }, {
            src: ossURL + "stop.png",
            id: "stop"
        }, {
            src: ossURL + "down.png",
            id: "down"
        }, {
            src: ossURL + "loading_shuoming.png",
            id: "loading_shuoming"
        }];
        for (var i = 0; i < fps_count; i++) {
            manifest.push({
                src: ossURL + "bg/" + i + ".jpg",
                id: 'bg' + i
            })
        };
        for (var i = 1; i < 3; i++) {
            manifest.push({
                src: ossURL + "click_" + i + ".png",
                id: 'btn' + i
            })
        };

        manifest.push({
            src: ossURL + "music/music2.mp3",
            id: "music2"
        })
        manifest.push({
            src: ossURL + "music/music3.mp3",
            id: "music3"
        })
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

    var mymusic, Sound_name, Sound_time = 0, Sound_position = 0;

    function StartTime(e) {
        if (Sound_name != e) {
            Sound_name = e;
            Sound_position = 0
        }
    }
    function PausedTime() {
        Sound_position = parseInt(mymusic.position);
        console.log(Sound_position)
        // clearInterval(Sound_time)
    }
    //处理单个文件加载
    function handleFileLoad(event) {
        console.log("正在加载")
        console.log(event.item.id)
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
            loadingsp.graphics.beginFill('#f0d8a1').rr((canvas.width - 435 * proportion) / 2, (canvas.height -
                707 * proportion) / 2, 435 * proportion / 100 * (preload.progress * 100 | 0), 17 *
            proportion, 8.5 * proportion);
        } else {
            loadingsp.graphics.beginFill('#f0d8a1').rr((canvas.width - 435 * proportion) / 2, (canvas.height -
                707 * proportion) / 2, 435 * proportion / 100 * 10, 17 * proportion, 8.5 * proportion);
        }
        if ((preload.progress * 100 | 0) > 10 && (preload.progress * 100 | 0) < 95) {
            loading_logo.x = (canvas.width - 500 * proportion) / 2 + 460 * proportion / 100 * (preload
                .progress * 100 | 0);
        }
        // stage.addChild(background, pagebackground, pageTop, pageBottom)
        stage.addChild(pagebackground)
        container.addChild(loadingbox, loadingbg, loadingsp, loading_logo, progressText);
        container2.addChild(mask, logo)
        container3.addChild(loading_shuoming)
        stage.addChild(container2, container, container3);
        // createjs.Ticker.addEventListener("tick", tickhandle);
    }

    //全度资源加载完毕
    function loadComplete(event) {
        console.log("已加载完毕全部资源");
        Animate_Conter_page2();
        container.removeAllChildren();
        container3.removeAllChildren();

        var down_up = new createjs.Bitmap(preload.getResult("down"))
        down_up.x = (canvas.width - 50 * proportion) / 2;
        down_up.y = (canvas.height - 65 * proportion) / 2;
        down_up.scaleX = proportion;
        down_up.scaleY = proportion;
        createjs.Tween.get(down_up, { loop: true })
            .to({
                y: (canvas.height - 65 * proportion + 60) / 2,
                alpha: 0
            }, 800);

        progressText = new createjs.Text("", "40px Arial", "#dadada");
        progressText.y = (canvas.height - progressText.getMeasuredHeight() * proportion) / 2 + 66 * proportion *
            1.5;
        progressText.text = "向下滑动";
        progressText.shadow = new createjs.Shadow("#000000", 50, 50, 100)
        progressText.x = canvas.width / 2 - progressText.getMeasuredWidth() / 2;
        stage.addChild(progressText, down_up);

        // var spriteSheet = new createjs.SpriteSheet({
        //     framerate: 30,
        //     "images": ["./assets/images/tip_icon_down_up.png"],
        //     "frames": { "regX": 0, "height": 300, "count": 25, "regY": 0, "width": 160 },
        //     // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        //     "animations": {
        //         "run": [0, 24, "run", 0.7],
        //         "jump": [26, 63, "run"]
        //     }
        // });
        // var grant = new createjs.Sprite(spriteSheet, "run");
        // grant.x = (canvas.width - 160 * proportion) / 2;
        // grant.y = (canvas.height - 150 * proportion) / 2;
        // grant.scaleX = proportion;
        // grant.scaleY = proportion;

        // progressText = new createjs.Text("", "36px Arial", "#fff");
        // progressText.y = (canvas.height - progressText.getMeasuredHeight() * proportion) / 2 + 10 * proportion;
        // progressText.text = "上\n滑\n解\n锁\n剧\n情";
        // progressText.x = canvas.width / 2 - progressText.getMeasuredWidth() / 2 + 30 * proportion;
        // stage.addChild(progressText, grant);
        createjs.Ticker.addEventListener("tick", tickhandle);
    }

    setupManifest();
    startPreload();


    function Animate_Conter_page2() {
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

        var alertImg = new createjs.Bitmap(ossURL + "alert1.png");
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

        var alert2Img = new createjs.Bitmap(ossURL + "alert2.png");
        alert2Img.x = (canvas.width - 768 * proportion) / 2;
        alert2Img.y = (canvas.height - 1024 * proportion) / 2;
        alert2Img.scaleX = proportion;
        alert2Img.scaleY = proportion;

        var lizi_img = new Array();
        for (var i = 0; i < 251; i++) {
            lizi_img[i] = ossURL + "lizi/" + i + ".png";
        }

        var lizi_animate = new createjs.SpriteSheet({
            "images": lizi_img,
            "frames": {
                width: 375,
                height: 500,
                spacing: 0,
                count: 251
            },
            "animations": {
                run: [0, 250, "run", 0.3],
                end: [250]
            },
            "framerate": 250
        });
        var lizi = new createjs.Sprite(lizi_animate, "run");
        lizi.scaleX = proportion * 768 / 375 / 1.5;
        lizi.scaleY = proportion * 768 / 375 / 1.5;
        lizi.x = (canvas.width - lizi_animate._frameWidth * proportion * 768 / 375 + 255 * proportion) / 2;
        lizi.y = (canvas.height - lizi_animate._frameHeight * proportion * 768 / 375 + 575 * proportion) / 2;
        lizi.framerate = 251;

        var ms_img = new Array();
        for (var i = 1; i < 75; i++) {
            ms_img[i - 1] = ossURL + "ms/" + i + ".png";
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
                run: [0, 73, "run", 0.3],
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

        var alert3Img = new createjs.Bitmap(ossURL + "alert3.png");
        alert3Img.x = (canvas.width - 768 * proportion) / 2;
        alert3Img.y = (canvas.height - 1024 * proportion) / 2;
        alert3Img.scaleX = proportion;
        alert3Img.scaleY = proportion;

        var num_img = new Array();
        for (var i = 0; i < 9; i++) {
            num_img[i] = ossURL + "num/" + i + ".png";
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
                end: [8],
                speed: 0.3
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
        lizi2.scaleX = proportion * 768 / 375 / 1.3;
        lizi2.scaleY = proportion * 768 / 375 / 1.3;
        lizi2.x = (canvas.width - lizi_animate._frameWidth * proportion * 768 / 375 + 170 * proportion) / 2;
        lizi2.y = (canvas.height - lizi_animate._frameHeight * proportion * 768 / 375 + 335 * proportion) / 2;
        lizi2.framerate = 251;

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

        var alert4Img = new createjs.Bitmap(ossURL + "alert4.png");
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

        var alert5Img = new createjs.Bitmap(ossURL + "alert5.png");
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
            mymusic.position = Sound_position;
            alert2playBtn.alpha = 0;
            alert2stopBtn.alpha = 1;
            alert2ms.gotoAndPlay("run")

        })

        alert2stopBtn.addEventListener("click", function () {
            mymusic.paused = true;
            alert2playBtn.alpha = 1;
            alert2stopBtn.alpha = 0;
            alert2ms.gotoAndPlay("end");
            PausedTime()
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
            PausedTime()
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
            PausedTime()
        })

        closeBtn.addEventListener("click", function () {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btnContainer);
        })

        close2Btn.addEventListener("click", function () {
            mymusic.paused = true;
            PausedTime()
            container.removeAllChildren();
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn2Container);
        })

        close3Btn.addEventListener("click", function () {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btn3Container);
        })

        close4Btn.addEventListener("click", function () {
            mymusic.paused = true;
            PausedTime()
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btn4Container);
        })

        close5Btn.addEventListener("click", function () {
            mymusic.paused = true;
            PausedTime()
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btn5Container);
        })

        btnContainer.addEventListener("click", function () {
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btnContainer, alertContainer);
        })

        btn2Container.addEventListener("click", function () {
            StartTime('music1')
            mymusic = createjs.Sound.play("music1");
            mymusic.loop = -1;
            mymusic.paused = true;
            mymusic.position = Sound_position;
            alert2playBtn.alpha = 1;
            alert2stopBtn.alpha = 0;
            alert2ms.gotoAndPlay("end")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn2Container, alert2Container);
        })

        btn3Container.addEventListener("click", function () {
            alert2num.gotoAndPlay("run")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn3Container, alert3Container);
        })

        btn4Container.addEventListener("click", function () {
            StartTime('music2')
            mymusic = createjs.Sound.play("music2");
            mymusic.loop = -1;
            mymusic.paused = true;
            mymusic.position = Sound_position;
            alert4playBtn.alpha = 1;
            alert4stopBtn.alpha = 0;
            alert4ms.gotoAndPlay("end")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn4Container, alert4Container);
        })

        btn5Container.addEventListener("click", function () {
            StartTime('music3')
            mymusic = createjs.Sound.play("music3");
            mymusic.loop = -1;
            mymusic.paused = true;
            mymusic.position = Sound_position;
            alert5playBtn.alpha = 1;
            alert5stopBtn.alpha = 0;
            alert5ms.gotoAndPlay("end")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn5Container, alert5Container);
        })

        var startY, moveEndY, Y, img_count = 6, speed = 100, counts = 6, index = 0;

        function handleTouchstart(e) {
            startY = e.changedTouches[0].clientY - canvas.offsetTop;
        }

        function handleTouchmove(e) {

            container2.removeAllChildren();
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
                    pagebackground = new createjs.Bitmap(preload.getResult("bg" + counts));
                    pagebackground.x = (canvas.width - 768 * proportion) / 2;
                    pagebackground.y = (canvas.height - 1024 * proportion) / 2;
                    pagebackground.scaleX = proportion * 768 / 375;
                    pagebackground.scaleY = proportion * 768 / 375;
                    if (counts > 87 && counts < 91) {
                        container.addChild(pagebackground, btnContainer);
                        if (index === 0) {
                            handleTouchend()
                            canvas.removeEventListener("touchstart", handleTouchstart)
                            canvas.removeEventListener("touchmove", handleTouchmove)
                            canvas.removeEventListener("touchend", handleTouchend)
                            index += 1
                        }

                    } else if (counts > 100 && counts < 102) {
                        container.addChild(pagebackground, btn2Container);
                        if (index === 1) {
                            handleTouchend()
                            canvas.removeEventListener("touchstart", handleTouchstart)
                            canvas.removeEventListener("touchmove", handleTouchmove)
                            canvas.removeEventListener("touchend", handleTouchend)
                            index += 1
                        }
                    } else if (counts > 102 && counts < 105) {
                        container.addChild(pagebackground, btn3Container);
                        if (index === 2) {
                            handleTouchend()
                            canvas.removeEventListener("touchstart", handleTouchstart)
                            canvas.removeEventListener("touchmove", handleTouchmove)
                            canvas.removeEventListener("touchend", handleTouchend)
                            index += 1
                        }
                    } else if (counts > 124 && counts < 127) {
                        container.addChild(pagebackground, btn4Container);
                        if (index === 3) {
                            handleTouchend()
                            canvas.removeEventListener("touchstart", handleTouchstart)
                            canvas.removeEventListener("touchmove", handleTouchmove)
                            canvas.removeEventListener("touchend", handleTouchend)
                            index += 1
                        }
                    } else if (counts > 194 && counts < 196) {
                        container.addChild(pagebackground, btn5Container);
                        if (index === 4) {
                            handleTouchend()
                            canvas.removeEventListener("touchstart", handleTouchstart)
                            canvas.removeEventListener("touchmove", handleTouchmove)
                            canvas.removeEventListener("touchend", handleTouchend)
                            index += 1
                        }
                    } else {
                        container.addChild(pagebackground);
                    }
                } else {
                    counts = fps_count
                    container.addChild(pagebackground);
                    // console.log(parseInt(img_count + Y / speed))
                }
            } else {
                pagebackground = new createjs.Bitmap(preload.getResult("bg1"));
                pagebackground.x = (canvas.width - 768 * proportion) / 2;
                pagebackground.y = (canvas.height - 1024 * proportion) / 2;
                pagebackground.scaleX = proportion * 768 / 375;
                pagebackground.scaleY = proportion * 768 / 375;
                container.addChild(pagebackground);
            }

            // stage.addChild(container, pageTop, pageBottom);
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
