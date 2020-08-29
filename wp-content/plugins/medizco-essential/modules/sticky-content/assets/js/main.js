(function ($, elementor) {
    "use strict";
    

	var ElementskitLite = {
		init: function () {
			elementor.hooks.addAction('frontend/element_ready/global', function($scope){
				new EkitStickyHandler({ $element: $scope });
			});
		}
	};
	$(window).on('elementor/frontend/init', ElementskitLite.init);

	var EkitStickyHandler = elementorFrontend.Module.extend({

		bindEvents: function bindEvents() {
			elementorFrontend.addListenerOnce(this.getUniqueHandlerID() + 'sticky', 'resize', this.run);
		},
	
		unbindEvents: function unbindEvents() {
			elementorFrontend.removeListeners(this.getUniqueHandlerID() + 'sticky', 'resize', this.run);
		},
	
		isActive: function isActive() {
			return undefined !== this.$element.data('sticky');
		},
	
		activate: function activate() {

			var elementSettings = this.getElementSettings(),
				stickyOptions = {
				to: elementSettings.ekit_sticky,
				offset: elementSettings.ekit_sticky_offset.size,
				effectsOffset: elementSettings.ekit_sticky_effect_offset.size,
				classes: {
					sticky: 'ekit-sticky',
					stickyActive: 'ekit-sticky--active ekit-section--handles-inside',
					stickyEffects: 'ekit-sticky--effects',
					spacer: 'ekit-sticky__spacer'
				}
			},
				$wpAdminBar = elementorFrontend.getElements('$wpAdminBar');
	
			if (elementSettings.ekit_sticky_parent) {
				stickyOptions.parent = '.ekit-widget-wrap';
			}
	
			if ($wpAdminBar.length && 'top' === elementSettings.ekit_sticky && 'fixed' === $wpAdminBar.css('position')) {
				stickyOptions.offset += $wpAdminBar.height();
			}
	
			this.$element.sticky(stickyOptions);
		},
	
		deactivate: function deactivate() {
			if (!this.isActive()) {
				return;
			}
	
			this.$element.sticky('destroy');
		},
	
		run: function run(refresh) {
			if (!this.getElementSettings('ekit_sticky')) {
				this.deactivate();
	
				return;
			}
	
			var currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
				activeDevices = this.getElementSettings('ekit_sticky_on');
	
			if (-1 !== activeDevices.indexOf(currentDeviceMode)) {
				if (true === refresh) {
					this.reactivate();
				} else if (!this.isActive()) {
					this.activate();
				}
			} else {
				this.deactivate();
			}
		},
	
		reactivate: function reactivate() {
			this.deactivate();
	
			this.activate();
		},
	
		onElementChange: function onElementChange(settingKey) {
			if (-1 !== ['ekit_sticky', 'ekit_sticky_on'].indexOf(settingKey)) {
				this.run(true);
			}
	
			if (-1 !== ['ekit_sticky_offset', 'ekit_sticky_effects_offset', 'ekit_sticky_parent'].indexOf(settingKey)) {
				this.reactivate();
			}
		},
	
		onInit: function onInit() {
			elementorFrontend.Module.prototype.onInit.apply(this, arguments);
	
			this.run();
		},
	
		onDestroy: function onDestroy() {
			elementorFrontend.Module.prototype.onDestroy.apply(this, arguments);
	
			this.deactivate();
		}
	});
}(jQuery, window.elementorFrontend));