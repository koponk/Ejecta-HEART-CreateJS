
	var canvas;
	var stage;

	function init() {
		//find canvas and load images, wait for last image to load
		canvas = document.getElementById("canvas");
		stage = new createjs.Stage(canvas);
		
		// set up a couple of display objects which will act as source material, and add them to the stage:
		var circle = new createjs.Shape();
		circle.graphics.beginFill("#F00").drawCircle(0,0,30).beginFill("#C00").drawCircle(0,0,10);
		circle.setTransform(100,90);
		
		var square = new createjs.Container();
		var squareBg = square.addChild(new createjs.Shape());
		squareBg.graphics.beginFill("#00F").drawRect(0,0,80,80);
		var squareFld = square.addChild(new createjs.Text("1", "bold 72px Arial", "#9BF"));
		squareFld.textBaseline = "top";
		squareFld.textAlign = "center";
		squareFld.x = 40;
		square.setTransform(150,50);
		// we'll define the bounds of this shape here, and it will be used when we addFrame:
		square.bounds = new createjs.Rectangle(0,0,80,80);
		
		stage.addChild(circle, square);
		
		// create the sprite sheet builder:
		var builder = new createjs.SpriteSheetBuilder();
		
		// add the circle as a frame, specify the bounds to draw, and grab the frame index:
		var index = builder.addFrame(circle, new createjs.Rectangle(-30,-30,60,60));
		// add a named animation using the frame index:
		builder.addAnimation("circle", index);
		
		// add the square as a sequence of frames, each with a different number in the text field:
		var frames = [];
		for (var i=0; i<5; i++) {
			// we're defining a setup function that will update the text before each frame draw.
			// the setup function will be called right before the draw, and passed the setup params "[i]":
			index = builder.addFrame(square, null, 1, function(num) { squareFld.text=num; }, [i]);
			// save off the index of each frame in order to use when defining the animation:
			frames.push(index);
		}
		// create an animation named square that comprises all of the frames we just added:
		// we're also telling it to loop the animation and setting a frequency so it updates every 8 ticks:
		builder.addAnimation("square", frames, true, 8);
		
		// run the build operation, and grab the resulting sprite sheet:
		// we could also do this asynchronously with buildAsync(...)
		var spriteSheet = builder.build();
		
		// create our bitmap animations using the generated sprite sheet, and put them on stage:
		var circle2 = new createjs.BitmapAnimation(spriteSheet);
		circle2.gotoAndPlay("circle");
		circle2.setTransform(100,90+100);
		stage.addChild(circle2);
		
		var square2 = new createjs.BitmapAnimation(spriteSheet);
		square2.gotoAndPlay("square");
		square2.setTransform(150,50+100);
		stage.addChild(square2);
		
		// append the generated spritesheet image for demo purposes:
		document.body.appendChild(spriteSheet._images[0]);
		
		// we want to do some work before we update the canvas,
		// otherwise we could use Ticker.addListener(stage);
		createjs.Ticker.addListener(stage);
	}
