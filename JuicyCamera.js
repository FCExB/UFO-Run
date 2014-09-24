JuicyCamera = function (camera, target) {

    this.camera = camera;
    this.target = target;
    
    this.movementSpeed = 0.000001;
    
    this.currentFacingVector = target.position.clone();
    
    this.update = function( delta ) {
    
        var difference = new THREE.Vector3(0,0,0);
        
        difference.subVectors(this.target.position, this.currentFacingVector);
        difference.multiplyScalar(this.movementSpeed*delta*difference.lengthSq());
    
        this.currentFacingVector.add(difference);
    
        camera.lookAt(this.currentFacingVector);
	};
    
    this.reset = function() {
        this.currentFacingVector = target.position.clone();
        camera.lookAt(this.currentFacingVector);
    }
}