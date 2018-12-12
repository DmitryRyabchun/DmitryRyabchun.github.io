window.onload = function(){
//--------------------Basic settings--------------------
    var keyboard = {};
    var scene = new THREE.Scene();
    scene.position.set(1, 0, 1);

    var camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.lookAt(new THREE.Vector3(1, 5, 0));
    camera.position.set(10, 5, 10);
    camera.rotation.set(0, 0.75, 0);
    var observer = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

    var render = new THREE.WebGLRenderer({antialias:true});
    render.setSize(window.innerWidth, window.innerHeight);
    render.setClearColor(0xbdbdbd);
    document.body.appendChild(render.domElement);

    var manager = new THREE.LoadingManager();
    var loader = new THREE.ImageLoader(manager);

    var objLoader = new THREE.OBJLoader();
    var meshes = [];


//--------------------Lighting--------------------
    var light = new THREE.DirectionalLight(0xfff7e8, 1);

    light.position.y = 15;

    scene.add(light);


    //--------------------Floor--------------------
    var textureFloor = THREE.ImageUtils.loadTexture('models/floor/floor_texture.jpeg');
    var floorGeometry = new THREE.PlaneGeometry( 20, 20, 20 );
    var floorMaterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide, map: textureFloor});
    var floor = new THREE.Mesh( floorGeometry, floorMaterial );

    floor.rotation.x = -90 * (Math.PI/180);

    scene.add( floor );


//--------------------Table--------------------
    var textureTable = new THREE.Texture();

    loader.load('models/table/table_texture.jpg', function(image) {
        textureTable.image = image;
        textureTable.needsUpdate = true;
    });

    objLoader.load('models/table/table.obj', function (object) {
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                meshes.push(new THREE.Geometry().fromBufferGeometry(child.geometry));
            }
        });

        var geomTable = new THREE.Geometry();
        for(let i = 0; i < meshes.length; i++) {
            geomTable.mergeMesh(new THREE.Mesh(meshes[i]));
        }
        geomTable.mergeVertices();
        var table = new THREE.Mesh(geomTable, new THREE.MeshPhongMaterial({map: textureTable}));

        table.position.z = -0.660;

        table.rotation.y = 45 * (Math.PI/180);

        table.scale.x = 2;
        table.scale.y = 2;
        table.scale.z = 2;

        scene.add(table);
    });


//--------------------Dresser--------------------
    var textureDresser = new THREE.Texture();

    loader.load('models/dresser/dresser_texture.jpg', function(image) {
        textureDresser.image = image;
        textureDresser.needsUpdate = true;
    });
    objLoader.load('models/dresser/dresser.obj', function (object) {
        meshes = [];
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                meshes.push(new THREE.Geometry().fromBufferGeometry(child.geometry));
            }
        });

        var geomDresser = new THREE.Geometry();
        for(let i = 0; i < meshes.length; i++) {
            geomDresser.mergeMesh(new THREE.Mesh(meshes[i]));
        }
        geomDresser.mergeVertices();
        var dresser = new THREE.Mesh(geomDresser, new THREE.MeshPhongMaterial({map: textureDresser}));

        dresser.position.x = 7.157;
        dresser.position.z = -10.030;

        dresser.scale.x = 0.030;
        dresser.scale.y = 0.030;
        dresser.scale.z = 0.030;

        scene.add(dresser);
    });


//--------------------Chair--------------------
    var textureChair = new THREE.Texture();

    loader.load('models/chair/chair_texture.jpeg', function(image) {
        textureChair.image = image;
        textureChair.needsUpdate = true;
    });

    objLoader.load('models/chair/chair.obj', function (object) {
        meshes = [];
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                var chair = child;

                chair.position.x = -3.819;
                chair.position.z = -0.690;

                scene.add(chair);

                chair.material = new THREE.MeshPhongMaterial({
                    map: textureChair
                });
            }
        });
    });


//--------------------Sofa--------------------
    var textureSofa = new THREE.Texture();

    loader.load('models/sofa/sofa_texture.png', function(image) {
        textureSofa.image = image;
        textureSofa.needsUpdate = true;
    });

    objLoader.load('models/sofa/sofa.obj', function (object) {
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                var sofa = child;

                sofa.position.x = -5.468;
                sofa.position.z = 6.696;

                sofa.rotation.x = -90 * (Math.PI/180);
                sofa.rotation.z = 180 * (Math.PI/180);

                sofa.scale.x = 0.04;
                sofa.scale.y = 0.04;
                sofa.scale.z = 0.04;

                scene.add(sofa);

                sofa.material = new THREE.MeshPhongMaterial({
                    map: textureSofa
                });
            }
        });
    });
    camera.enabled=false;


//--------------------Control--------------------
    var mouse = new THREE.Vector2();
    var mouseX = window.innerWidth/2;
    var cameraMove = false;
    var lastMouseX = 0;
    var moveLength = 0;

    var furnitureData = [{
        x: 0,
        z: 0,
        decription: 'cupboard'
    }, {
        x: 0,
        z: 0,
        decription: 'sofa'
    }, {
        x: 0,
        z: 0,
        decription: 'chair'
    }, {
        x: 0,
        z: 0,
        decription: 'table'
    }];

    manager.onLoad = function ( ) {
        setTimeout(function (){
            for(let i = 3; i < scene.children.length; i++) {
                furnitureData[i-3].x = scene.children[i].position.x;
                furnitureData[i-3].z = scene.children[i].position.z;
            }
            document.getElementsByClassName('loader')[0].style.display = 'none';
            clearInterval(loaderTimer);
        }, 1500);

    };
    
    function keyDown(event){
        keyboard[event.keyCode] = true;
    }

    function keyUp(event){
        keyboard[event.keyCode] = false;
    }

    function mouseDown(event) {
        cameraMove = true;
        mouseX = event.clientX;
        lastMouseX = event.clientX;
    }
    
    function mouseUp(event) {
        cameraMove = false;
        mouseX = window.innerWidth/2;
    }

    function mouseMove(event) {
        if (cameraMove) {
            mouseX = event.clientX;
            moveLength++;
        }
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        var x, y;

        if ( event.changedTouches ) {
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;

        checkIntersection();
    }

    function mouseClick(event) {
        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( [ scene ], true );

        if ( intersects.length > 0 && intersects[ 0 ].object.uuid !== scene.children[1].uuid && moveLength === 0) {
            var selectedObject = intersects[ 0 ].object;
            addSelectedObject( selectedObject );
            for(let i = 0; i < furnitureData.length; i++) {
                if(selectedObject.position.x === furnitureData[i].x && selectedObject.position.z === furnitureData[i].z) {
                    document.getElementsByClassName('description')[0].innerHTML = furnitureData[i].decription;
                }

            }
            document.getElementsByClassName('info')[0].style.display = 'block';
        } else {
            moveLength = 0;
        }
    }

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('click', mouseClick);
    
    function cameraMovement() {
        if(keyboard[87]){
            camera.position.x -= Math.sin(camera.rotation.y) * observer.speed;
            camera.position.z -= Math.cos(camera.rotation.y) * observer.speed;
        }
        if(keyboard[83]){
            camera.position.x += Math.sin(camera.rotation.y) * observer.speed;
            camera.position.z += Math.cos(camera.rotation.y) * observer.speed;
        }
        if(keyboard[65]){
            camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * observer.speed;
            camera.position.z += Math.cos(camera.rotation.y - Math.PI/2) * observer.speed;
        }
        if(keyboard[68]){
            camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * observer.speed;
            camera.position.z += Math.cos(camera.rotation.y + Math.PI/2) * observer.speed;
        }

        if(keyboard[37]){
            camera.rotation.y += observer.turnSpeed;
        }
        if(keyboard[39]){
            camera.rotation.y -= observer.turnSpeed;
        }
        if(keyboard[38]){
            camera.position.y += observer.turnSpeed;
        }
        if(keyboard[40]){
            camera.position.y -= observer.turnSpeed;
        }
        if(cameraMove) {
            camera.rotation.y += (mouseX - lastMouseX)*0.002;
            lastMouseX = mouseX;
        }
    }


//--------------------Loading Screen--------------------

    var loaderTimer = setInterval(function() {
        switch (document.getElementsByClassName('loader-dots')[0].textContent) {
            case '': document.getElementsByClassName('loader-dots')[0].innerHTML = '.';
                break;
            case '.': document.getElementsByClassName('loader-dots')[0].innerHTML = '..';
                break;
            case '..': document.getElementsByClassName('loader-dots')[0].innerHTML = '...';
                break;
            case '...': document.getElementsByClassName('loader-dots')[0].innerHTML = '';
                break;
        }
    }, 500);


//--------------------Rendering--------------------

    var container;
    var raycaster = new THREE.Raycaster();

    var selectedObjects = [];

    var composer, effectFXAA, outlinePass;
    var group = new THREE.Group();

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    render.shadowMap.enabled = true;

    scene.add( group );

    composer = new THREE.EffectComposer( render );

    var renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );

    outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
    outlinePass.visibleEdgeColor.set( 0xff5722 );
    outlinePass.hiddenEdgeColor.set(0xff5722);
    composer.addPass( outlinePass );

    effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );

    function addSelectedObject( object ) {

        selectedObjects = [];
        selectedObjects.push( object );

    }

    function checkIntersection() {

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( [ scene ], true );

        if ( intersects.length > 0 && intersects[ 0 ].object.uuid !== scene.children[1].uuid) {
            var selectedObject = intersects[ 0 ].object;
            addSelectedObject( selectedObject );
            outlinePass.selectedObjects = selectedObjects;
        } else {
            outlinePass.selectedObjects = [];
        }
    }

    var rendering = function() {
        requestAnimationFrame(rendering);
        cameraMovement();
        composer.render();
    }
    rendering();
}