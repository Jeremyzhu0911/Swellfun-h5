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

function main() {

    var manifest;
    var preload;
    var ossURL = "https://oss-baijiuxuefang.oss-cn-beijing.aliyuncs.com/oss-baijiuxuefang/njjh/";

    //构建显示对象的容器
    var loadingContainer = new createjs.Container();

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

    /**
     * 基础动画 - 定位
     * 粮食槽
     * 磨盘
     */

    var liangshicao = new createjs.Bitmap("./assets/images/liangshicao.png");
    liangshicao.x = (canvas.width - 426 * proportion) / 2;
    liangshicao.y = 500;
    liangshicao.scaleX = proportion;
    liangshicao.scaleY = proportion;

    var mopan = new createjs.Bitmap("./assets/images/mopan.png");
    mopan.x = (canvas.width - 237 * proportion) / 2;
    mopan.y = 3000;
    mopan.scaleX = proportion;
    mopan.scaleY = proportion;

    //加载loading 
    var loadingbox = new createjs.Shape(),
        loadingbg = new createjs.Shape(),
        loadingsp = new createjs.Shape();

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

    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: ossURL + "close.png",
            id: "closeBtn"
        }];

        for (var i = 1; i < 3; i++) {
            manifest.push({
                src: ossURL + "click_" + i + ".png",
                id: 'btn' + i
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
        container.addChild(liangshicao)
        loadingContainer.addChild(loadingbox, loadingbg, loadingsp, loading_logo, progressText);
        stage.addChild(container, loadingContainer);
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
         * 粮食粒子
         */
        var liangshi_lizi_img = new Array();
        for (var i = 0; i < 30; i++) {
            liangshi_lizi_img[i] = "./assets/images/liangshilizi/" + i + ".png";
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
                run: [0, 29, 'end', 0.4],
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
            .wait(750)
            .call(() => {
                liangshi_lizi.gotoAndPlay("run");
            })
            .to({
                y: 450 * proportion
            }, 3400);

        createjs.Tween.get(container)
            .wait(500)
            .to({
                y: -830 * proportion
            }, 3000);

        /**
         * 运粮车
         */
        var A_Car_img = new Array();
        for (var i = 0; i < 28; i++) {
            A_Car_img[i] = "./assets/images/yunliangche/A_Car" + i + ".png";
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

        var B_Car = new createjs.Bitmap("./assets/images/yunliangche/B_Car0.png")
        B_Car.scaleX = proportion;
        B_Car.scaleY = proportion;
        B_Car.regX = 74 / 2;
        B_Car.x = (canvas.width - 74 * proportion + 160 * proportion) / 2;
        B_Car.y = 380;

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

        /**
         * 旋转的磨盘
         */

        var mopans_img = new Array();
        for (var i = 0; i < 27; i++) {
            mopans_img[i] = "./assets/images/mopan/" + i + ".png";
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

        /**
         * 磨盘流粮
         */
        var liuliang_img = new Array();
        for (var i = 0; i < 35; i++) {
            liuliang_img[i] = "./assets/images/mopanliuliang/" + i + ".png";
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
        var jiaoban_down = new createjs.Bitmap("./assets/images/jiaobanceng/down_liang0.png")
        jiaoban_down.scaleX = proportion;
        jiaoban_down.scaleY = proportion;
        jiaoban_down.x = (canvas.width - 426 * proportion) / 2;
        jiaoban_down.y = 3400;

        var jiaoban_up_img = new Array();
        for (var i = 0; i < 5; i++) {
            jiaoban_up_img[i] = "./assets/images/jiaobanceng/top_liang" + i + ".png";
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
        jiaoban_up.y = 4450;
        jiaoban_up.framerate = 5;

        /**
         *  水桶
         */
        var shuitong = new createjs.Bitmap("./assets/images/jiaobanceng/shuitong.png");
        shuitong.scaleX = proportion;
        shuitong.scaleY = proportion;
        shuitong.x = 0;
        shuitong.y = 4208;
        shuitong.rotation = -120;
        shuitong.alpha = 0;

        /**
         * 水花
         */
        var shuihua = new createjs.Bitmap("./assets/images/jiaobanceng/shuihua.png");
        shuihua.scaleX = proportion;
        shuihua.scaleY = proportion;
        shuihua.x = (canvas.width - 166 * proportion) / 2;
        shuihua.y = 4350;
        shuihua.alpha = 0;

        /**
         * 铲子
         */
        var chanziA = new createjs.Bitmap("./assets/images/jiaobanceng/chanzi0.png");
        chanziA.scaleX = proportion;
        chanziA.scaleY = proportion;
        chanziA.x = - 111 * proportion / 2;
        chanziA.y = 3400;
        chanziA.alpha = 0;

        var chanziB = new createjs.Bitmap("./assets/images/jiaobanceng/chanzi1.png");
        chanziB.scaleX = proportion;
        chanziB.scaleY = proportion;
        chanziB.x = canvas.width - 111 * proportion / 2;
        chanziB.y = 3400;
        chanziB.alpha = 0;

        /**
         * 搅拌流粮层
         */
        var jiaoban_liuliang_img = new Array();
        for (var i = 0; i < 12; i++) {
            jiaoban_liuliang_img[i] = "./assets/images/jiaobanliuliang/down_liuliang" + i + ".png";
        }
        var jiaoban_liuliang_animate = new createjs.SpriteSheet({
            "images": jiaoban_liuliang_img,
            "frames": {
                width: 426,
                height: 812,
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
        var jiaoban_liuliang = new createjs.Sprite(jiaoban_liuliang_animate, "start");
        jiaoban_liuliang.scaleX = proportion;
        jiaoban_liuliang.scaleY = proportion;
        jiaoban_liuliang.x = (canvas.width - jiaoban_liuliang_animate._frameWidth * proportion) / 2;
        jiaoban_liuliang.y = 4850;
        jiaoban_liuliang.framerate = 12;

        /**
         * 发孝桶
         */
        var faxiaotong_img = new Array();
        for (var i = 0; i < 12; i++) {
            faxiaotong_img[i] = "./assets/images/faxiaotong/faxiaopen" + i + ".png";
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
         * 发孝桶盖子
         */
        var gaizi = new createjs.Bitmap("./assets/images/faxiaotong/gaizi.png");
        gaizi.scaleX = proportion;
        gaizi.scaleY = proportion;
        gaizi.x = -301 * proportion / 2;
        gaizi.y = 6090;
        gaizi.alpha = 0;

        /**
         * 发孝桶管道
         */
        var guandao = new createjs.Bitmap("./assets/images/faxiaotong/guandao.png");
        guandao.scaleX = proportion;
        guandao.scaleY = proportion;
        guandao.x = canvas.width - 301 * proportion / 6;
        guandao.y = 6090;
        guandao.alpha = 0;

        /**
         * 晾晒
         */
        var liangshai = new createjs.Bitmap("./assets/images/liangshaihefeng/newliangshai.png");
        liangshai.scaleX = proportion;
        liangshai.scaleY = proportion;
        liangshai.x = (canvas.width - 651 * proportion) / 2;
        liangshai.y = 7500;

        /**
         * 吹风
         */
        var chuifeng_img = new Array();
        for (var i = 0; i < 28; i++) {
            chuifeng_img[i] = "./assets/images/liangshaihefeng/feng" + i + ".png";
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
            touliao_img[i] = "./assets/images/touliao/touliao" + i + ".png";
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
                                                                var sineInOutEase = createjs.Ease.sineInOut;
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
                                                                                        jiaoban_liuliang.gotoAndPlay("run");
                                                                                        createjs.Tween.get(container)
                                                                                            .to({
                                                                                                y: -2200 * proportion
                                                                                            }, 1300)
                                                                                        createjs.Tween.get(faxiaotong)
                                                                                            .wait(500)
                                                                                            .call(() => {
                                                                                                faxiaotong.gotoAndPlay("run");
                                                                                                // gaizi.alpha = 1;
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
                                                                                                        createjs.Tween.get(container)
                                                                                                            .to({ y: -2700 * proportion }, 3000)
                                                                                                            .call(() => {
                                                                                                                createjs.Tween.get(chuifeng)
                                                                                                                    .wait(1000)
                                                                                                                    .call(() => {
                                                                                                                        chuifeng.gotoAndPlay("run");
                                                                                                                        createjs.Tween.get(touliao)
                                                                                                                            .wait(1500)
                                                                                                                            .call(() => {
                                                                                                                                touliao.gotoAndPlay("run");

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

        container.addChild(
            liangshicao, A_Car, B_Car, liangshi_lizi,
            mopan, liuliang, mopans,
            jiaoban_down, shuitong, shuihua, chanziA, chanziB, jiaoban_up,
            faxiaotong, gaizi, guandao, jiaoban_liuliang,
            liangshai, chuifeng, touliao
        )

        closeBtn.addEventListener("click", () => {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btnContainer);
        })

        close2Btn.addEventListener("click", () => {
            mymusic.paused = true;
            PausedTime()
            container.removeAllChildren();
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn2Container);
        })

        close3Btn.addEventListener("click", () => {
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btn3Container);
        })

        close4Btn.addEventListener("click", () => {
            mymusic.paused = true;
            PausedTime()
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btn4Container);
        })

        close5Btn.addEventListener("click", () => {
            mymusic.paused = true;
            PausedTime()
            canvas.addEventListener("touchstart", handleTouchstart)
            canvas.addEventListener("touchmove", handleTouchmove)
            canvas.addEventListener("touchend", handleTouchend)
            container.removeAllChildren();
            container.addChild(pagebackground, btn5Container);
        })

        btnContainer.addEventListener("click", () => {
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btnContainer, alertContainer);
        })

        btn2Container.addEventListener("click", () => {
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

        btn3Container.addEventListener("click", () => {
            alert2num.gotoAndPlay("run")
            canvas.removeEventListener("touchstart", handleTouchstart)
            canvas.removeEventListener("touchmove", handleTouchmove)
            canvas.removeEventListener("touchend", handleTouchend)
            container.addChild(pagebackground, btn3Container, alert3Container);
        })

        btn4Container.addEventListener("click", () => {
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

        btn5Container.addEventListener("click", () => {
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
