jQuery.fn.extend({
	centralize: function(parameters) {
		var defaultOptions = {
			verticalSpace: ''
		}
		
		var options = jQuery.extend(defaultOptions, parameters);
		
		var parent = $(this);
		var children = parent.children();
		var totalWidth = parent.width();
		console.log('totalWidth = ' + totalWidth);
		var images = parent.children('img');
		var countImagesLoaded = 0;
		
		var calculateMarginLeft = function(totalWidth, count, averageWidth) {
			return Math.floor((totalWidth - (count * averageWidth)) / (count + 1));
		};
		
		var calculateRatio = function(totalWidth, count, averageWidth, marginLeft) {
			return (totalWidth - (count * (marginLeft + averageWidth) + marginLeft)) / count;
		};

		images.each(function() {
			jQuery(this).load(function() { countImagesLoaded++; });

			if(this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6)) {
				jQuery(this).trigger("load");
			}
		});

		if(countImagesLoaded == images.length) {
			var totalCount = 0;
			var sumWidth = 0;
			
			children.each(function() {
				var eachWidth = jQuery(this).outerWidth();
				console.log('jQuery(this).outerWidth() = ' + jQuery(this).outerWidth());
				if(eachWidth > 0) {
					jQuery(this).css('float', 'left');
					sumWidth += eachWidth;
					totalCount++;
				}
			});

			var averageWidth = sumWidth / totalCount;
			console.log('averageWidth = ' + averageWidth);

			var maxCountByLine = Math.floor(totalWidth / averageWidth);
			var count = maxCountByLine < totalCount ? maxCountByLine : totalCount;
			console.log('maxCountByLine = ' + maxCountByLine);
			console.log('totalCount = ' + totalCount);
			console.log('count = ' + count);

			var marginLeft = calculateMarginLeft(totalWidth, count, averageWidth);
			console.log('marginLeft = ' + marginLeft);
			while(calculateRatio(totalWidth, count, averageWidth, marginLeft) != 0) {
				console.log('ratio = ' + calculateRatio(totalWidth, count, averageWidth, marginLeft));
				marginLeft = calculateMarginLeft(totalWidth, --count, averageWidth);
				console.log('NEW marginLeft = ' + marginLeft);
			}
			
//			if(ratio > 0 && ratio < 1) {
//				marginLeft = calculateMarginLeft(totalWidth, --count, averageWidth);
//				console.log('NEW marginLeft = ' + marginLeft);
//			}
			
			var newProperties = {};
			newProperties['margin-left'] = marginLeft;
			if(options.verticalSpace) {
				newProperties['margin-top'] = options.verticalSpace;
				parent.css('padding-bottom', options.verticalSpace);
				
			}
//			if(maxCountByLine < totalCount) {
//				newProperties['margin-top'] = marginLeft;
//			} else {
//				newProperties['margin-top'] = Math.floor(marginLeft / 5);
//			}

			children.css(newProperties);
		}
	}
});