(function($) {
	
	
	$.circusCarousel = function(el, options) {
		var circus = $(el);
		
		circus.options = $.extend({}, $.circusCarousel.defaults, options);
		
		methods = {
			// internal variable
			vars: {
				containerWidth: 0,
				itemsCount: 0,
				itemWidth: 0,
				tallestHeight: 0,
				interval: null,
			},
			init: function() {
				if(methods.vars.interval != null) {
					clearInterval(methods.vars.interval);
				}
				
				circus.addClass('circus-container');
				
				
				methods.vars.containerWidth = circus.width();
				methods.vars.itemsCount = circus.find(circus.options.selector).length;
				methods.vars.itemWidth = methods.vars.containerWidth / Math.ceil(methods.vars.itemsCount / 2);
				
				circus.find('.circus-slides').css({'position': 'relative'});
				
				// Find the tallest element
				circus.find(circus.options.selector).each(function(idx, item) {
					methods.vars.tallestHeight = Math.max( methods.vars.tallestHeight, $(item).outerHeight());
					$(item).attr('data-circus-position', idx);
					
					$(item).on('mouseenter', methods.hoverIn).on('mouseout', methods.hoverOut);
				});
				
				circus.height(methods.vars.tallestHeight * 2);
				
				methods.placeItems(circus.find(circus.options.selector));
				
				if(circus.options.autoPlay) {
					circus.start();
				}
			},
			reInit: function() {
				if(methods.vars.interval != null) {
					clearInterval(methods.vars.interval);
				}
				
				methods.vars.containerWidth = circus.width();
				methods.vars.itemsCount = circus.find(circus.options.selector).length;
				methods.vars.itemWidth = methods.vars.containerWidth / Math.ceil(methods.vars.itemsCount / 2);
				
				circus.find(circus.options.selector).each(function(idx, item) {
					methods.vars.tallestHeight = Math.max( methods.vars.tallestHeight, $(item).outerHeight());
				});
				
				circus.height(methods.vars.tallestHeight * 2);
				
				itemsSorted = $(circus).find(circus.options.selector).sort(function (a, b) {
					var contentA = parseInt( $(a).attr('data-circus-position'));
					var contentB = parseInt( $(b).attr('data-circus-position'));
					return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
				});
				
				methods.placeItems(itemsSorted);
				
				if(circus.options.autoPlay) {
					circus.start();
				}
				
			},
			placeItems: function(items) {
				if(methods.vars.interval != null) {
					clearInterval(methods.vars.interval);
				}
				
				items.each(function(idx, item) {
					topPlacement = (idx + 1 <= Math.floor(methods.vars.itemsCount / 2) + (methods.vars.itemsCount % 2 == 0 ? 0 : (circus.options.oddPosition == 'bottom' ? 0 : 1))) ? 'top' : 'bottom';
					
					leftOffset = 0;
					rightOffset = 0;
					
					if(circus.options.oddPosition == 'bottom') {
						// Odd Position at bottom
						if(topPlacement == 'top') {
							// Item Position at top
							if(methods.vars.itemsCount % 2 > 0) {
								// if items count is odd
								leftOffset = idx * methods.vars.itemWidth + methods.vars.itemWidth / 2
							} else {
								// if items ocunt is even
								leftOffset = idx * methods.vars.itemWidth;
								
							}
							
							rightOffset = 'auto';
						} else {
							// Item position at bottom
							if(methods.vars.itemsCount % 2 > 0) {
								// items count is odd
								rightOffset = (idx - methods.vars.itemsCount / 2) * methods.vars.itemWidth + methods.vars.itemWidth / 2;
							} else {
								// items count is even
								rightOffset = (idx - methods.vars.itemsCount / 2) * methods.vars.itemWidth;
							}
							
							leftOffset = 'auto';
						}
					} else {
						// Odd position at top
						if(topPlacement == 'top') {
							
							// Item position at top
							if(methods.vars.itemsCount % 2 > 0) {
								// items count is odd
								leftOffset = idx * methods.vars.itemWidth + methods.vars.itemWidth / 2;
								
							} else {
								// items count is even
								leftOffset = idx * methods.vars.itemWidth;
							}
							
							rightOffset = 'auto';
						} else {
							//Item position at bottom
							if(methods.vars.itemsCount % 2 > 0) {
								// items count is odd
								rightOffset = (idx - methods.vars.itemsCount / 2) * methods.vars.itemWidth + methods.vars.itemWidth / 2;
								
							} else {
								// items count is even
								rightOffset = (idx - methods.vars.itemsCount / 2) * methods.vars.itemWidth;
							}
							
							leftOffset = 'auto';
						}
					}
					
					
					$(item).css({
						'width':methods.vars.itemWidth +  'px',
						'position':'absolute',
						'top': (topPlacement == 'top' ? 0 : methods.vars.tallestHeight) + 'px',
						'left': leftOffset + (leftOffset != 'auto' ? 'px' : ''),
						'right': rightOffset + (rightOffset != 'auto' ? 'px' : ''),
					});
					
					
				});
				
				if(circus.options.autoPlay) {
					circus.start();
				}
			},
			hoverIn: function() {
				
				if(circus.options.autoPlay && circus.options.stopOnHover) {
					clearInterval(methods.vars.interval);
				}
			},
			hoverOut: function() {
				if(circus.options.autoPlay) {
					circus.start();
				}
			},
			destroy: function() {
				if(methods.vars.interval != null) {
					clearInterval(methods.vars.interval);
				}
				circus.find(circus.options.selector).removeAttr('style')
					.off('mouseenter', methods.hoverIn)
					.off('mouseout', methods.hoverOut);;
				circus.removeClass('circus-container');
				
			}
		}
		
		circus.start = function() {
			if(circus.options.initialMotion == 'forward') {
				methods.vars.interval = setInterval(function(){
					circus.forward();
				}, circus.options.autoPlayInterval);
			} else {
				methods.vars.interval = setInterval(function(){
					circus.backward();
				}, circus.options.autoPlayInterval);
			}
			
		}
		
		circus.forward = function() {
			
			itemsSorted = $(circus).find(circus.options.selector).each(function(idx, item) {
				itemPosition = parseInt($(item).attr('data-circus-position'));
				
				if(itemPosition == methods.vars.itemsCount - 1) {
					$(item).attr('data-circus-position', 0);
				} else {
					$(item).attr('data-circus-position', itemPosition + 1);
				}
			}).sort(function (a, b) {
				var contentA = parseInt( $(a).attr('data-circus-position'));
				var contentB = parseInt( $(b).attr('data-circus-position'));
				return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
			});
			
			methods.placeItems(itemsSorted);
			
		}
		
		circus.backward = function() {
			
			itemsSorted = $(circus).find(circus.options.selector).each(function(idx, item) {
				itemPosition = parseInt($(item).attr('data-circus-position'));
				
				if(itemPosition == 0) {
					$(item).attr('data-circus-position', methods.vars.itemsCount);
				} else {
					$(item).attr('data-circus-position', itemPosition - 1);
				}
			}).sort(function (a, b) {
				var contentA = parseInt( $(a).attr('data-circus-position'));
				var contentB = parseInt( $(b).attr('data-circus-position'));
				return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
			});
			
			methods.placeItems(itemsSorted);
			
		}
		
		circus.destroy = function() {
			methods.destroy();
			circus = null;
		}
		
		$(window).on('resize',function() {
			methods.reInit();
		})
		
		methods.init();
		
		$.data(el, "circuscarousel", circus);
		
		return circus;
	}
	
	$.circusCarousel.defaults = {
		autoPlay: true,
		selector: '.circus-slides > li',
		oddPosition: 'bottom',
		initialMotion: 'forward',
		autoPlayInterval: 5000,
		stopOnHover: true
	}
	
	
	$.fn.circusCarousel = function(options) {
		if(typeof options === 'object') {
			return $.circusCarousel(this, options);
		} 
	};
})(jQuery);