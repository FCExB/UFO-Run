JuicyCamera = function (camera, target) {

    this.camera = camera;
    this.target = target;
    
    this.z = camera.position.z;
    
    this.movementSpeed = 0.9;
    
    this.currentFacingVector = target.position.clone();
    
    this.update = function( delta ) {
    
    
        // Move to
        var difference = new THREE.Vector3(0,0,0);
        
        var thing = this.target.localToWorld(new THREE.Vector3(0,50,0));
        
        thing.z = this.z;

        difference.subVectors(thing, this.camera.position);
        
        difference.multiplyScalar(delta* 0.006);
        
        camera.position.add(difference);
        
        
        //Rotation
        this.camera.quaternion.slerp(this.target.quaternion, THREE.Math.clamp(delta * 0.006, 0, 1));   
        
        // Look At
        /*difference.subVectors(this.target.position, this.currentFacingVector);
        difference.multiplyScalar(this.movementSpeed*delta);
    
        this.currentFacingVector.add(difference);
    */
        //camera.lookAt(this.currentFacingVector);
        
        
        
        //camera.lookAt(this.target.position);

        
	};
    
    this.reset = function() {
        this.currentFacingVector = target.position.clone();
        camera.lookAt(this.currentFacingVector);
        
        camera.position = target.position.clone();
        camera.position.z = this.z;
    }
}