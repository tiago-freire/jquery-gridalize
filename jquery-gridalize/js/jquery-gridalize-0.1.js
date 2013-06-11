jQuery.fn.extend({
	gridalize: function(parameters) {
                //initializing
		var defaultOptions = {
			verticalSpace: ''
		};
		
		var options = jQuery.extend(defaultOptions, parameters);
		var parent = jQuery(this);
		var children = parent.children();
		var totalWidth = parent.width();
		var images = parent.children('img');
		var countImagesLoaded = 0;
                var isIE6 = jQuery.browser.msie && parseInt(jQuery.browser.version) == 6;
		var calculateMarginLeft = function(totalWidth, countByLine, averageWidth) {
			return Math.floor((totalWidth - (countByLine * averageWidth)) / (countByLine + 1));
		};
		var calculateRatio = function(totalWidth, countByLine, averageWidth, marginLeft) {
                        return (totalWidth - (countByLine * (marginLeft + averageWidth) + marginLeft)) / countByLine;
		};

		/* ensuring loading of images */
		images.each(function() {
			/* binding an increased of images count on load event */
			jQuery(this).load(function() { countImagesLoaded++; });

			/* when image is in cache or the browser is IE6, the load event is triggered */
			if(this.complete || isIE6) {
				jQuery(this).trigger("load");
			}
		});

		if(countImagesLoaded == images.length) {
			var totalCount = 0;
			var sumWidth = 0;
			
			children.each(function() {
				var eachWidth = jQuery(this).outerWidth();

				if(eachWidth > 0) {
					jQuery(this).css('float', 'left');
					sumWidth += eachWidth;
					totalCount++;
				}
			});

			var averageWidth = sumWidth / totalCount;

			var maxCountByLine = Math.floor(totalWidth / averageWidth);
			var countByLine = maxCountByLine < totalCount ? maxCountByLine : totalCount;

			var marginLeft = calculateMarginLeft(totalWidth, countByLine, averageWidth);
                        var ratio = calculateRatio(totalWidth, countByLine, averageWidth, marginLeft);
			
			if(ratio >= 0.5 && ratio <= 1) {
				countByLine = Math.floor(0.75 * countByLine);
				marginLeft = calculateMarginLeft(totalWidth, countByLine, averageWidth);
			}
			
			var newProperties = {};
			newProperties['margin-left'] = marginLeft + 'px';
			if(options.verticalSpace) {
				newProperties['margin-top'] = options.verticalSpace;
				parent.css('padding-bottom', options.verticalSpace);
				
			}

			children.css(newProperties);
		}
	}
});