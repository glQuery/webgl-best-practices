// Source: https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js

		this.render = function( scene, camera, renderTarget, forceClear ) {

		  var i, program, opaque, transparent, material,
			  o, ol, oil, webglObject, object, buffer,
			  lights = scene.lights,
			  fog = scene.fog;

		  _currentMaterialId = -1;

		  if ( this.shadowMapEnabled ) renderShadowMap( scene, camera );

		  _this.info.render.calls = 0;
		  _this.info.render.vertices = 0;
		  _this.info.render.faces = 0;

		  camera.matrixAutoUpdate && camera.update( undefined, true );

		  scene.update( undefined, false, camera );

		  camera.matrixWorldInverse.flattenToArray( _viewMatrixArray );
		  camera.projectionMatrix.flattenToArray( _projectionMatrixArray );

		  _projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		  computeFrustum( _projScreenMatrix );

		  this.initWebGLObjects( scene );

		  setRenderTarget( renderTarget );

		  if ( this.autoClear || forceClear ) {

			  this.clear( this.autoClearColor, this.autoClearDepth, this.autoClearStencil );

		  }

		  // set matrices

		  ol = scene.__webglObjects.length;

		  for ( o = 0; o < ol; o ++ ) {

			  webglObject = scene.__webglObjects[ o ];
			  object = webglObject.object;

			  if ( object.visible ) {

				  if ( ! ( object instanceof THREE.Mesh ) || ! ( object.frustumCulled ) || isInFrustum( object ) ) {

					  object.matrixWorld.flattenToArray( object._objectMatrixArray );

					  setupMatrices( object, camera, true );

					  unrollBufferMaterials( webglObject );

					  webglObject.render = true;

					  if ( this.sortObjects ) {

						  if ( webglObject.object.renderDepth ) {

							  webglObject.z = webglObject.object.renderDepth;

						  } else {

							  _vector3.copy( object.position );
							  _projScreenMatrix.multiplyVector3( _vector3 );

							  webglObject.z = _vector3.z;

						  }

					  }

				  } else {

					  webglObject.render = false;

				  }

			  } else {

				  webglObject.render = false;

			  }

		  }

		  if ( this.sortObjects ) {

			  scene.__webglObjects.sort( painterSort );

		  }

		  oil = scene.__webglObjectsImmediate.length;

		  for ( o = 0; o < oil; o ++ ) {

			  webglObject = scene.__webglObjectsImmediate[ o ];
			  object = webglObject.object;

			  if ( object.visible ) {

				  if( object.matrixAutoUpdate ) {

					  object.matrixWorld.flattenToArray( object._objectMatrixArray );

				  }

				  setupMatrices( object, camera, true );

				  unrollImmediateBufferMaterials( webglObject );

			  }

		  }

		  if ( scene.overrideMaterial ) {

			  setDepthTest( scene.overrideMaterial.depthTest );
			  setBlending( scene.overrideMaterial.blending );

			  for ( o = 0; o < ol; o ++ ) {

				  webglObject = scene.__webglObjects[ o ];

				  if ( webglObject.render ) {

					  object = webglObject.object;
					  buffer = webglObject.buffer;

					  setObjectFaces( object );

					  renderBuffer( camera, lights, fog, scene.overrideMaterial, buffer, object );

				  }

			  }

			  for ( o = 0; o < oil; o ++ ) {

				  webglObject = scene.__webglObjectsImmediate[ o ];
				  object = webglObject.object;

				  if ( object.visible ) {

					  _currentGeometryGroupHash = -1;

					  setObjectFaces( object );

					  program = setProgram( camera, lights, fog, scene.overrideMaterial, object );

					  if ( object.immediateRenderCallback ) {

						  object.immediateRenderCallback( program, _gl, _frustum );

					  } else {

						  object.render( function( object ) { renderBufferImmediate( object, program, scene.overrideMaterial.shading ); } );

					  }

				  }

			  }

		  } else {

			  // opaque pass
			  // (front-to-back order)

			  setBlending( THREE.NormalBlending );

			  for ( o = ol - 1; o >= 0; o -- ) {

				  webglObject = scene.__webglObjects[ o ];

				  if ( webglObject.render ) {

					  object = webglObject.object;
					  buffer = webglObject.buffer;
					  opaque = webglObject.opaque;

					  setObjectFaces( object );

					  for ( i = 0; i < opaque.count; i ++ ) {

						  material = opaque.list[ i ];

						  setDepthTest( material.depthTest );
						  setDepthWrite( material.depthWrite );
						  setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );
						  renderBuffer( camera, lights, fog, material, buffer, object );

					  }

				  }

			  }

			  // opaque pass (immediate simulator)

			  for ( o = 0; o < oil; o++ ) {

				  webglObject = scene.__webglObjectsImmediate[ o ];
				  object = webglObject.object;

				  if ( object.visible ) {

					  _currentGeometryGroupHash = -1;

					  opaque = webglObject.opaque;

					  setObjectFaces( object );

					  for( i = 0; i < opaque.count; i++ ) {

						  material = opaque.list[ i ];

						  setDepthTest( material.depthTest );
						  setDepthWrite( material.depthWrite );
						  setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

						  program = setProgram( camera, lights, fog, material, object );

						  if ( object.immediateRenderCallback ) {

							  object.immediateRenderCallback( program, _gl, _frustum );

						  } else {

							  object.render( function( object ) { renderBufferImmediate( object, program, material.shading ); } );

						  }

					  }

				  }

			  }

			  // transparent pass
			  // (back-to-front order)

			  for ( o = 0; o < ol; o ++ ) {

				  webglObject = scene.__webglObjects[ o ];

				  if ( webglObject.render ) {

					  object = webglObject.object;
					  buffer = webglObject.buffer;
					  transparent = webglObject.transparent;

					  setObjectFaces( object );

					  for ( i = 0; i < transparent.count; i ++ ) {

						  material = transparent.list[ i ];

						  setBlending( material.blending );
						  setDepthTest( material.depthTest );
						  setDepthWrite( material.depthWrite );
						  setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

						  renderBuffer( camera, lights, fog, material, buffer, object );

					  }

				  }

			  }

			  // transparent pass (immediate simulator)

			  for ( o = 0; o < oil; o++ ) {

				  webglObject = scene.__webglObjectsImmediate[ o ];
				  object = webglObject.object;

				  if ( object.visible ) {

					  _currentGeometryGroupHash = -1;

					  transparent = webglObject.transparent;

					  setObjectFaces( object );

					  for ( i = 0; i < transparent.count; i ++ ) {

						  material = transparent.list[ i ];

						  setBlending( material.blending );
						  setDepthTest( material.depthTest );
						  setDepthWrite( material.depthWrite );
						  setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

						  program = setProgram( camera, lights, fog, material, object );

						  if ( object.immediateRenderCallback ) {

							  object.immediateRenderCallback( program, _gl, _frustum );

						  } else {

							  object.render( function( object ) { renderBufferImmediate( object, program, material.shading ); } );

						  }

					  }

				  }

			  }

		  }

		  // render 2d

		  if ( scene.__webglSprites.length ) {

			  renderSprites( scene, camera );

		  }

		  // Generate mipmap if we're using any kind of mipmap filtering

		  if ( renderTarget && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			  updateRenderTargetMipmap( renderTarget );

		  }

		  //_gl.finish();

		};

