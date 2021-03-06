	var canvas;
	var stage;
	var starfield
	var moon;
	var sky;

	function init() {

		// create a new stage and point it at our canvas:
		canvas = document.getElementById("canvas");
		stage = new createjs.Stage(canvas);
		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(stage);

		// draw the sky:
		sky = new createjs.Shape();
		//sky.graphics.beginLinearGradientFill(["#204","#003","#000"], [0,0.15,0.6], 0, canvas.height, 0, 0);
		sky.graphics.drawRect(0, 0, canvas.width, canvas.height);
		stage.addChild(sky);

		// create a Shape instance to draw the vectors stars in, and add it to the stage:
		starfield = new createjs.Shape();
		stage.addChild(starfield);

		// set up the cache for the star field shape, and make it the same size as the canvas:
		starfield.cache(0,0,canvas.width,canvas.height);

		// draw the moon in a separate shape, so it isn't part of the generative caching:
		moon = new createjs.Shape();
		moon.graphics.beginFill("#CCF").drawCircle(0,0,60);
		moon.graphics.beginFill("#000").drawEllipse(-35,-57,96,114);
		moon.rotation = -30;
		stage.addChild(moon);

		// start the tick and point it at the window so we can do some work before updating the stage:
		createjs.Ticker.addListener(window);
		createjs.Ticker.setFPS(60);
	}

	function stop() {
		createjs.Ticker.removeListener(window);
	}

	function tick() {
		// draw a vector star at a random location:
		starfield.graphics.beginFill(createjs.Graphics.getRGB(0xFFFFFF)).drawPolyStar(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*4+1, 5, 0.93, Math.random()*360);

		// draw the new vector onto the existing cache, compositing it with the "source-overlay" composite operation:
		starfield.updateCache("source-overlay");

		// if you omit the compositeOperation param in updateCache, it will clear the existing cache, and draw into it:
		// in this demo, that has the effect of showing just the star that was drawn each tick.
		// shape.updateCache();

		// because the vector star has already been drawn to the cache, we can clear it right away:
		starfield.graphics.clear();

		// darken the sky:
		sky.alpha -= 0.0005;

		// move the moon across the sky:
		var w = canvas.width+200;
		moon.x = (moon.x+100+1+w)%w-100;
		moon.y = 250-Math.sin(moon.x/w*Math.PI)*150;

		// draw the updates to stage:
		stage.update();
	}