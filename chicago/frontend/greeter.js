$(document).ready(function(){
    
    //Slider Start
	$('#slider').cycle({
		fx: 'fade',
		timeout:   '7000',
		pager:  '#slideshow_nav_pager',
		next: '#next_arrw',
		prev: '#prev_arrw'
	});
	
    //Faq Accordion Start
    $('.faqs div').hide();
    $('.faqs h3').click(function() {        
        $('.faqs h3').removeClass('active');
        $('.faqs div').hide('slow');
        if( !$(this).next('div').is(":visible") ) {
            $( this ).addClass('active').next('div').show('slow');
        }
     });
     
     //Light Box Start
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
    
 //Click Outside of Menu  

    $('html').on('click, touchend', function (e) {
            // Close hamburger menu when tapping outside
            if ($(e.target).closest('#navbar').length == 0) {
                var opened = $('.navbar-collapse').hasClass('collapse in');
                if (opened === true) {
                    $('.navbar-collapse').collapse('hide');
                }

                $('#navbar.collapse').collapse('hide');
                /*if (!$(e.target).parents('.mob-dropdown').length) {
                    $('.mob-dropdown').removeClass('active');
                }*/
            }
        });

       
});


   