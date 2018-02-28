/**
 *	App
 *	Driving application.
 */
function App () {
	this.html = document.getElementsByTagName('html')[0];
	this.body = document.body;
	this.elem = window;
	this.elem.addEventListener('load',this.onLoad.bind(this),false);
}

App.prototype.onLoad = function() {
	this.rocket = document.getElementsByClassName('rocket')[0];
	this.fire = document.getElementsByClassName('fire')[0];
	this.smoke = Array.prototype.slice.call(document.getElementsByClassName('smoke')[0].children,0);
	this.hold = document.getElementsByClassName('hold')[0].getElementsByTagName('h1')[0];
	this.h1 = Array.prototype.slice.call(document.getElementsByClassName('texts')[0].getElementsByTagName('h1'),0);
	this.h2 = document.getElementsByClassName('texts')[0].getElementsByTagName('h2')[0];
	this.download = document.getElementsByClassName('texts')[0].getElementsByTagName('a')[0];
	this.p = Array.prototype.slice.call(document.getElementsByClassName('engine-status')[0].getElementsByTagName('p'),0);
	this.skip = document.getElementsByClassName('skip')[0].getElementsByTagName('p')[0];
	this.path = this.draw();

	this.timelines = [];
	this.skipped = false;
	this.completed = false;
	this.duration = 2.5;

	this.createFirstTimeline();
	this.pressedTime = null;
	this.currentTime = null;

	this.createSecondTime();

	this.createSkipTime();

	this.bindEvents();
};

App.prototype.draw = function() {
	var percent = 0.9999;	
	var	width = 8,
		half = width/2,
		middle = 30,
		radius = middle-half, 
		mid = (percent < 0.5) ? 0:1, 
		x = middle+Math.cos((-90 + 360 * percent) * Math.PI / 180) * radius, 
		y = middle+Math.sin((-90 + 360 * percent) * Math.PI / 180) * radius, 
		d = 'M '+middle+' '+half+' A '+radius+' '+radius+' 0 '+mid+' 1 '+x+' '+y;
	var paths = Array.prototype.slice.call(document.getElementsByTagName('path'),0);
		paths.forEach(function(elem){
		   	elem.setAttribute('stroke-width',width);
			elem.setAttribute('d',d);
			TweenMax.set(elem,{drawSVG:0}); 
		});
	return paths;
};

App.prototype.createFirstTimeline = function() {
	this.timelines.push(new TimelineMax({paused:true}));
	this.timelines[0].to(this.hold,0.8,{y:this.hold.offsetHeight,ease:Quint.easeOut},0);
	this.timelines[0].to(this.skip,0.8,{y:this.skip.offsetHeight,ease:Quint.easeOut},0);
	this.timelines[0].staggerTo(this.p,0.8,{y:0,ease:Quint.easeOut},0.15,0);
	this.timelines[0].to(this.path[0],0.8,{drawSVG:'100%',ease:Quint.easeOut},0);
	this.timelines[0].to(this.rocket,2.4,{y:-40,ease:Quint.easeOut},0);
	this.timelines[0].to(this.fire,2.4,{y:-40,autoAlpha:1,ease:Quint.easeOut},0);
	this.timelines[0].to(this.smoke,2.4,{scale:1,ease:Quint.easeOut},0);
	this.timelines[0].to(this.path[1],this.duration,{drawSVG:'100%',stroke:'#ffce54',ease:Linear.easeNone},0);
};

App.prototype.createSecondTime = function() {
	this.timelines.push(new TimelineMax({paused:true}));
	this.timelines[1].set(this.skip.parentNode.parentNode,{display:'none'},0);
	this.timelines[1].set(this.hold.parentNode.parentNode,{display:'none'},0);
	this.timelines[1].staggerTo(this.p.reverse(),0.8,{y:this.p[0].offsetHeight,ease:Quint.easeOut},0.15,0);
	this.timelines[1].to(this.path,1.2,{drawSVG:0,stroke:'#fff',ease:Quint.easeOut},0);
	this.timelines[1].to(this.rocket,8,{y:-window.innerHeight,ease:Quint.easeOut},0);
	this.timelines[1].to(this.fire,8,{y:-window.innerHeight,ease:Quint.easeOut},0);
	this.timelines[1].to(this.smoke,2,{scale:2,autoAlpha:0,ease:Quint.easeOut},0);
	this.timelines[1].staggerTo(this.h1,0.8,{y:0,ease:Quint.easeOut},0.15,0.8);
	this.timelines[1].to(this.h2,0.8,{y:0,ease:Quint.easeOut},1.1);
	this.timelines[1].to(this.download,0.8,{y:0,ease:Quint.easeOut},1.3);
};

App.prototype.createSkipTime = function() {
	this.timelines.push(new TimelineMax({paused:true}));
	this.timelines[2].to(this.skip,0.4,{y:this.skip.offsetHeight,ease:Quint.easeIn,onComplete:function(){
		TweenMax.set(this.skip.parentNode.parentNode,{display:'none'});
	},onCompleteScope:this},0);
	this.timelines[2].to(this.hold,0.6,{y:this.hold.offsetHeight,ease:Quint.easeIn,onComplete:function(){
		TweenMax.set(this.hold.parentNode.parentNode,{display:'none'});
	},onCompleteScope:this},0.05);
	this.timelines[2].to(this.rocket,8,{y:-window.innerHeight,ease:Quint.easeOut},0);
	this.timelines[2].to(this.fire,0.8,{autoAlpha:1,ease:Quint.easeOut},0);
	this.timelines[2].to(this.fire,8,{y:-window.innerHeight,ease:Quint.easeOut},0);
	this.timelines[2].to(this.smoke,2,{scale:2,autoAlpha:0,ease:Quint.easeOut},0);
	this.timelines[2].staggerTo(this.h1,0.8,{y:0,ease:Quint.easeOut},0.15,0.8);
	this.timelines[2].to(this.h2,0.8,{y:0,ease:Quint.easeOut},1.1);
	this.timelines[2].to(this.download,0.8,{y:0,ease:Quint.easeOut},1.3);
};

App.prototype.bindEvents = function() {
	var click = 'ontouchstart' in document ? 'touchstart':'click';
	this.elem.addEventListener(click,this.onClick.bind(this),false);
	this.elem.addEventListener('keydown',this.onKeyDown.bind(this),false);
	this.elem.addEventListener('keyup',this.onKeyUp.bind(this),false);
	TweenMax.ticker.addEventListener('tick',this.onTick.bind(this),false);
};

App.prototype.onClick = function(e) {
	this.skipped = true;
	this.completed = true;
	this.timelines[2].play();
};

App.prototype.onKeyDown = function(e) {
	if (this.currentTime !== null || this.completed) {
		return;
	}
	if (e.keyCode === 32) {
		this.pressedTime = new Date().getTime() / 1000;
		this.currentTime = this.pressedTime;
	}
};

App.prototype.onKeyUp = function() {
	this.pressedTime = null;
	this.currentTime = null;
};

App.prototype.onTick = function() {

	if (this.skipped) {
		return;
	}

	if (this.currentTime === null && !this.completed) {
		if (this.timelines[0].progress() !== 0) {
			this.timelines[0].timeScale(4);
			this.timelines[0].reverse();
		}
		return;
	}

	if (!this.completed) {
		this.currentTime = new Date().getTime() / 1000;
		var elapsed = this.currentTime-this.pressedTime;
			elapsed = Math.min(elapsed,this.duration);
		var percentage = (elapsed / this.duration) * 100;
		if (percentage !== 100) {
			this.timelines[0].timeScale(1);
			this.timelines[0].play();
		} else {
			this.completed = true;
		}
	} else {
		this.timelines[1].play();
	}
		
};