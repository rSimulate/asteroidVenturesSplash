if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var AsteroidCanvas = function() {
    console.log("Initiating Probe Canvas");
    // set the scene size
    var WIDTH = $(window).width() * 0.95,
        HEIGHT = $(window).height() * 0.95;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // get the DOM element to attach to
    var $container = $('#asteroid');
    var renderer, camera, scene, controls;

    function AsteroidInit() {
        // create a WebGL renderer, camera
        // and a scene
        renderer = new THREE.WebGLRenderer();
        camera =
            new THREE.PerspectiveCamera(
                VIEW_ANGLE,
                ASPECT,
                NEAR,
                FAR);

        scene = new THREE.Scene();

        // add the camera to the scene
        scene.add(camera);

        // the camera starts at 0,0,0
        // so pull it back
        camera.position.z = 20;

        // start the renderer
        renderer.setSize(WIDTH, HEIGHT);

        // attach the render-supplied DOM element
        $container.append(renderer.domElement);

        // controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 30;
        pointLight.position.y = 50;
        pointLight.position.z = -50;

        // add to the scene
        scene.add(pointLight);
    }

    function initSkybox() {
        var geometry = new THREE.SphereGeometry(FAR / 2.0, 60, 40);

        var uniforms = {
            texture: {
                type: 't',
                value: THREE.ImageUtils.loadTexture('img/eso_dark.jpg')
            }
        };

        var material = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   document.getElementById('sky-vertex').textContent,
            fragmentShader: document.getElementById('sky-fragment').textContent
        });

        var skybox = new THREE.Mesh(geometry, material);
        skybox.scale.set(-1, 1, 1);
        skybox.eulerOrder = 'XZY';
        skybox.rotation.z = Math.PI/3.0;
        skybox.rotation.x = Math.PI;
        skybox.renderDepth = 1000.0;
        scene.add(skybox);
    }

    function generateBlenderMesh(objPath) {
        // generates blender mesh for webGL from obj file
        var loader = new THREE.OBJLoader();

        loader.load(objPath, function (object) {
            var material = new THREE.MeshLambertMaterial( { color: 0x666666 } );

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                }
            } );

            scene.add( object );
        });
    }

    function animate() {
        requestAnimationFrame(animate, undefined);
        controls.update();
        renderer.render(scene, camera);
    }

    this.main = function() {
        AsteroidInit();
        initSkybox();
        generateBlenderMesh('models/toutatis/hirestoutatis.obj');
        animate();
    };
};

var asteroidCanvas = new AsteroidCanvas();
asteroidCanvas.main();