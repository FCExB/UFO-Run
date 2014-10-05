Control = function (object, spaceCallback, moveCallback, rotateCallback, domElement) {

    this.object = object;
    
    this.spaceCallback = spaceCallback;
    this.moveCallback = moveCallback;
    this.rotateCallback = rotateCallback;
    
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );
    
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    
    this.acceleration = 0.0068;
    this.maxSpeed = 0.84;
    this.drag = 0.8;
    
    this.rollSpeed = 0.0018;
    
    this.newControls = true;
    
    this.moveState = { 
        up: 0, 
        down: 0, 
        left: 0, 
        right: 0,
        rollLeft: 0, 
        rollRight: 0
    };
    
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
    this.rotationVector = new THREE.Vector3( 0, 0, 0 );

    this.keydown = function( event ) {
    
		if ( event.altKey ) {
			return;
		}

		event.preventDefault();

        if (this.newControls) {
            switch ( event.keyCode ) {

                case 87: /*W*/ this.moveState.up = 1; break;
                case 38: /*Up*/ this.moveState.up = 1; break;
                case 83: /*S*/ this.moveState.down = 1; break;
                case 40: /*Down*/ this.moveState.down = 1; break;

                case 65: /*A*/ this.moveState.left = 1; break;
                case 37: /*Left*/ this.moveState.rollLeft = 1; break;
                case 68: /*D*/ this.moveState.right = 1; break;
                case 39: /*Right*/ this.moveState.rollRight = 1; break;
                
                case 81: /*Q*/ this.moveState.rollLeft = 1; break;
                case 90: /*Z*/ this.moveState.left = 1; break;
                case 69: /*E*/ this.moveState.rollRight = 1; break;
                case 88: /*X*/ this.moveState.right = 1; break;
                
                case 32: /*Space*/ this.spaceCallback(); break;
            }
        } else {
            switch ( event.keyCode ) {

                case 87: /*W*/ this.moveState.up = 1; break;
                case 38: /*Up*/ this.moveState.up = 1; break;
                case 83: /*S*/ this.moveState.down = 1; break;
                case 40: /*Down*/ this.moveState.down = 1; break;

                case 65: /*A*/ this.moveState.left = 1; break;
                case 37: /*Left*/ this.moveState.left = 1; break;
                case 68: /*D*/ this.moveState.right = 1; break;
                case 39: /*Right*/ this.moveState.right = 1; break;
                
                case 81: /*Q*/ this.moveState.rollLeft = 1; break;
                case 90: /*Z*/ this.moveState.rollLeft = 1; break; 
                case 69: /*E*/ this.moveState.rollRight = 1; break;
                case 88: /*X*/ this.moveState.rollRight = 1; break;
                
                case 32: /*Space*/ this.spaceCallback(); break;
            }
        }
        
        if (this.moveState.up || this.moveState.down || this.moveState.left || this.moveState.right)
        {
            this.moveCallback();
        }
        
        if (this.moveState.rollLeft || this.moveState.rollRight)
        {
            this.rotateCallback();
        }

        this.updateMovementVector();
        this.updateRotationVector();
	};

	this.keyup = function( event ) {
    
        if (this.newControls) {
            switch( event.keyCode ) {
                case 87: /*W*/ this.moveState.up = 0; break;
                case 38: /*Up*/ this.moveState.up = 0; break;
                case 83: /*S*/ this.moveState.down = 0; break;
                case 40: /*Down*/ this.moveState.down = 0; break;

                case 65: /*A*/ this.moveState.left = 0; break;
                case 37: /*Left*/ this.moveState.rollLeft = 0; break;
                case 68: /*D*/ this.moveState.right = 0; break;
                case 39: /*Right*/ this.moveState.rollRight = 0; break;
                
                case 81: /*Q*/ this.moveState.rollLeft = 0; break;
                case 90: /*Z*/ this.moveState.left = 0; break;
                case 69: /*E*/ this.moveState.rollRight = 0; break;
                case 88: /*X*/ this.moveState.right = 0; break;
            }
        } else {
            switch( event.keyCode ) {
                case 87: /*W*/ this.moveState.up = 0; break;
                case 38: /*Up*/ this.moveState.up = 0; break;
                case 83: /*S*/ this.moveState.down = 0; break;
                case 40: /*Down*/ this.moveState.down = 0; break;

                case 65: /*A*/ this.moveState.left = 0; break;
                case 37: /*Left*/ this.moveState.left = 0; break;
                case 68: /*D*/ this.moveState.right = 0; break;
                case 39: /*Right*/ this.moveState.right = 0; break;
                
                case 81: /*Q*/ this.moveState.rollLeft = 0; break;
                case 90: /*Z*/ this.moveState.rollLeft = 0; break;
                case 69: /*E*/ this.moveState.rollRight = 0; break;
                case 88: /*X*/ this.moveState.rollRight = 0; break;
            }        
        }

		this.updateMovementVector();
        this.updateRotationVector();

	};
    
    this.update = function( delta ) {

        // Movement
        this.moveVector.multiplyScalar(this.acceleration * delta);
        this.velocity.add(this.moveVector);
        this.moveVector.normalize();
        
        var speed = Math.min(this.velocity.length(), this.maxSpeed);    
        
        //console.log("Speed: " + speed);
   
        this.object.translateOnAxis(this.velocity.normalize(), speed * delta);
        
        this.object.position.x = Math.min(this.object.position.x, 350);
        this.object.position.x = Math.max(this.object.position.x, -350);
        this.object.position.y = Math.min(this.object.position.y, 800);
        this.object.position.y = Math.max(this.object.position.y, 100);
        

        
        this.velocity.multiplyScalar(speed);
        
        this.velocity.multiplyScalar(this.drag);
        
        
        // Rotations
        var rotMult = delta * this.rollSpeed;
        
        var q = new THREE.Quaternion( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 );
		this.object.quaternion.multiply( q );

		// expose the rotation vector for convenience
		this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
	};

	this.updateMovementVector = function() {

		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
        this.moveVector.z = 0;

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
	};
    
    this.updateRotationVector = function() {

		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
	};
    
    function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );

		};
	};
    
    window.addEventListener( 'keydown', bind( this, this.keydown ), false );
	window.addEventListener( 'keyup',   bind( this, this.keyup ), false );
    
    this.updateMovementVector();
    this.updateRotationVector();
}