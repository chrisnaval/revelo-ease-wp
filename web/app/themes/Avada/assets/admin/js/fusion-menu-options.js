/* global fusionMenuConfig */
var FusionDelay = ( function() {
	var timer = 0;

	return function( callback, ms ) {
		clearTimeout( timer );
		timer = setTimeout( callback, ms );
	};
})();

function fusionIconPicker( value, id, container, search ) {
	var icons  = fusionMenuConfig.fontawesomeicons,
	    output = '';

	jQuery.each( icons, function( icon ) {
		var selectedClass = '';

		if ( value === icon ) {
			selectedClass = 'selected-element';
		}
		output += '<span class="icon_preview icon-' + icon + ' ' + selectedClass + '"><i class="fa ' + icon + '" data-name="' + icon + '"></i></span>';
	} );
	jQuery( container ).append( output );

	// Icon Search bar
	jQuery( search ).on( 'change paste keyup', function() {
		var thisEl = jQuery( this );

		FusionDelay( function() {
			if ( thisEl.val() ) {
				value = thisEl.val().toLowerCase();

				_.each( icons, function( icon ) {
					name = icon.toLowerCase(); // jshint ignore:line

					if ( name.search( value ) !== -1 ) {
						jQuery( '.icon_select_container .icon-' + name ).show();
					} else {
						jQuery( '.icon_select_container .icon-' + name ).hide();
					}
				} );

			} else {
				jQuery( '.icon_select_container .icon_preview' ).show();
			}
		}, 500 );
	} );

	// Iconpicker select/deselect handler.
	jQuery( container ).find( 'span' ).off();
	jQuery( container ).find( 'span' ).on( 'click', function( e ) {

		var iconWithPrefix,
		    fontName;

		e.preventDefault();

		iconWithPrefix  = jQuery( this ).find( 'i' ).attr( 'class' );
		fontName		= jQuery( this ).find( 'i' ).attr( 'data-name' );

		if ( jQuery( this ).hasClass( 'selected-element' ) ) {
			jQuery( this ).find( 'i' ).parent().parent().find( '.selected-element' ).removeClass( 'selected-element' );
			jQuery( this ).find( 'i' ).parent().parent().parent().find( '.fusion-iconpicker-input' ).attr( 'value', '' ).trigger( 'change' );

		} else {
			jQuery( this ).find( 'i' ).parent().parent().find( '.selected-element' ).removeClass( 'selected-element' );
			jQuery( this ).find( 'i' ).parent().addClass( 'selected-element' );
			jQuery( this ).find( 'i' ).parent().parent().parent().find( '.fusion-iconpicker-input' ).attr( 'value', fontName ).trigger( 'change' );
		}
	} );
}

jQuery( window ).load( function() {

	var $wrapEl,
	    itemWrapEl;

	if ( jQuery( 'body' ).hasClass( 'widgets-php' ) ) {
		$wrapEl =  jQuery( 'body' ).hasClass( 'widgets_access' ) ? jQuery( '.editwidget' ) : jQuery( '.widget-liquid-right' );
		itemWrapEl = '.widget-inside';
	} else {
		$wrapEl    = jQuery( '#post-body' );
		itemWrapEl = '.menu-item-settings';
	}

	// Backup holder in case of cancel.
	jQuery( 'body' ).append( '<div class="fusion-menu-clone" style="display:none !important"></div>' );

	// On open.
	$wrapEl.on( 'click', '.fusion-menu-option-trigger', function( event ) {
		var $value       = jQuery( this ).parent().find( '.fusion-iconpicker-input' ).val(),
		    $id          = jQuery( this ).parent().find( '.fusion-iconpicker-input' ).attr( 'id' ),
		    $container   = jQuery( this ).parent().find( '.icon_select_container' ),
		    $search      = jQuery( this ).parent().find( '.fusion-icon-search' ),
		    $options     = jQuery( this ).parent().find( '.fusion-options-holder' ),
		    $holder      = jQuery( this ).parents( '.menu-item-settings' ),
		    $modal       = jQuery( this ).parent().find( '.fusion-builder-modal-settings-container' ),
		    $colorPicker = jQuery( this ).parent().find( '.fusion-builder-color-picker-hex' ),
		    $clone;

		event.preventDefault();
		fusionIconPicker( $value, $id, $container, $search );

		jQuery( $holder ).addClass( 'fusion-active' );
		jQuery( this ).parent().find( '.fusion_builder_modal_overlay' ).show();
		jQuery( $modal ).show();
		jQuery( 'body' ).addClass( 'fusion_builder_no_scroll' );

		// Button set functionality.
		jQuery( $modal ).find( '.fusion-form-radio-button-set a' ).on( 'click', function( event ) {
			var $radiosetcontainer;

			event.preventDefault();
			$radiosetcontainer = jQuery( this ).parents( '.fusion-form-radio-button-set' );
			$radiosetcontainer.find( '.ui-state-active' ).removeClass( 'ui-state-active' );
			jQuery( this ).addClass( 'ui-state-active' );
			$radiosetcontainer.find( '.button-set-value' ).val( $radiosetcontainer.find( '.ui-state-active' ).data( 'value' ) ).trigger( 'change' );
		});

		// Save as a backup.
		$clone = jQuery( $options ).clone( true, true );
		jQuery( '.fusion-menu-clone' ).append( $clone );

		// Select field functionality.
		jQuery( $modal ).find( '.fusion-builder-option select' ).selectWoo({
			minimumResultsForSearch: 10,
			dropdownCssClass: 'avada-select2',
			width: '100%'
		});
		if ( $colorPicker.length ) {
			$colorPicker.each( function() {
				jQuery( this ).wpColorPicker( {
					palettes: ['#000000', '#ffffff', '#f44336', '#E91E63', '#03A9F4', '#00BCD4', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#607D8B']
				} );
			});
		}

		if ( '.widget-inside' === itemWrapEl  && 'auto' !== jQuery( this ).closest( '.widget' ).css( 'z-index' ) ) {
			jQuery( this ).closest( '.widget' ).css( 'z-index', '99999' );
		}
	});

	// On cancel.
	$wrapEl.on( 'click', '.fusion-builder-modal-close', function( event ) {
		var $backup = jQuery( '.fusion-menu-clone' ).find( '.fusion-builder-modal-settings-container' ).hide();

		event.preventDefault();

		if ( '.widget-inside' === itemWrapEl  && 'auto' !== jQuery( this ).closest( '.widget' ).css( 'z-index' ) ) {
			jQuery( this ).closest( '.widget' ).css( 'z-index', '100' );
		}

		jQuery( '.fusion-builder-option .wp-color-picker' ).wpColorPicker( 'close' );
		jQuery( '.fusion-builder-option select.select2-hidden-accessible' ).selectWoo( 'destroy' );
		jQuery( '.fusion-active' ).removeClass( 'fusion-active' );
		jQuery( this ).parents( '.fusion-builder-modal-settings-container' ).replaceWith( $backup );
		jQuery( this ).parents( '.fusion-builder-modal-settings-container' ).hide();
		jQuery( '.fusion_builder_modal_overlay' ).hide();
		jQuery( 'body' ).removeClass( 'fusion_builder_no_scroll' );
		jQuery( '.fusion-menu-clone' ).html( '' );

	});

	// On outside click.
	$wrapEl.on( 'click', itemWrapEl + ' .fusion_builder_modal_overlay', function( event ) {
		var $backup = jQuery( '.fusion-menu-clone' ).find( '.fusion-builder-modal-settings-container' ).hide();

		event.preventDefault();

		if ( '.widget-inside' === itemWrapEl  && 'auto' !== jQuery( this ).closest( '.widget' ).css( 'z-index' ) ) {
			jQuery( this ).closest( '.widget' ).css( 'z-index', '100' );
		}

		jQuery( '.fusion-builder-option .wp-color-picker' ).wpColorPicker( 'close' );
		jQuery( '.fusion-builder-option select.select2-hidden-accessible' ).selectWoo( 'destroy' );
		jQuery( '.fusion-active' ).removeClass( 'fusion-active' );
		jQuery( this ).next().replaceWith( $backup );
		jQuery( this ).next().hide();
		jQuery( '.fusion_builder_modal_overlay' ).hide();
		jQuery( 'body' ).removeClass( 'fusion_builder_no_scroll' );
		jQuery( '.fusion-menu-clone' ).html( '' );
	});

	// On save,
	$wrapEl.on( 'click', '.fusion-builder-modal-save', function( event ) {
		event.preventDefault();

		if ( '.widget-inside' === itemWrapEl  && 'auto' !== jQuery( this ).closest( '.widget' ).css( 'z-index' ) ) {
			jQuery( this ).closest( '.widget' ).css( 'z-index', '100' );
		}

		jQuery( '.fusion-builder-option .wp-color-picker' ).wpColorPicker( 'close' );
		jQuery( '.fusion-builder-option select.select2-hidden-accessible' ).selectWoo( 'destroy' );
		jQuery( '.fusion-active' ).removeClass( 'fusion-active' );
		jQuery( this ).parents( '.fusion-builder-modal-settings-container' ).hide();
		jQuery( '.fusion_builder_modal_overlay' ).hide();
		jQuery( 'body' ).removeClass( 'fusion_builder_no_scroll' );
		jQuery( '.fusion-menu-clone' ).html( '' );
	});
});
