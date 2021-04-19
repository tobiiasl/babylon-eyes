interface EyePair {
    left: BABYLON.Mesh;
    right: BABYLON.Mesh;
}

class Playground {
    public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -20), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, 1, -1), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1;

        var eyes1 = this.createEyePair(new BABYLON.Color3(0, 0.85, 1), scene);
        var eyes2 = this.createEyePair(new BABYLON.Color3(0, 1, 0.58), scene);
        var eyes3 = this.createEyePair(new BABYLON.Color3(0.6, 0.85, 1), scene);
        var eyes4 = this.createEyePair(new BABYLON.Color3(0.6, 0.44, 0.6), scene);

        this.eyesSetPosition(eyes1, new BABYLON.Vector3(0, 0, 0));
        this.eyesSetPosition(eyes2, new BABYLON.Vector3(-10, 5, 10));
        this.eyesSetPosition(eyes3, new BABYLON.Vector3(4, 4, 4));
        this.eyesSetPosition(eyes4, new BABYLON.Vector3(-3, -3, -3));

        var fly = this.createFly(scene);
        fly.position = new BABYLON.Vector3(1, 0, -3);

        var index = 0;
        setInterval(() => {
            index++;
            var speed = 0.3;
            fly.position = new BABYLON.Vector3(
                Math.sin(index*.1 * speed) * 3,
                Math.cos(index * .17 * speed) * 3,
                -10 + Math.sin((index* .05 + 0.5) * speed) * 7
            );
            this.eyesLookAt(eyes1, fly.position);   
            this.eyesLookAt(eyes2, fly.position);               
            this.eyesLookAt(eyes3, fly.position);               
            this.eyesLookAt(eyes4, fly.position);               
        }, 1000/60);

        // var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
        // ground.position.y = -1;
        return scene;
    }

    public static eyesSetPosition(eyes: EyePair, position: BABYLON.Vector3) {
        var origoDistance = Math.abs(eyes.left.position.x - eyes.right.position.x);
        var leftX = position.x - origoDistance / 2;
        var rightX = position.x + origoDistance / 2;

        eyes.left.position = new BABYLON.Vector3(leftX, position.y, position.z);
        eyes.right.position = new BABYLON.Vector3(rightX, position.y, position.z);    
    }

    public static eyesLookAt(eyes: EyePair, point: BABYLON.Vector3) {
        this.eyeLookAt(eyes.left, point);
        this.eyeLookAt(eyes.right, point);        
    }

    public static eyeLookAt(eye: BABYLON.Mesh, point: BABYLON.Vector3) {
        var gazeVector = point.subtract(eye.position);
        var alpha = Math.atan2(gazeVector.y, -gazeVector.z);
        var beta = Math.atan2(gazeVector.x, -gazeVector.z);

        eye.rotation = new BABYLON.Vector3(alpha, -beta);
    }

    public static createFly(scene) {
        var fly = BABYLON.MeshBuilder.CreateSphere("fly", {diameter: 0.5, segments: 8}, scene);
        const material = new BABYLON.StandardMaterial("flymaterial", scene);
        material.diffuseColor = BABYLON.Color3.Red();   
        fly.material = material;
        return fly;
    }

    public static createEye(color: BABYLON.Color3, radius: number, scene: BABYLON.Scene): BABYLON.Mesh {
        var eyeball = BABYLON.MeshBuilder.CreateSphere("eyeball", {diameter: 2 * radius, segments: 16}, scene);

        const eyeballmaterial = new BABYLON.CellMaterial("eyeballmaterial", scene);
        eyeballmaterial.diffuseColor = BABYLON.Color3.White();
        eyeball.material = eyeballmaterial;

        var iris = BABYLON.MeshBuilder.CreateSphere("pupil", {diameter: 2* 0.4 * radius, segments: 8}, scene);
        iris.position.z = -radius*.97;
        iris.scaling.z = 0.05;  // Make it flat

        const irismaterial = new BABYLON.StandardMaterial("irismaterial", scene);
        irismaterial.diffuseColor = color;
        iris.material = irismaterial;
        
        var pupil = BABYLON.MeshBuilder.CreateSphere("pupil", {diameter: 2* 0.2 * radius, segments: 16}, scene);
        pupil.position.z = -radius*1;
        pupil.scaling.z = 0.1;  // Make it flat

        const pupilmaterial = new BABYLON.StandardMaterial("pupilmaterial", scene);
        pupilmaterial.disableLighting = true;
        pupilmaterial.diffuseColor = BABYLON.Color3.Black();   
        pupil.material = pupilmaterial;
        
        var eye = BABYLON.Mesh.MergeMeshes([eyeball, iris, pupil], true, true, undefined, false, true);
        return eye;
    }

    public static createEyePair(color: BABYLON.Color3, scene: BABYLON.Scene) : EyePair {
        var radius = 1;
        var left = this.createEye(color, radius, scene);
        var right = this.createEye(color, radius, scene);

        var distanceBetweenEyes = 1.7 * radius;
        left.position.x = -distanceBetweenEyes;
        right.position.x = distanceBetweenEyes;  

        return {left, right};
    }
}
