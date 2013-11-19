
    var App = {};

    var camera, scene, renderer, light;

    var polys, planes;

    var score = 0;
    var lives = 10;

    var isMobile = false;
    var isFullScreen = false;

    var paused = false;
    var speedInit = 15;
    var speed = speedInit;
    var horizon = 3000;
    var beta = 0;

    var time = Date.now();

    var velocity = 0;

    var sounds = {};

    window.onload = init;


//	init();

    function init(){

        renderer = new THREE.WebGLRenderer( { antialias: false } );

        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild(renderer.domElement);

        renderer.setClearColor(0x000000, 1.0);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, horizon);

        camera.position.y = -500;
        camera.position.z = 20;

        camera.lookAt(new THREE.Vector3(0,0,0));

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( renderer.getClearColor(), 0.0009 );

        hlight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.8 );
        hlight.position.set( 0, 500, 0 );
        scene.add( hlight );

        light = new THREE.PointLight(0xffffff);
        light.position.set(-1000,-90,100);
        scene.add(light);

        addPlanes();

        addPolys();

        // initAudio();


        window.addEventListener( 'resize', onWindowResize, false );

        renderer.domElement.addEventListener("touchstart", onTouchStart, false);

        renderer.domElement.addEventListener("touchend", onTouchEnd, false);

        animate();

        pauseGame();

        document.getElementById('score').innerHTML = '<p>Get the <span class="callout">green</span> energy!</p>';


}

    function initAudio(){

        var soundFiles = {
            'shot'  : 'Game-Shot.mp3',
            'death' : 'Game-Death.mp3',
            'spawn' : 'Game-Spawn.mp3',
            'break' : 'Game-Break.mp3'
        }

        for(var soundName in soundFiles) {
            var a = new Audio( soundFiles[soundName] );
            a.preload = 'auto';
			sounds[soundName] = a;
        }
    }


    function addPlanes(){

        planes = [];
        var planeSegments = 60;

        var plane = new THREE.Mesh(
          new THREE.PlaneGeometry(horizon, horizon, planeSegments, planeSegments),
          new THREE.MeshBasicMaterial({ color:0x00FFFF, wireframe:true, transparent:true })
        );


/*
          var plane = new THREE.SceneUtils.createMultiMaterialObject(
          new THREE.PlaneGeometry(horizon, horizon, planeSegments, planeSegments),
          [new THREE.MeshBasicMaterial({ color:0x000000 }), new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, wireframeLinewidth: 2} )]
          //new THREE.MeshPhongMaterial( { color: 0xe4e4e4 } )
        );
*/
        plane.position.z = -20;


        planes[0] = plane;

        planes[1] = plane.clone();
        planes[1].position.y = plane.position.y + horizon;

        planes[2] = plane.clone();
        planes[2].position.y = plane.position.y + horizon * 2;

        scene.add(planes[0]);
        scene.add(planes[1]);
        scene.add(planes[2]);

    }


    function addPolys(){

        polys = [];

        var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.5 } );

        var cube = new THREE.SceneUtils.createMultiMaterialObject(
          new THREE.CubeGeometry(30, 30, 30),
          //[darkMaterial, new THREE.MeshBasicMaterial( { color: 0xCF0505, wireframe: true, wireframeLinewidth: 3} )]
          [new THREE.MeshPhongMaterial( { color: 0xCF0505 } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1} )]
        );

        var tetra = new THREE.SceneUtils.createMultiMaterialObject(
          new THREE.TetrahedronGeometry( 15, 0),
          //[darkMaterial, new THREE.MeshBasicMaterial( { color: 0xF6790B, wireframe: true, wireframeLinewidth: 3} )]
          [new THREE.MeshPhongMaterial( { color: 0xF6790B } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1} )]
        );

        var octa = new THREE.SceneUtils.createMultiMaterialObject(
          new THREE.OctahedronGeometry( 10, 0),
          //[darkMaterial, new THREE.MeshBasicMaterial( { color: 0x17C2EA, wireframe: true, wireframeLinewidth: 3} )]
          [new THREE.MeshPhongMaterial( { color: 0x00FF00 } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1} )]
        );

        // var cone = new THREE.SceneUtils.createMultiMaterialObject(
        //     new THREE.CylinderGeometry( 0, 30, 100, 20, 4 ),
        //     //[darkMaterial, new THREE.MeshBasicMaterial( { color: 0xCDF346, wireframe: true, wireframeLinewidth: 3} )]
        //     [new THREE.MeshPhongMaterial( { color: 0xCDF346 } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1} )]
        //   );

        var cone = new THREE.Mesh(
            new THREE.CylinderGeometry( 50, 50, 800, 20, 4 ),
            //[darkMaterial, new THREE.MeshBasicMaterial( { color: 0xCDF346, wireframe: true, wireframeLinewidth: 3} )]
            //new THREE.MeshPhongMaterial( { color: 0xCDF346, transparent: true, opacity: 0.3} )
            new THREE.MeshPhongMaterial( { color: 0x00FFFF, transparent: true, opacity: 0.3} )

          );


        var isoc = new THREE.SceneUtils.createMultiMaterialObject(
            new THREE.IcosahedronGeometry( 30, 0 ),
             //[darkMaterial, new THREE.MeshBasicMaterial( { color: 0xCC00FF, wireframe: true, wireframeLinewidth: 3} )]
             [new THREE.MeshPhongMaterial( { color: 0xCC00FF } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1} )]
        );

        var totalPolys = 450;

        for(var i = 0; i < totalPolys; i++){
          var poly;
          if(i < (totalPolys * 0.6)){
            poly = octa.clone();
            poly.shape = 'octa';
          } else if(i >= totalPolys * 0.6 && i < totalPolys * 0.9){
            poly = tetra.clone();
            poly.shape = 'tetra';
          } else {
            poly = cube.clone();
            poly.shape = 'cube';
          }

          poly.position.set(Math.random() * horizon - horizon/2, Math.random() * horizon + horizon/2, 20);

          poly.spinX = (Math.random() * 30 - 15) / 1000;
          poly.spinY = (Math.random() * 8 - 4) /100;

          poly.modX = (Math.random() * 20 - 10)/10;
          poly.modY = (Math.random() * 10 - 5)/10;
          polys.push(poly);
          scene.add( poly );
        }


         var poly = isoc.clone();
         poly.shape = 'isoc';

          poly.position.set(Math.random() * horizon - horizon/2, Math.random() * horizon + horizon/2, 20);

          poly.spinX =  (Math.random() * 30 - 15) / 100;
          poly.spinY = (Math.random() * 8 - 4) /10;

          poly.modX = 0;
          poly.modY = 0;
          polys.push(poly);
          scene.add( poly );


        // Cones

        for(var i = 0; i < 12; i++){

          var poly = cone.clone();
          poly.shape = 'cone';

          poly.position.set(Math.random() * horizon - horizon/2, Math.random() * horizon + horizon/2, 380);

          poly.rotation.x = Math.PI /2;

          poly.spinX = 0;
          poly.spinY = 0;
          poly.modX = 0;
          poly.modY = 0;

          polys.push(poly);
          scene.add( poly );

        }

    }

    function render() {
                renderer.render( scene, camera );
    }

    function animate() {

        if (!paused) {

            // -- Polys

            for(var i = 0; i < polys.length; i++){
                var poly = polys[i];
                poly.rotation.x += poly.spinX;
                poly.rotation.y += poly.spinY;
                poly.position.x += poly.modX;
                poly.position.y += - speed  - poly.modY;

                if(poly.position.y < camera.position.y){

                    if(poly.position.x >= camera.position.x -25 && poly.position.x <= camera.position.x +25){

                        if(poly.shape == 'octa'){
                            playSound('shot');
                            score = score + (10 * (speed - speedInit + 1) );
                            updateScore();
                        }
                        if(poly.shape == 'isoc'){
                            playSound('spawn');
                            score = score + (50 * (speedInit - speed + 1) );
                            updateScore();
                        }
                        if(poly.shape == 'tetra'){
                            playSound('break');
                            lives--;
                            updateLives();
                        }
                        if(poly.shape == 'cube'){
                            playSound('break');
                            lives = lives - 2;
                            updateLives();
                        }
                        if(poly.shape == 'cone'){
                            playSound('break');
                            lives = lives - 5;
                            updateLives();
                        }
                    }


                    polys[i].position.x = Math.random() * horizon - horizon/2;
                    polys[i].position.y = horizon;
                }

            }

            // -- Planes

            if(planes[0].position.y < - horizon ){
              planes[0].position.y = planes[2].position.y + horizon;

            }

            if(planes[1].position.y < - horizon ){
              planes[1].position.y = planes[0].position.y + horizon;
            }

            if(planes[2].position.y < - horizon ){
              planes[2].position.y = planes[1].position.y + horizon;
              speed++;
            }

            planes[0].position.y +=- speed ;
            planes[1].position.y +=- speed ;
            planes[2].position.y +=- speed ;

            // -- Camera

            camera.translateX( beta );

            light.position.x = camera.position.x;

            if(camera.position.x > horizon/2){
                camera.position.x = horizon/2;
            }

            if(camera.position.x < -horizon/2){
                camera.position.x = -horizon/2;
            }

            // -- Draw it!



        }

        render();

		window.setTimeout(animate, 1000/60);

    }



    function updateScore(){

        document.getElementById('score').innerHTML = score;

    }

    function updateLives(){

        document.getElementById('lives').innerHTML = lives;

        if(lives < 1){
            gameOver();
        }

    }

    function pauseGame(){

        if(!paused){
            paused = true;
            //stopSound('music');
        } else {
            paused = false;
            //playSound('music');
            updateScore();
            updateLives();
        }

    }


    function gameOver(){

        playSound('death');

        document.getElementById('score').innerHTML = 'GAME OVER<br>SCORE: ' + score * 10;

        document.getElementById('lives').innerHTML = '';

        pauseGame();

        score = 0;
        lives = 10;
        speed = speedInit;

    }


    function playSound(sound){
        if(window.Audio){

            //console.log('playing: ' + sound);

            //var snd = document.getElementById(sound);
            var snd = sounds[sound];

            if(!snd){
                return;
            }
            snd.volume = 0.1;

            try {
                snd.pause();
                snd.currentTime = 0;
            } catch (err){}

            snd.play();

        }
    }

    function stopSound(sound){
        if(window.Audio){

           // var snd = document.getElementById(sound);

            var snd = sounds[sound];

            if(!snd){
                return;
            }
            try {
                snd.pause();
                snd.currentTime = 0;
            } catch (err){}

        }
    }


// ---- Events

function onTouchStart(event) {

        if(paused){
            pauseGame();
        }

        touchX = event.touches[0].clientX;

        var percent = touchX / window.innerWidth;

        beta = percent * 90 - 45;

}


function onTouchEnd(event){
    beta = 0;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();

}

