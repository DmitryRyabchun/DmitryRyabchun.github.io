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
    render.setClearColor(0xFFFFFF);
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
    var textureFloor = THREE.ImageUtils.loadTexture('models/floor/floor_texture.jpg');
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
        console.log(object);
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                meshes.push(child);
            }
        });
        var table = [];

        for(let i = 0; i < meshes.length; i++) {
            table.push(meshes[i]);
            scene.add(table[i]);

            table[i].position.z = -0.660;

            table[i].rotation.y = 45 * (Math.PI/180);

            table[i].scale.x = 2;
            table[i].scale.y = 2;
            table[i].scale.z = 2;

            table[i].material = new THREE.MeshPhongMaterial({
                map: textureTable
            });
        }
    });


//--------------------Dresser--------------------
    var textureDresser = new THREE.Texture();

    loader.load('models/dresser/dresser_texture.jpg', function(image) {
        textureDresser.image = image;
        textureDresser.needsUpdate = true;
    });
    objLoader.load('models/dresser/dresser.obj', function (object) {
        console.log(object);
        meshes = [];
        object.traverse(function(child) {
            if(child instanceof THREE.Mesh) {
                meshes.push(child);
            }
        });
        var dresser = [];

        for(let i = 0; i < meshes.length; i++) {
            dresser.push(meshes[i]);
            scene.add(dresser[i]);

            dresser[i].position.x = 7.157;
            dresser[i].position.z = -10.030;

            dresser[i].scale.x = 0.030;
            dresser[i].scale.y = 0.030;
            dresser[i].scale.z = 0.030;

            dresser[i].material = new THREE.MeshPhongMaterial({
                map: textureDresser
            });
        }
    });


//--------------------Chair--------------------
    var textureChair = new THREE.Texture();

    loader.load('models/chair/chair_texture.jpg', function(image) {
        textureChair.image = image;
        textureChair.needsUpdate = true;
    });

    objLoader.load('models/chair/chair.obj', function (object) {
        console.log(object);
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

    loader.load('models/sofa/sofa_texture.jpg', function(image) {
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
    var mouseX = window.innerWidth/2;
    var cameraMove = false;
    var lastMouseX = 0;
    
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
            console.log(mouseX);
        }
    }

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('mousemove', mouseMove);
    
    function cameraMovement() {
        if(keyboard[87]){ // W key
            camera.position.x -= Math.sin(camera.rotation.y) * observer.speed;
            camera.position.z -= Math.cos(camera.rotation.y) * observer.speed;
        }
        if(keyboard[83]){ // S key
            camera.position.x += Math.sin(camera.rotation.y) * observer.speed;
            camera.position.z += Math.cos(camera.rotation.y) * observer.speed;
        }
        if(keyboard[65]){ // A key
            camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * observer.speed;
            camera.position.z += Math.cos(camera.rotation.y - Math.PI/2) * observer.speed;
        }
        if(keyboard[68]){ // D key
            camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * observer.speed;
            camera.position.z += Math.cos(camera.rotation.y + Math.PI/2) * observer.speed;
        }

        if(keyboard[37]){ // left arrow key
            camera.rotation.y += observer.turnSpeed;
        }
        if(keyboard[39]){ // right arrow key
            camera.rotation.y -= observer.turnSpeed;
        }
        if(keyboard[38]){ // left arrow key
            camera.position.y += observer.turnSpeed;
        }
        if(keyboard[40]){ // right arrow key
            camera.position.y -= observer.turnSpeed;
        }
        if(cameraMove) {
            camera.rotation.y += (mouseX - lastMouseX)*0.002;
            lastMouseX = mouseX;
        }
    }


//--------------------Rendering--------------------
    var rendering = function() {
        requestAnimationFrame(rendering);
        cameraMovement();
        console.log('x: '+camera.position.x+'\nz: '+camera.position.z+'\nr: '+camera.rotation.y);
        render.render(scene, camera);
    }

    rendering();
}