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
    proportion = (viewWidth / 375);
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

var sineInOutEase = createjs.Ease.sineInOut;

function main() {

    var manifest;
    var preload;
    var ossURL = "https://oss-baijiuxuefang.oss-cn-beijing.aliyuncs.com/oss-baijiuxuefang/njjhnew/";

    //构建显示对象的容器
    var loadingContainer = new createjs.Container();

    var container = new createjs.Container();

    /**
     * 基础动画 - 定位
     * 粮食槽
     * 磨盘
     */

    var background = new createjs.Bitmap(ossURL + "background.jpg");
    background.scaleX = proportion;
    background.scaleY = proportion;
    background.x = (canvas.width - 375 * proportion) / 2;
    background.y = (canvas.height - 812 * proportion) / 2;

    //加载loading
    var loadingBeizi = new createjs.Bitmap(ossURL + "loading/loadingBeizi.png");
    loadingBeizi.scaleX = proportion;
    loadingBeizi.scaleY = proportion;
    loadingBeizi.x = (canvas.width - 451 * proportion) / 2 - 9 * proportion;
    loadingBeizi.y = (canvas.height - 812 * proportion) / 2;


    var loadingH_img = new Array();
    for (var i = 0; i < 11; i++) {
        loadingH_img[i] = ossURL + "loading/loadingH" + i + ".png";
    }

    var loadingH_animate = new createjs.SpriteSheet({
        "images": loadingH_img,
        "frames": {
            width: 183,
            height: 183,
            spacing: 0,
            count: 11
        },
        "animations": {
            run0: [0],
            run1: [1],
            run2: [2],
            run3: [3],
            run4: [4],
            run5: [5],
            run6: [6],
            run7: [7],
            run8: [8],
            run9: [9],
            run10: [10]
        },
        "framerate": 11
    })
    var loadingH = new createjs.Sprite(loadingH_animate, "run0");
    loadingH.scaleX = proportion;
    loadingH.scaleY = proportion;
    loadingH.x = (canvas.width - loadingH_animate._frameWidth * proportion) / 2;
    loadingH.y = (canvas.height - loadingH_animate._frameHeight * proportion) / 2 + 100 * proportion;
    loadingH.framerate = 11;

    var loadingS_img = new Array();
    for (var i = 0; i < 18; i++) {
        loadingS_img[i] = ossURL + "loading/loadingS" + i + ".png";
    }

    var loadingS_animate = new createjs.SpriteSheet({
        "images": loadingS_img,
        "frames": {
            width: 150,
            height: 50,
            spacing: 0,
            count: 18
        },
        "animations": {
            start: [0],
            run: [0, 17, 'run', 0.4],
            end: [17]
        },
        "framerate": 18
    })
    var loadingS = new createjs.Sprite(loadingS_animate, "run");
    loadingS.scaleX = proportion;
    loadingS.scaleY = proportion;
    loadingS.x = (canvas.width - loadingS_animate._frameWidth * proportion) / 2;
    loadingS.y = (canvas.height - loadingS_animate._frameHeight * proportion) / 2 + 130 * proportion; //50
    loadingS.framerate = 18;

    var loadingX_img = new Array();
    for (var i = 0; i < 18; i++) {
        loadingX_img[i] = ossURL + "loading/loadingX" + i + ".png";
    }

    var loadingX_animate = new createjs.SpriteSheet({
        "images": loadingX_img,
        "frames": {
            width: 451,
            height: 812,
            spacing: 0,
            count: 18
        },
        "animations": {
            start: [0],
            run: [0, 17, 'run', 0.3],
            end: [17]
        },
        "framerate": 18
    })
    var loadingX = new createjs.Sprite(loadingX_animate, "run");
    loadingX.scaleX = proportion;
    loadingX.scaleY = proportion;
    loadingX.x = (canvas.width - loadingX_animate._frameWidth * proportion) / 2;
    loadingX.y = (canvas.height - loadingX_animate._frameHeight * proportion) / 2 - 30 * proportion; //50
    loadingX.framerate = 18;

    var progressText = new createjs.Text("", "40px Arial", "#000");
    progressText.y = (canvas.height - progressText.getMeasuredHeight() * proportion) / 2 + 70 * proportion *
        1.5;

    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: ossURL + "yunliangche/B_Car0.png",
            id: "B_Car_img"
        }, {
            src: ossURL + "next.png",
            id: "next_img"
        }];

        for (var i = 0; i < 28; i++) {
            manifest.push({
                src: ossURL + "yunliangche/A_Car" + i + ".png",
                id: 'A_Car_img' + i
            })
        }
        for (var i = 0; i < 30; i++) {
            manifest.push({
                src: ossURL + "liangshilizi/" + i + ".png",
                id: 'liangshi_lizi_img' + i
            })
        }

        for (var i = 0; i < 23; i++) {
            manifest.push({
                src: ossURL + "jiaobanliuliang/down_liuliang" + i + ".png",
                id: 'jiaoban_liuliang_img' + i
            })
        }

        for (var i = 0; i < 19; i++) {
            manifest.push({
                src: ossURL + "jiaochixuanze/xuanze" + i + ".png",
                id: 'jiaochixuanze' + i
            })
        }
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

        loadingH.gotoAndPlay("run" + parseInt((preload.progress * 100 | 0) / 10))

        loadingS.y = (canvas.height - loadingS_animate._frameHeight * proportion) / 2 + (130 - (preload.progress * 80 | 0)) * proportion;

        // stage.addChild(background, pagebackground, pageTop, pageBottom)
        loadingContainer.addChild(loadingBeizi, loadingH, loadingS, loadingX, progressText);
        stage.addChild(background, container, loadingContainer);
        // createjs.Ticker.addEventListener("tick", tickhandle);
    }

    //全度资源加载完毕
    function loadComplete(event) {
        console.log("已加载完毕全部资源");

        loadingContainer.removeAllChildren();

        createjs.Ticker.addEventListener("tick", tickhandle);

        Animate_Conter();
    }

    setupManifest();
    startPreload();


    function Animate_Conter() {

        /**
         * 选粮
         */
        var liangshicao = new createjs.Bitmap(ossURL + "liangshicao.png");
        liangshicao.x = (canvas.width - 426 * proportion) / 2;
        liangshicao.y = 500;
        liangshicao.scaleX = proportion;
        liangshicao.scaleY = proportion;

        var xuanliangText = new createjs.Bitmap(ossURL + "text/xuanliang.png");
        xuanliangText.x = canvas.width / 2;
        xuanliangText.y = 1300 - 112 * 0.5 / 2;
        xuanliangText.scaleX = 0;
        xuanliangText.scaleY = 0;
        xuanliangText.alpha = 0;

        /**
         * 粮食粒子
         */
        var liangshi_lizi_img = new Array();
        for (var i = 0; i < 30; i++) {
            liangshi_lizi_img[i] = preload.getResult("liangshi_lizi_img" + i);
        }

        var liangshi_lizi_animate = new createjs.SpriteSheet({
            "images": liangshi_lizi_img,
            "frames": {
                width: 325,
                height: 500,
                spacing: 0,
                count: 30
            },
            "animations": {
                start: [0],
                run: [0, 29, 'end', 0.5],
                end: [29]
            },
            "framerate": 30
        })
        var liangshi_lizi = new createjs.Sprite(liangshi_lizi_animate, "start");
        liangshi_lizi.scaleX = proportion;
        liangshi_lizi.scaleY = proportion;
        liangshi_lizi.x = (canvas.width - liangshi_lizi_animate._frameWidth * proportion) / 2;
        liangshi_lizi.y = 700;
        liangshi_lizi.framerate = 30;

        createjs.Tween.get(liangshi_lizi)
            .wait(980)
            .call(() => {
                liangshi_lizi.gotoAndPlay("run");
            })
            .to({
                y: 450 * proportion
            }, 3400);

        createjs.Tween.get(container)
            .wait(500)
            .to({
                y: -930 * proportion
            }, 4500);

        /**
         * 运粮车
         */
        var A_Car_img = new Array();
        for (var i = 0; i < 28; i++) {
            A_Car_img[i] = preload.getResult("A_Car_img" + i);
        }

        var A_Car_animate = new createjs.SpriteSheet({
            "images": A_Car_img,
            "frames": {
                width: 74,
                height: 190,
                spacing: 0,
                count: 28
            },
            "animations": {
                start: [0],
                run: [0, 27, 'end', 0.4],
                end: [27]
            },
            "framerate": 28
        });
        var A_Car = new createjs.Sprite(A_Car_animate, "start");
        A_Car.scaleX = proportion;
        A_Car.scaleY = proportion;
        A_Car.regX = A_Car_animate._frameWidth / 2;
        A_Car.x = (canvas.width - 64 * proportion) / 2;
        A_Car.y = 380;
        A_Car.framerate = 28;

        var B_Car = new createjs.Bitmap(preload.getResult("B_Car_img"))
        B_Car.scaleX = proportion;
        B_Car.scaleY = proportion;
        B_Car.regX = 74 / 2;
        B_Car.x = (canvas.width - 74 * proportion + 160 * proportion) / 2;
        B_Car.y = 380;

        createjs.Tween.get(xuanliangText)
            .wait(1500)
            .to({
                scaleX: proportion * 0.5,
                scaleY: proportion * 0.5,
                x: (canvas.width - 236 * proportion * 0.5) / 2,
                y: 1300,
                alpha: 1
            }, 1000)

        createjs.Tween.get(A_Car)
            .wait(500)
            .to({
                y: 700 * proportion
            }, 2000)
            .call(() => {
                createjs.Tween.get(A_Car)
                    .to({
                        x: (canvas.width - A_Car_animate._frameWidth * proportion + 30 * proportion) / 2,
                        y: 850 * proportion,
                        rotation: -7
                    }, 1000)
                    .call(() => {
                        createjs.Tween.get(A_Car)
                            .to({
                                x: (canvas.width - A_Car_animate._frameWidth * proportion + 80 * proportion) / 2,
                                y: 1025 * proportion,
                                rotation: 0
                            }, 1000)
                            .call(() => {
                                A_Car.gotoAndPlay("run");
                            })
                    })
                // A_Car.gotoAndPlay("run");
            });
        createjs.Tween.get(B_Car)
            .wait(500)
            .to({
                y: 700 * proportion
            }, 2000);

        var mopan = new createjs.Bitmap(ossURL + "mopan.png");
        mopan.x = (canvas.width - 237 * proportion) / 2;
        mopan.y = 3000;
        mopan.scaleX = proportion;
        mopan.scaleY = proportion;

        /**
         * 旋转的磨盘
         */

        var mopans_img = new Array();
        for (var i = 0; i < 27; i++) {
            mopans_img[i] = ossURL + "mopan/" + i + ".png";
        }

        var mopans_animate = new createjs.SpriteSheet({
            "images": mopans_img,
            "frames": {
                width: 175,
                height: 175,
                spacing: 0,
                count: 27
            },
            "animations": {
                start: [0],
                run: [0, 26, 'end', 0.5],
                end: [26]
            },
            "framerate": 27
        });
        var mopans = new createjs.Sprite(mopans_animate, "start");
        mopans.scaleX = proportion;
        mopans.scaleY = proportion;
        mopans.x = (canvas.width - mopans_animate._frameWidth * proportion - 12.5 * proportion);
        mopans.y = 3300;
        mopans.regX = mopans_animate._frameWidth / 2;
        mopans.regY = mopans_animate._frameHeight / 2;
        mopans.framerate = 27;

        var posuiText = new createjs.Bitmap(ossURL + "text/posui.png");
        posuiText.x = canvas.width / 2;
        posuiText.y = 3650 - 114 * 0.5 / 2;
        posuiText.scaleX = 0;
        posuiText.scaleY = 0;
        posuiText.alpha = 0;

        /**
         * 磨盘流粮
         */
        var liuliang_img = new Array();
        for (var i = 0; i < 35; i++) {
            liuliang_img[i] = ossURL + "mopanliuliang/" + i + ".png";
        }
        var liuliang_animate = new createjs.SpriteSheet({
            "images": liuliang_img,
            "frames": {
                width: 175,
                height: 525,
                spacing: 0,
                count: 35
            },
            "animations": {
                start: [0],
                run: [0, 34, 'end', 0.4],
                end: [34]
            },
            "framerate": 35
        });
        var liuliang = new createjs.Sprite(liuliang_animate, "start");
        liuliang.scaleX = proportion;
        liuliang.scaleY = proportion;
        liuliang.x = (canvas.width - liuliang_animate._frameWidth * proportion + 12.5 * proportion) / 2;
        liuliang.y = 3250;
        liuliang.framerate = 35;
        liuliang.alpha = 0;

        /**
         * 搅拌分粮层
         */
        var jiaoban_down = new createjs.Bitmap(ossURL + "jiaobanceng/down_liang0.png")
        jiaoban_down.scaleX = proportion;
        jiaoban_down.scaleY = proportion;
        jiaoban_down.x = (canvas.width - 426 * proportion) / 2;
        jiaoban_down.y = 3400;

        var jiaoban_up_img = new Array();
        for (var i = 0; i < 5; i++) {
            jiaoban_up_img[i] = ossURL + "jiaobanceng/top_liang" + i + ".png";
        }
        var jiaoban_up_animate = new createjs.SpriteSheet({
            "images": jiaoban_up_img,
            "frames": {
                width: 375,
                height: 400,
                spacing: 0,
                count: 5
            },
            "animations": {
                end: [0],
                run: {
                    frames: [0, 1, 2, 3, 4],
                    speed: 0.4
                }
            },
            "framerate": 5
        });
        var jiaoban_up = new createjs.Sprite(jiaoban_up_animate, "end");
        jiaoban_up.scaleX = proportion;
        jiaoban_up.scaleY = proportion;
        jiaoban_up.x = (canvas.width - jiaoban_up_animate._frameWidth * proportion) / 2;
        jiaoban_up.y = 4470;
        jiaoban_up.framerate = 5;

        /**
         *  水桶
         */
        var shuitong = new createjs.Bitmap(ossURL + "jiaobanceng/shuitong.png");
        shuitong.scaleX = proportion;
        shuitong.scaleY = proportion;
        shuitong.x = 0;
        shuitong.y = 4208;
        shuitong.rotation = -120;
        shuitong.alpha = 0;

        /**
         * 水花
         */
        var shuihua = new createjs.Bitmap(ossURL + "jiaobanceng/shuihua.png");
        shuihua.scaleX = proportion;
        shuihua.scaleY = proportion;
        shuihua.x = (canvas.width - 166 * proportion) / 2;
        shuihua.y = 4350;
        shuihua.alpha = 0;

        var runliangText = new createjs.Bitmap(ossURL + "text/runliang.png");
        runliangText.x = canvas.width / 2;
        runliangText.y = 4000 - 111 * 0.5 / 2;
        runliangText.scaleX = 0;
        runliangText.scaleY = 0;
        runliangText.alpha = 0;

        var runliang2Text = new createjs.Bitmap(ossURL + "text/runliang2.png");
        runliang2Text.x = canvas.width / 2;
        runliang2Text.y = 4200 - 27 * 0.5 / 2;
        runliang2Text.scaleX = 0;
        runliang2Text.scaleY = 0;
        runliang2Text.alpha = 0;

        /**
         * 铲子
         */
        var chanziA = new createjs.Bitmap(ossURL + "jiaobanceng/chanzi0.png");
        chanziA.scaleX = proportion;
        chanziA.scaleY = proportion;
        chanziA.x = - 111 * proportion / 2;
        chanziA.y = 3400;
        chanziA.alpha = 0;

        var chanziB = new createjs.Bitmap(ossURL + "jiaobanceng/chanzi1.png");
        chanziB.scaleX = proportion;
        chanziB.scaleY = proportion;
        chanziB.x = canvas.width - 111 * proportion / 2;
        chanziB.y = 3400;
        chanziB.alpha = 0;

        var banheText = new createjs.Bitmap(ossURL + "text/banhe.png");
        banheText.x = canvas.width / 2;
        banheText.y = 4000 - 112 * 0.5 / 2;
        banheText.scaleX = 0;
        banheText.scaleY = 0;
        banheText.alpha = 0;

        var banhe2Text = new createjs.Bitmap(ossURL + "text/banhe2.png");
        banhe2Text.x = canvas.width / 2;
        banhe2Text.y = 4200 - 28 * 0.5 / 2;
        banhe2Text.scaleX = 0;
        banhe2Text.scaleY = 0;
        banhe2Text.alpha = 0;

        /**
         * 搅拌流粮层
         */
        var jiaoban_liuliang_img = new Array();
        for (var i = 0; i < 23; i++) {
            jiaoban_liuliang_img[i] = preload.getResult("jiaoban_liuliang_img" + i);;
        }
        var jiaoban_liuliang_animate = new createjs.SpriteSheet({
            "images": jiaoban_liuliang_img,
            "frames": {
                width: 426,
                height: 812,
                spacing: 0,
                count: 23
            },
            "animations": {
                start: [0],
                run: [0, 22, 'start', 0.5]
            },
            "framerate": 23
        });
        var jiaoban_liuliang = new createjs.Sprite(jiaoban_liuliang_animate, "start");
        jiaoban_liuliang.scaleX = proportion;
        jiaoban_liuliang.scaleY = proportion;
        jiaoban_liuliang.x = (canvas.width - jiaoban_liuliang_animate._frameWidth * proportion) / 2;
        jiaoban_liuliang.y = 4850;
        jiaoban_liuliang.framerate = 23;

        /**
         * 发酵桶
         */
        var faxiaotong_img = new Array();
        for (var i = 0; i < 12; i++) {
            faxiaotong_img[i] = ossURL + "faxiaotong/faxiaopen" + i + ".png";
        }
        var faxiaotong_animate = new createjs.SpriteSheet({
            "images": faxiaotong_img,
            "frames": {
                width: 301,
                height: 251,
                spacing: 0,
                count: 12
            },
            "animations": {
                start: [0],
                run: [0, 11, 'end', 0.3],
                end: [11]
            },
            "framerate": 12
        });
        var faxiaotong = new createjs.Sprite(faxiaotong_animate, "start");
        faxiaotong.scaleX = proportion;
        faxiaotong.scaleY = proportion;
        faxiaotong.x = (canvas.width - faxiaotong_animate._frameWidth * proportion) / 2;
        faxiaotong.y = 6490;
        faxiaotong.framerate = 12;

        /**
         * 发酵桶盖子
         */
        var gaizi = new createjs.Bitmap(ossURL + "faxiaotong/gaizi.png");
        gaizi.scaleX = proportion;
        gaizi.scaleY = proportion;
        gaizi.x = -301 * proportion / 2;
        gaizi.y = 6090;
        gaizi.alpha = 0;

        /**
         * 发酵桶管道
         */
        var guandao = new createjs.Bitmap(ossURL + "faxiaotong/guandao.png");
        guandao.scaleX = proportion;
        guandao.scaleY = proportion;
        guandao.x = canvas.width - 301 * proportion / 6;
        guandao.y = 6090;
        guandao.alpha = 0;

        var zhengzhuText = new createjs.Bitmap(ossURL + "text/zhengzhu.png");
        zhengzhuText.x = canvas.width / 2;
        zhengzhuText.y = 6000 - 114 * 0.5 / 2;
        zhengzhuText.scaleX = 0;
        zhengzhuText.scaleY = 0;
        zhengzhuText.alpha = 0;

        var zhengzhu2Text = new createjs.Bitmap(ossURL + "text/zhengzhu2.png");
        zhengzhu2Text.x = canvas.width / 2;
        zhengzhu2Text.y = 6200 - 64 * 0.5 / 2;
        zhengzhu2Text.scaleX = 0;
        zhengzhu2Text.scaleY = 0;
        zhengzhu2Text.alpha = 0;

        /**
         * 晾晒
         */
        var liangshai = new createjs.Bitmap(ossURL + "liangshaihefeng/newliangshai.png");
        liangshai.scaleX = proportion;
        liangshai.scaleY = proportion;
        liangshai.x = (canvas.width - 651 * proportion) / 2;
        liangshai.y = 7500;

        var tanliangText = new createjs.Bitmap(ossURL + "text/tanliang.png");
        tanliangText.x = canvas.width / 2;
        tanliangText.y = 7200 - 113 * 0.5 / 2;
        tanliangText.scaleX = 0;
        tanliangText.scaleY = 0;
        tanliangText.alpha = 0;

        /**
         * 吹风
         */
        var chuifeng_img = new Array();
        for (var i = 0; i < 28; i++) {
            chuifeng_img[i] = ossURL + "liangshaihefeng/feng" + i + ".png";
        }
        var chuifeng_animate = new createjs.SpriteSheet({
            "images": chuifeng_img,
            "frames": {
                width: 384,
                height: 240,
                spacing: 0,
                count: 28
            },
            "animations": {
                start: [0],
                run: [0, 27, 'end', 0.4],
                end: [27]
            },
            "framerate": 28
        });
        var chuifeng = new createjs.Sprite(chuifeng_animate, "start");
        chuifeng.scaleX = proportion;
        chuifeng.scaleY = proportion;
        chuifeng.x = (canvas.width - chuifeng_animate._frameWidth * proportion) / 2;
        chuifeng.y = 7400;
        chuifeng.framerate = 28;

        /**
         * 投料
         */
        var touliao_img = new Array();
        for (var i = 0; i < 16; i++) {
            touliao_img[i] = ossURL + "touliao/touliao" + i + ".png";
        }
        var touliao_animate = new createjs.SpriteSheet({
            "images": touliao_img,
            "frames": {
                width: 426,
                height: 812,
                spacing: 0,
                count: 17
            },
            "animations": {
                start: [0],
                run: [0, 16, 'end', 0.4],
                end: [16]
            },
            "framerate": 17
        });
        var touliao = new createjs.Sprite(touliao_animate, "start");
        touliao.scaleX = proportion;
        touliao.scaleY = proportion;
        touliao.x = (canvas.width - touliao_animate._frameWidth * proportion) / 2;
        touliao.y = 7000;
        touliao.framerate = 17;

        var jiaquText = new createjs.Bitmap(ossURL + "text/jiaqu.png");
        jiaquText.x = canvas.width / 2;
        jiaquText.y = 8400 - 109 * 0.5 / 2;
        jiaquText.scaleX = 0;
        jiaquText.scaleY = 0;
        jiaquText.alpha = 0;

        var jiaqu2Text = new createjs.Bitmap(ossURL + "text/jiaqu2.png");
        jiaqu2Text.x = canvas.width / 2;
        jiaqu2Text.y = 8600 - 64 * 0.5 / 2;
        jiaqu2Text.scaleX = 0;
        jiaqu2Text.scaleY = 0;
        jiaqu2Text.alpha = 0;

        /**
         * 浓酱池 答题1
         */
        var nongjiangchi_img = new Array();
        for (var i = 0; i < 21; i++) {
            nongjiangchi_img[i] = ossURL + "nongjiangchi/nongjiangchi" + i + ".png";
        }
        var nongjiangchi_animate = new createjs.SpriteSheet({
            "images": nongjiangchi_img,
            "frames": {
                width: 375,
                height: 812,
                spacing: 0,
                count: 21
            },
            "animations": {
                start: [0],
                start1: {
                    frames: [18, 19, 20],
                    next: "start1end",
                    speed: 0.3
                },
                start1end: [20],
                start2: {
                    frames: [20, 19, 18],
                    next: "start2end",
                    speed: 0.3
                },
                start2end: [18],
                run: [0, 17, 'end', 0.4],
                end: [17]
            },
            "framerate": 21
        });
        var nongjiangchi = new createjs.Sprite(nongjiangchi_animate, "start");
        nongjiangchi.scaleX = proportion;
        nongjiangchi.scaleY = proportion;
        nongjiangchi.x = (canvas.width - nongjiangchi_animate._frameWidth * proportion) / 2;
        nongjiangchi.y = 8000;
        nongjiangchi.framerate = 19;

        var gutaifaxiaoText = new createjs.Bitmap(ossURL + "text/gutaifaxiao.png");
        gutaifaxiaoText.x = canvas.width / 2;
        gutaifaxiaoText.y = 8700 - 113 * 0.5 / 2;
        gutaifaxiaoText.scaleX = 0;
        gutaifaxiaoText.scaleY = 0;
        gutaifaxiaoText.alpha = 0;

        var wentiText = new createjs.Text("点击选择正确的浓香窖池", "56px Arial", "#000");
        wentiText.x = (canvas.width - wentiText.getMeasuredWidth()) / 2;
        wentiText.y = 9100;
        wentiText.shadow = new createjs.Shadow("#fff", 0, 0, 5);
        wentiText.alpha = 0;

        var jiaochixuanze_img = new Array();
        for (var i = 0; i < 19; i++) {
            jiaochixuanze_img[i] = preload.getResult("jiaochixuanze" + i);
        }
        var nijiaoBtn_animate = new createjs.SpriteSheet({
            "images": jiaochixuanze_img,
            "frames": {
                width: 151,
                height: 106,
                spacing: 0,
                count: 19
            },
            "animations": {
                start: [1],
                run: [1, 18, 'end', 0.3],
                end: [18]
            },
            "framerate": 19
        });
        var nijiaoBtn = new createjs.Sprite(nijiaoBtn_animate, "start");
        nijiaoBtn.scaleX = proportion * 0.5;
        nijiaoBtn.scaleY = proportion * 0.5;
        nijiaoBtn.x = (canvas.width - nijiaoBtn_animate._frameWidth * proportion * 0.5) / 2 - 60 * proportion;
        nijiaoBtn.y = 9400;
        nijiaoBtn.framerate = 19;

        var shijiaoBtn = new createjs.Bitmap(jiaochixuanze_img[0]);
        shijiaoBtn.scaleX = proportion * 0.5;
        shijiaoBtn.scaleY = proportion * 0.5;
        shijiaoBtn.x = (canvas.width - 151 * proportion * 0.5) / 2 + 60 * proportion;
        shijiaoBtn.y = 9400;

        var tanceng0 = new createjs.Bitmap(ossURL + "tanceng0.png");
        tanceng0.scaleX = 0;
        tanceng0.scaleY = 0;
        tanceng0.x = canvas.width / 2;
        tanceng0.y = 8650;
        tanceng0.alpha = 0;

        var next = new createjs.Bitmap(preload.getResult("next_img"));
        next.scaleX = proportion;
        next.scaleY = proportion;
        next.x = (canvas.width - 120 * proportion) / 2;
        next.y = 9700
        next.alpha = 0

        var wanniancao = new createjs.Sprite(nongjiangchi_animate, "end");
        wanniancao.scaleX = proportion;
        wanniancao.scaleY = proportion;
        wanniancao.x = (canvas.width - nongjiangchi_animate._frameWidth * proportion) / 2;
        wanniancao.y = 9200;
        wanniancao.framerate = 19;

        /**
         * tween动画执行
         */
        createjs.Tween.get(mopans)
            .wait(4700)
            .call(() => {
                /**
                 * 磨盘动画
                 */
                mopans.gotoAndPlay("run");
                createjs.Tween.get(posuiText)
                    .wait(1500)
                    .to({
                        scaleX: proportion * 0.5,
                        scaleY: proportion * 0.5,
                        x: (canvas.width - 236 * proportion * 0.5) / 2,
                        y: 3650,
                        alpha: 1
                    }, 1000)

                createjs.Tween.get(mopans).to({
                    rotation: -390,
                }, 4500).call(() => {
                    createjs.Tween.get(liuliang).to({
                        alpha: 1
                    }, 1000).call(() => {
                        liuliang.gotoAndPlay("run");
                        /**
                         * 执行流粮动画后推动幕布
                         */
                        createjs.Tween.get(container)
                            .wait(500)
                            .to({
                                y: -1450 * proportion
                            }, 3000)
                            .call(() => {
                                createjs.Tween.get(jiaoban_up)
                                    .call(() => {
                                        /**
                                         * 水桶水花动画
                                         */
                                        createjs.Tween.get(shuitong)
                                            .to({
                                                alpha: 1
                                            }, 1000)
                                            .call(() => {
                                                createjs.Tween.get(runliangText)
                                                    .wait(500)
                                                    .to({
                                                        scaleX: proportion * 0.5,
                                                        scaleY: proportion * 0.5,
                                                        x: (canvas.width - 232 * proportion * 0.5) / 2,
                                                        y: 4000,
                                                        alpha: 1
                                                    }, 1000, sineInOutEase)
                                                    .wait(1000)
                                                    .to({
                                                        alpha: 0
                                                    }, 1000)
                                                    .call(() => {
                                                        createjs.Tween.get(banheText)
                                                            .wait(500)
                                                            .to({
                                                                scaleX: proportion * 0.5,
                                                                scaleY: proportion * 0.5,
                                                                x: (canvas.width - 232 * proportion * 0.5) / 2,
                                                                y: 4000,
                                                                alpha: 1
                                                            }, 1000)
                                                    })
                                                createjs.Tween.get(runliang2Text)
                                                    .wait(500)
                                                    .to({
                                                        scaleX: proportion * 0.5,
                                                        scaleY: proportion * 0.5,
                                                        x: (canvas.width - 125 * proportion * 0.5) / 2,
                                                        y: 4200,
                                                        alpha: 1
                                                    }, 1000, sineInOutEase)
                                                    .wait(1000)
                                                    .to({
                                                        alpha: 0
                                                    }, 1000)
                                                    .call(() => {
                                                        createjs.Tween.get(banhe2Text)
                                                            .wait(500)
                                                            .to({
                                                                scaleX: proportion * 0.5,
                                                                scaleY: proportion * 0.5,
                                                                x: (canvas.width - 341 * proportion * 0.5) / 2,
                                                                y: 4200,
                                                                alpha: 1
                                                            }, 1000)
                                                    })
                                                createjs.Tween.get(shuitong)
                                                    .to({
                                                        x: 85,
                                                        rotation: 0
                                                    }, 1500)
                                                    .call(() => {
                                                        createjs.Tween.get(shuihua)
                                                            .to({
                                                                alpha: 1
                                                            }, 1000)
                                                            .call(() => {
                                                                createjs.Tween.get(shuitong)
                                                                    .wait(500)
                                                                    .to({
                                                                        alpha: 0
                                                                    }, 1000)
                                                                createjs.Tween.get(shuihua)
                                                                    .wait(500)
                                                                    .to({
                                                                        alpha: 0
                                                                    }, 1000)

                                                                /**
                                                                 * 铲子动画
                                                                 */
                                                                createjs.Tween.get(chanziA)
                                                                    .wait(750)
                                                                    .to({
                                                                        alpha: 1
                                                                    }, 1000)
                                                                    .call(() => {
                                                                        createjs.Tween.get(chanziA)
                                                                            .to({
                                                                                x: 100,
                                                                                y: 4200
                                                                            }, 1000)
                                                                            .call(() => {
                                                                                createjs.Tween.get(chanziA, { loop: 3 })
                                                                                    .to({
                                                                                        x: 110,
                                                                                        rotation: 5
                                                                                    }, 200, sineInOutEase)
                                                                                    .to({
                                                                                        x: 90,
                                                                                        rotation: -5
                                                                                    }, 200, sineInOutEase)
                                                                            })
                                                                    })
                                                                createjs.Tween.get(chanziB)
                                                                    .wait(750)
                                                                    .to({
                                                                        alpha: 1
                                                                    }, 1000)
                                                                    .call(() => {
                                                                        createjs.Tween.get(chanziB)
                                                                            .to({
                                                                                x: canvas.width - 161 * proportion,
                                                                                y: 4200
                                                                            }, 1000)
                                                                            .call(() => {
                                                                                createjs.Tween.get(chanziB, { loop: 3 })
                                                                                    .to({
                                                                                        x: canvas.width - 151 * proportion,
                                                                                        rotation: -5
                                                                                    }, 200, sineInOutEase)
                                                                                    .to({
                                                                                        x: canvas.width - 171 * proportion,
                                                                                        rotation: 5
                                                                                    }, 200, sineInOutEase)

                                                                                /**
                                                                                 * 搅拌层动画触发
                                                                                 */
                                                                                jiaoban_up.gotoAndPlay("run");
                                                                                createjs.Tween.get(jiaoban_liuliang)
                                                                                    .wait(2000)
                                                                                    .call(() => {
                                                                                        jiaoban_up.gotoAndPlay("end");
                                                                                        createjs.Tween.get(container)
                                                                                            .to({
                                                                                                y: -2200 * proportion
                                                                                            }, 3000)
                                                                                        createjs.Tween.get(jiaoban_liuliang)
                                                                                            .wait(2100)
                                                                                            .call(() => {
                                                                                                jiaoban_liuliang.gotoAndPlay("run");
                                                                                            })
                                                                                        createjs.Tween.get(faxiaotong)
                                                                                            .wait(2300)
                                                                                            .call(() => {
                                                                                                faxiaotong.gotoAndPlay("run");
                                                                                                createjs.Tween.get(zhengzhuText)
                                                                                                    .wait(1500)
                                                                                                    .to({
                                                                                                        scaleX: proportion * 0.5,
                                                                                                        scaleY: proportion * 0.5,
                                                                                                        x: (canvas.width - 416 * proportion * 0.5) / 2,
                                                                                                        y: 6000,
                                                                                                        alpha: 1
                                                                                                    }, 1000)
                                                                                                createjs.Tween.get(zhengzhu2Text)
                                                                                                    .wait(1500)
                                                                                                    .to({
                                                                                                        scaleX: proportion * 0.5,
                                                                                                        scaleY: proportion * 0.5,
                                                                                                        x: (canvas.width - 281 * proportion * 0.5) / 2,
                                                                                                        y: 6200,
                                                                                                        alpha: 1
                                                                                                    }, 1000)
                                                                                                createjs.Tween.get(gaizi)
                                                                                                    .wait(1000)
                                                                                                    .to({
                                                                                                        alpha: 1
                                                                                                    }, 500)
                                                                                                createjs.Tween.get(guandao)
                                                                                                    .wait(1000)
                                                                                                    .to({
                                                                                                        alpha: 1
                                                                                                    }, 500)
                                                                                                createjs.Tween.get(gaizi)
                                                                                                    .wait(2000)
                                                                                                    .to({
                                                                                                        x: (canvas.width - 301 * proportion) / 2,
                                                                                                        y: 6440
                                                                                                    }, 1000)
                                                                                                createjs.Tween.get(guandao)
                                                                                                    .wait(2000)
                                                                                                    .to({
                                                                                                        x: (canvas.width - 301 * proportion + 225 * proportion) / 2,
                                                                                                        y: 6310
                                                                                                    }, 1000)
                                                                                                    .call(() => {
                                                                                                        createjs.Tween.get(tanliangText)
                                                                                                            .wait(1500)
                                                                                                            .to({
                                                                                                                scaleX: proportion * 0.5,
                                                                                                                scaleY: proportion * 0.5,
                                                                                                                x: (canvas.width - 230 * proportion * 0.5) / 2,
                                                                                                                y: 7200,
                                                                                                                alpha: 1
                                                                                                            }, 1000)
                                                                                                        createjs.Tween.get(container)
                                                                                                            .to({ y: -2700 * proportion }, 2500)
                                                                                                            .call(() => {
                                                                                                                createjs.Tween.get(chuifeng)
                                                                                                                    .wait(1000)
                                                                                                                    .call(() => {
                                                                                                                        chuifeng.gotoAndPlay("run");
                                                                                                                        createjs.Tween.get(touliao)
                                                                                                                            .wait(1500)
                                                                                                                            .call(() => {
                                                                                                                                touliao.gotoAndPlay("run");
                                                                                                                                createjs.Tween.get(jiaquText)
                                                                                                                                    .wait(500)
                                                                                                                                    .to({
                                                                                                                                        scaleX: proportion * 0.5,
                                                                                                                                        scaleY: proportion * 0.5,
                                                                                                                                        x: (canvas.width - 222 * proportion * 0.5) / 2,
                                                                                                                                        y: 8400,
                                                                                                                                        alpha: 1
                                                                                                                                    }, 1000, sineInOutEase)
                                                                                                                                    .wait(1000)
                                                                                                                                    .to({
                                                                                                                                        alpha: 0
                                                                                                                                    }, 1000)
                                                                                                                                createjs.Tween.get(jiaqu2Text)
                                                                                                                                    .wait(500)
                                                                                                                                    .to({
                                                                                                                                        scaleX: proportion * 0.5,
                                                                                                                                        scaleY: proportion * 0.5,
                                                                                                                                        x: (canvas.width - 245 * proportion * 0.5) / 2,
                                                                                                                                        y: 8600,
                                                                                                                                        alpha: 1
                                                                                                                                    }, 1000, sineInOutEase)
                                                                                                                                    .wait(1000)
                                                                                                                                    .to({
                                                                                                                                        alpha: 0
                                                                                                                                    }, 1000)
                                                                                                                                createjs.Tween.get(container)
                                                                                                                                    .wait(1500)
                                                                                                                                    .to({ y: -3250 * proportion }, 3000)
                                                                                                                                    .call(() => {
                                                                                                                                        createjs.Tween.get(gutaifaxiaoText)
                                                                                                                                            .wait(500)
                                                                                                                                            .to({
                                                                                                                                                scaleX: proportion * 0.5,
                                                                                                                                                scaleY: proportion * 0.5,
                                                                                                                                                x: (canvas.width - 454 * proportion * 0.5) / 2,
                                                                                                                                                y: 8700,
                                                                                                                                                alpha: 1
                                                                                                                                            }, 1000)
                                                                                                                                        createjs.Tween.get(wentiText)
                                                                                                                                            .to({ alpha: 1 }, 1000)
                                                                                                                                    })
                                                                                                                            })
                                                                                                                    })
                                                                                                            })
                                                                                                    })
                                                                                            });
                                                                                    })
                                                                            })
                                                                    })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
                });
            });

        nijiaoBtnFun = () => {
            nongjiangEnd("nijiao", "1")
        }
        shijiaoBtnFun = () => {
            nongjiangEnd("nijiao", "0")
        }

        nongjiangEnd = (timu, daan) => {
            switch (timu) {
                case 'nijiao':
                    nijiaoBtn.removeEventListener("click", nijiaoBtnFun);
                    shijiaoBtn.removeEventListener("click", shijiaoBtnFun);
                    wentiText.text = "浓香用泥窖发酵";
                    wentiText.x = (canvas.width - wentiText.getMeasuredWidth()) / 2;
                    nijiaoBtn.gotoAndPlay("run");
                    createjs.Tween.get(wentiText)
                        .wait(2000)
                        .to({
                            alpha: 0
                        })
                        .call(() => {
                            createjs.Tween.get(nongjiangchi)
                                .wait(800)
                                .call(() => {
                                    jiaoban_liuliang.y = 7500;
                                    jiaoban_liuliang.gotoAndPlay("run");
                                    nongjiangchi.gotoAndPlay("run");
                                    createjs.Tween.get(gutaifaxiaoText)
                                        .wait(500)
                                        .to({
                                            alpha: 0
                                        }, 1000)
                                    createjs.Tween.get(tanceng0)
                                        .wait(1000)
                                        .to({
                                            scaleX: proportion * 0.5,
                                            scaleY: proportion * 0.5,
                                            x: (canvas.width - 500 * proportion * 0.5) / 2,
                                            y: 8450,
                                            alpha: 1
                                        }, 2000)
                                        .call(() => {
                                            createjs.Tween.get(next)
                                                .wait(500)
                                                .to({
                                                    alpha: 1
                                                }, 1000)
                                        })
                                })
                        });
                    console.log(daan);
                    break;
            }
        }

        nijiaoBtn.addEventListener("click", nijiaoBtnFun)
        shijiaoBtn.addEventListener("click", shijiaoBtnFun)

        nextFun = () => {
            next.removeEventListener("click", nextFun);
            // createjs.Tween.get(container)
            //     .to({
            //         y: -9800
            //     }, 2000)
        }
        next.addEventListener("click", nextFun)

        container.addChild(
            liangshicao, A_Car, B_Car, liangshi_lizi, xuanliangText,
            mopan, liuliang, mopans, posuiText,
            jiaoban_down, shuitong, shuihua, chanziA, chanziB, jiaoban_up, runliangText, runliang2Text, banheText, banhe2Text,
            faxiaotong, gaizi, guandao, jiaoban_liuliang, zhengzhuText, zhengzhu2Text,
            liangshai, chuifeng, touliao, tanliangText, jiaquText, jiaqu2Text,
            nongjiangchi, wentiText, nijiaoBtn, shijiaoBtn, tanceng0, gutaifaxiaoText,
            wanniancao,
            next
        )

        // canvas.addEventListener("touchstart", handleTouchstart)
        // canvas.addEventListener("touchmove", handleTouchmove)
        // canvas.addEventListener("touchend", handleTouchend)

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
