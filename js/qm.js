window.onload=function(){
	showTopSign('top',68);
	sideBarIn('top');
	sideBarIn('QQ');
	sideBarIn('phone');

	function showTopSign(signId,param){
		var sign=document.getElementById(signId);
		window.onscroll=function(){
			var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
			if (scrollTop>=param) {
				sign.style.display='block';
			}else{
				sign.style.display='none';
			}
		}
	}

	//处理子元素造成的mouseover和mouseout→方法: 利用contains和event.fromElement,event.toElement(也可以用setTimeout)
	function sideBarIn(barId){
		var barId=document.getElementById(barId);
		var targetBar=document.getElementById(barId.id+'Bar');
		var timer=null;
		if (document.addEventListener) {//chrome、FF、IE9/10/11
			barId.addEventListener('mouseover',mouseoverSideBar,false);
			barId.addEventListener('mouseout',mouseoutSideBar,false);
		}else if (document.attachEvent) {//IE8
			barId.attachEvent('onmouseover',function(){
				mouseoverSideBar.call(barId);//若直接使用函数，this指向window；通过匿名函数调用，通过call()使得函数运行时this指向barId
			});
			barId.attachEvent('onmouseout',function(){
				mouseoutSideBar.call(barId);
			});
		}else{
			barId.onmouseover=mouseoverSideBar;
			barId.onmouseout=mouseoutSideBar;
		}
		
		function mouseoverSideBar(e){
			var e=window.event||e;//获取event对象
			if (!this.contains(e.fromElement)) {
				timer=setInterval(function(){
					var targetLeft=targetBar.offsetLeft;
					var speed=Math.floor((-112-targetLeft)/10);//速度由差值生成
					if (targetLeft==-112) {
						clearInterval(timer);
					}else{
						targetBar.style.left=targetLeft+speed+'px';
					}
				},10);
			}
		}

		function mouseoutSideBar(e){
			var e=window.event||e;
			if (!this.contains(e.toElement)) {
				clearInterval(timer);
				targetBar.style.left=50+'px';
			}
		}
	}

	//处理FF不支持fromElement&toElement问题
	if(window.addEventListener) { 
		var userAgent=navigator.userAgent;
		if (userAgent.indexOf('Firefox')>-1) {
			FixPrototypeForGecko();
		}
	} 
	function  FixPrototypeForGecko(){
		Event.prototype.__defineGetter__("fromElement",  element_prototype_get_fromElement);
      	Event.prototype.__defineGetter__("toElement", element_prototype_get_toElement);
	}
	function element_prototype_get_fromElement() {
      	var node;
      	if(this.type == "mouseover") node = this.relatedTarget;
      	else if (this.type == "mouseout") node = this.target;
      	if(!node) return;
      	while (node.nodeType != 1)
          	node = node.parentNode;
      	return node;
  	}

  	function  element_prototype_get_toElement() {
        var node;
        if(this.type == "mouseout")  node = this.relatedTarget;
        else if (this.type == "mouseover") node = this.target;
        if(!node) return;
        while (node.nodeType != 1)
            node = node.parentNode;
        return node;
  	}

	//导航条子集展示方法
	var navs=document.getElementById('navBar').children;
	for(var i=0;i<navs.length;i=i+2){
		(function(i) {
			var navs_i=navs[i];
			if (document.addEventListener) {
				navs_i.addEventListener('mouseover',navMouseover,false);
				navs_i.addEventListener('mouseout',navMouseout,false);
			}else if (document.attachEvent) {
				navs_i.attachEvent('onmouseover',function(){
					navMouseover.call(navs_i);
				})
				navs_i.attachEvent('onmouseout',function(){
					navMouseout.call(navs_i);
				})
			}else{
				navs_i.onmouseover=navMouseover;
				navs_i.onmouseout=navMouseout;
			}
		})(i)
	}
	function navMouseover(e){
		var e=e||window.event;
		if(!this.contains(e.fromElement)){
				this.getElementsByTagName('a')[0].className+=' nav_choice_hover';
				var subNav=this.getElementsByTagName('ul')[0]
				if(subNav!=undefined){subNav.style.display='block';}
			}
	}
	function navMouseout(e){
		var e=e||window.event;
			if (!this.contains(e.toElement)) {
				this.getElementsByTagName('a')[0].className='nav_choice';
				var subNav=this.getElementsByTagName('ul')[0];
				if(subNav!=null){subNav.style.display='none';}
			}
	}

	//服务内容切换
	var svc_left=document.getElementById('svc_left');
	var svc_right=document.getElementById('svc_right');
	var svcs=document.getElementById('svcs');
	var svcs_width=svcs.offsetWidth;
	svc_left.onclick=function(){
		var svcs_left=svcs.offsetLeft;
		if (svcs_left<=-1012) {
			var svcs_timer=setInterval(function(){
				if (svcs_left<=-2006) {
					i=0;
					clearInterval(svcs_timer);
				}else{
					svcs.style.left=svcs_left-Math.ceil((svcs_left+2006)/30)+'px';
					svcs_left=svcs.offsetLeft;
				}
			},5);
		}else if (svcs_left==-18) {
			var svcs_timer=setInterval(function(){
				if (svcs_left<=-1012) {
					clearInterval(svcs_timer);
				}else{
					
					svcs.style.left=svcs_left-Math.ceil((svcs_left+1012)/30)+'px';
					svcs_left=svcs.offsetLeft;
				}
			},5);
		}
		
	}
	svc_right.onclick=function(){
		var svcs_left=svcs.offsetLeft;
		if (svcs_left==-1012) {
			var svcs_timer=setInterval(function(){
				if (svcs_left>=-18) {
					clearInterval(svcs_timer);
				}else{
					svcs.style.left=svcs_left-Math.floor((svcs_left+18)/30)+'px';
					svcs_left=svcs.offsetLeft;
				}
			},5);
		}else if (svcs_left==-2006) {
			var svcs_timer=setInterval(function(){
				var svcs_left=svcs.offsetLeft;
				if (svcs_left>=-1012) {
					clearInterval(svcs_timer);
				}else{
					svcs.style.left=svcs_left-Math.floor((svcs_left+1012)/30)+'px';
					svcs_left=svcs.offsetLeft;
				}
			},5);
		}
	}

	//news_banner图片轮换
	var nb_index=1;
	var nb_timer=null;
	switchImgs();
	switchImgs_onhand();
	function switchImgs(){
		nb_timer=setInterval(function(){
			var nb_wrapper_current=document.getElementById('nb0'+nb_index);
			var nb_bt_current=document.getElementById('nb_bt0'+nb_index);
			nb_index++;
			if (nb_index==4) {nb_index=1;}
			var nb_wrapper=document.getElementById('nb0'+nb_index);
			var nb_bt=document.getElementById('nb_bt0'+nb_index);
			nb_bt_current.className='';
			nb_bt.className='on';
			var opacity_in=0;
			var opacity_out=100;
			var nb_opacity_timer=setInterval(function(){
				if (opacity_in==120&&opacity_out==-20) {
					clearInterval(nb_opacity_timer);
				}else{
					nb_wrapper_current.style.opacity=opacity_out/100;
					nb_wrapper_current.style.filter='alpha(opacity='+opacity_out+')';
					nb_wrapper.style.opacity=opacity_in/100;
					nb_wrapper.style.filter='alpha(opacity='+opacity_in+')';
					opacity_out-=20;
					opacity_in+=20;
				}
			},100);
		},4000);
	}
	function switchImgs_onhand(){
		var news_img_btns=document.getElementById('news_img_btn').getElementsByTagName('span');
		var nb_wrappers=document.getElementById('nb_wrappers').getElementsByTagName('li');
		for (var i=0;i<news_img_btns.length;i++) {
			news_img_btns[i].i=i;
			news_img_btns[i].onclick=function(){
				clearInterval(nb_timer);
				for(var j=0;j<nb_wrappers.length;j++){
					nb_wrappers[j].style.opacity=0;
					nb_wrappers[j].style.filter='alpha(opacity:0)';
					news_img_btns[j].className='';
				}
				news_img_btns[this.i].className='on';
				nb_wrappers[this.i].style.opacity=1;
				nb_wrappers[this.i].style.filter='alpha(opacity:100)';
				nb_index=this.i+1;
				switchImgs();
			}
		}
	}

	//预约咨询
	var sb_consult=document.getElementById('sb_consult');
	var scm_wrapper=document.getElementById('scm_wrapper');
	var scm_close_bt=document.getElementById('scm_close_bt');
	var scm_cancle=document.getElementById('scm_cancle');
	sb_consult.onclick=function(){
		scm_wrapper.style.display='block';
	}
	scm_close_bt.onclick=function(){
		scm_wrapper.style.display='none';
	}
	scm_cancle.onclick=function(){
		scm_wrapper.style.display='none';
	}

}
