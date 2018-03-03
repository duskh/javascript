/*
		atuoSwitchWithPicture(exhibitionDiv,arrJson):实现图片轮播功能，并显示图片描述文字
		exhibitionDiv:div容器对象，用来存放图片和文本;容器的宽高，需要事先给定
		arrJson:json数组，用来保存图片的路径以及图片描述文字
		{
			"mSrc":"dusk",
			"mText":" 初中的时候特别迷恋这首歌,歌曲给人的感觉迷离凄美,很符合黄昏的意境。最近在虎扑看到一个关于周传雄最好听歌曲的投票的帖子"
		}  传入的json的格式

	*/
	function autoSwitchWithPicture(exhibitionDiv,arrJson){
		var eW = exhibitionDiv.clientWidth;
		var eH = exhibitionDiv.clientHeight;
		exhibitionDiv.style.cssText = "box-shadow:0 0 20px black;overflow:hidden;position:absolute;";
		//创建图片和文本
		var imgs = [];
		for(var i = 0;i<2;i++){
			imgs[i] = document.createElement("img");
			imgs[i].style.cssText = "position:absolute;width:"+eW+"px;height:"+eH+"px;";
			exhibitionDiv.appendChild(imgs[i]);   //添加到div中
		}
		/*
			特别注意这里，imgs由数组变成了NodeList，如果没有这一步，会出错
		*/
		imgs = exhibitionDiv.getElementsByTagName("img");   
		//设置imgs各自的定位
		imgs[0].style.left = "0px";
		imgs[1].style.left = eW+"px";
		var p = document.createElement("p");
		exhibitionDiv.appendChild(p);

		var pH = eH/5;
		p.style.cssText = "bottom:"+(-pH)+"px;position:absolute;background:rgba(0,0,0,.5);color:white;width:"+eW+"px;height:"+pH+"px;";
		
		var len = arrJson.length;   

		 i = 0;
		//初始图片及其内容
	    p.innerHTML = arrJson[0]["mText"];	
		imgs[0].src = arrJson[0]["mSrc"];
		imgs[1].src = arrJson[1]["mSrc"];
		doMove(p,"bottom",20,0,function(){
				setTimeout(function(){
					doMove(p,"bottom",20,-pH,function(){
						i = ++i%len;
						doQie(imgs,p,arrJson,i);
					});
				},1000);
		});
		
		function doQie(imgs,p,arrJson,i){   //i表示即将出现的图片的下标
			var len = arrJson.length;
			/*新图片出场,当前图片离场；imgs[0]保存的是要离场的图片，imgs[1]	保存的是要登场的图片*/
			doMove(imgs[0],"left",150,-eW);
			doMove(imgs[1],"left",150,0,function(){
			/*当要登场的图片登场后，就得让已经退场的img保存下一次要登场的图片，并将位置更改到开始登场的位置*/
			imgs[0].style.left=eW+"px";
			var next = (i+1)%len;
			imgs[0].src = arrJson[next]["mSrc"];
			/*交换节点,使得imgs[0]和imgs[1]在NodeList中的顺序更改,更改后,imgs[0]就不再是之前的imgs[0]了，在节点树中，imgs[0]保存的是当前的图片*/
			var par = imgs[0].parentNode;
			par.insertBefore(imgs[0],p);
			//正在登场的图片的描述内容
			p.innerHTML =  arrJson[i]["mText"];
			//移动文本
			doMove(p,"bottom",20,0,function(){
				setTimeout(function(){
					doMove(p,"bottom",20,-pH,function(){

						doQie(imgs,p,arrJson,next);
					});
				},1000);
			});
		});

	}

	/*
		元素移动
		function doMove(obj,dir,velocity,distance,endFun)
		obj:元素对象；dir:移动方向;velocity:移动速度;distance:目的点坐标;endFun:回调函数
	*/
	function doMove(obj,dir,velocity,distance,endFun){
		clearInterval(obj.timer,100);
		obj.timer = setInterval(function(){
			var curP = parseInt(getStyle(obj,dir));
			if(curP<distance){
				if(curP+velocity>distance){
					curP = distance;
					obj.style[dir] = curP+"px";
					clearInterval(obj.timer);
					endFun&&endFun();
				}
				else
					curP += velocity;
			}else{
				if(curP-velocity < distance){
					curP = distance;
					obj.style[dir] = curP+"px";
					clearInterval(obj.timer);
					endFun&&endFun();
				}else
					curP  -= velocity;
			}
			obj.style[dir] = curP+"px";
			

		},100);
		
	}

}